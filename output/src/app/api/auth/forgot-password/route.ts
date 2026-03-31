import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // In a real app, you would check if the user exists in the DB
        // and send a reset link via email.
        // For this demo, we'll just simulate success.

        console.log(`Password reset requested for: ${email}`);

        return NextResponse.json({
            message: 'If an account exists with that email, a password reset link has been sent.',
            demo_link: `/reset-password?token=demo-token-123&email=${encodeURIComponent(email)}`
        }, { status: 200 });
    } catch (_error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
