import { NextRequest, NextResponse } from 'next/server';
import { updateMessageStatus, deleteMessage } from '@/lib/db-server';
import { getSession } from '@/lib/auth-shared';

interface Session {
    user: {
        id: string;
        email: string;
        role: string;
    };
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession() as Session | null;
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (await updateMessageStatus(id, status)) {
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    let session;
    try {
        session = await getSession() as Session | null;
    } catch (err) {
        process.stdout.write(`[ADMIN] Session retrieval failed for message deletion: ${err}\n`);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }

    if (!session || session.user.role !== 'admin') {
        process.stdout.write(`[ADMIN] Unauthorized message deletion attempt from ${request.headers.get('x-forwarded-for') || 'unknown'}\n`);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    process.stdout.write(`[ADMIN] Request to delete message ID: ${id} by admin: ${session.user.email}\n`);

    try {
        const deleted = await deleteMessage(id);
        if (deleted) {
            process.stdout.write(`[ADMIN] Successfully deleted message ID: ${id}\n`);
            return NextResponse.json({ success: true, message: 'Message deleted successfully' });
        }
        process.stdout.write(`[ADMIN] Delete failed: Message not found for ID: ${id}\n`);
        return NextResponse.json({ error: 'Message not found in database' }, { status: 404 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Deletion failed';
        process.stdout.write(`[ADMIN] ERROR during message deletion: ${message}\n`);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
