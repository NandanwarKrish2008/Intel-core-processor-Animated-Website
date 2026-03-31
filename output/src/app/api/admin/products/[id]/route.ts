import { NextRequest, NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/db-server';
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
    const data = await request.json();

    if (await updateProduct(id, data)) {
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession() as Session | null;
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    console.log(`[ADMIN] Attempting to delete product ID: ${id}`);

    if (await deleteProduct(id)) {
        console.log(`[ADMIN] Successfully deleted product ID: ${id}`);
        return NextResponse.json({ success: true });
    }
    console.warn(`[ADMIN] Product not found for deletion: ${id}`);
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
}
