import { NextRequest, NextResponse } from 'next/server';
import { saveMessage } from '@/lib/db-server';

export async function POST(request: NextRequest) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const newMessage = await saveMessage({ name, email, message });

        return NextResponse.json({ success: true, message: newMessage });
    } catch (e) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
