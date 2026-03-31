import { NextRequest, NextResponse } from 'next/server';
import { saveUser, findUserByEmail } from '@/lib/db-server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            email,
            password: hashedPassword,
            role: 'user' as const
        };

        await saveUser(newUser);

        return NextResponse.json({ success: true, user: { email: newUser.email, role: newUser.role } });
    } catch (_e) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
