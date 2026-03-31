import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email, password, token } = await req.json();

        if (!email || !password || !token) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // In a real app, you would verify the token and update the password in the DB.
        // For this demo, we'll just simulate success.

        console.log(`Password reset success for: ${email}`);

        return NextResponse.json({
            message: 'Your password has been reset successfully.'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
