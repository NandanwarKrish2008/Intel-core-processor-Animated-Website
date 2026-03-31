import { NextRequest, NextResponse } from 'next/server';
import { getUsers, saveUser } from '@/lib/db-server';
import { getSession } from '@/lib/auth-shared';
import bcrypt from 'bcryptjs';

interface Session {
    user: {
        id: string;
        email: string;
        role: string;
    };
}

export async function GET() {
    const session = await getSession() as Session | null;
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await getUsers();
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const session = await getSession() as Session | null;
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { email, password, role } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            email,
            password: hashedPassword,
            role: role || 'user'
        };

        const savedUser = await saveUser(newUser) as { id: string; email: string; role: string };
        return NextResponse.json({ success: true, user: { id: savedUser.id, email: savedUser.email, role: savedUser.role } });
    } catch (_error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
