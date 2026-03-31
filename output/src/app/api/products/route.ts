import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/db-server';

export async function GET() {
    // Simulate database latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    const products = await getProducts();
    return NextResponse.json(products);
}
