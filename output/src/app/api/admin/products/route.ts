import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/db-server';
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
    return NextResponse.json(await getProducts());
}

export async function POST(request: NextRequest) {
    const session = await getSession() as Session | null;
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const product = await request.json();

        if (!product.name || !product.price || !product.category) {
            return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 });
        }

        const newProduct = {
            ...product,
            stock: product.stock || 0
        };

        const savedProduct = await saveProduct(newProduct);
        return NextResponse.json({ success: true, product: savedProduct });
    } catch (_error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
