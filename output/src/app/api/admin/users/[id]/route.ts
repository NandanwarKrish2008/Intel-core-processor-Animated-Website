import { NextRequest, NextResponse } from 'next/server';
import { updateUser, deleteUser } from '@/lib/db-server';
import { getSession } from '@/lib/auth-shared';
import bcrypt from 'bcryptjs';

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

    const data = await request.json();
    const { id } = await params;

    // Handle password hashing if password is provided
    if (data.password && data.password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
    } else {
        // Remove empty password to avoid overwriting with blank
        delete data.password;
    }

    try {
        if (await updateUser(id, data)) {
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Update failed';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    let session;
    try {
        session = await getSession() as Session | null;
    } catch (err) {
        console.error(`[ADMIN] Session retrieval failed:`, err);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }

    if (!session || session.user.role !== 'admin') {
        process.stdout.write(`[ADMIN] Unauthorized deletion attempt from ${request.headers.get('x-forwarded-for') || 'unknown'}\n`);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    process.stdout.write(`[ADMIN] Request to delete user ID: ${id} by admin: ${session.user.email}\n`);

    // Prevent self-deletion
    if (id === session.user.id) {
        process.stdout.write(`[ADMIN] Admin ${session.user.email} attempted to delete their own account.\n`);
        return NextResponse.json({ error: 'You cannot delete your own admin account' }, { status: 400 });
    }

    try {
        const deleted = await deleteUser(id);
        if (deleted) {
            process.stdout.write(`[ADMIN] Successfully deleted user ID: ${id}\n`);
            return NextResponse.json({ success: true, message: 'User deleted successfully' });
        }
        process.stdout.write(`[ADMIN] Delete failed: User not found for ID: ${id}\n`);
        return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Deletion failed';
        process.stdout.write(`[ADMIN] ERROR during user deletion: ${message}\n`);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
