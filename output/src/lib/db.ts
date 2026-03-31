export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
    specs: {
        label: string;
        value: string;
    }[];
}

export const productsLog: Product[] = [];

export interface User {
    id: string;
    email: string;
    password?: string;
    role: 'admin' | 'user';
}

