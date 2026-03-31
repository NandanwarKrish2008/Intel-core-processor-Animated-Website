import { NextResponse } from 'next/server';
import { getMessages } from '@/lib/db-server';
import { getSession } from '@/lib/auth-shared';

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

    const messages = await getMessages();
    return NextResponse.json(messages);
}
