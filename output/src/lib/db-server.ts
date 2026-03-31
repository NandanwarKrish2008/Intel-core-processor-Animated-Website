import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'users.json');
const PRODUCTS_FILE = path.join(process.cwd(), 'products.json');
const MESSAGES_FILE = path.join(process.cwd(), 'messages.json');

type JsonRecord = Record<string, unknown>;

// Helper to read JSON safely
function readJSON(file: string): JsonRecord[] {
    if (!fs.existsSync(file)) return [];
    try {
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data) as JsonRecord[];
    } catch {
        return [];
    }
}

// Helper to write JSON
function writeJSON(file: string, data: JsonRecord[]) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export async function getUsers() {
    return readJSON(USERS_FILE);
}

export async function saveUser(user: JsonRecord) {
    const users = readJSON(USERS_FILE);
    const newUser = { ...user, id: user.id || Math.random().toString(36).substr(2, 6) };
    users.push(newUser);
    writeJSON(USERS_FILE, users);
    return newUser;
}

export async function updateUser(id: string, data: JsonRecord) {
    const users = readJSON(USERS_FILE);
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    // If updating email, check for duplicates
    if (data.email && data.email !== users[index].email) {
        const duplicate = users.find((u) => u.email === data.email && u.id !== id);
        if (duplicate) throw new Error('Email already in use');
    }

    users[index] = { ...users[index], ...data };
    writeJSON(USERS_FILE, users);
    return true;
}

export async function deleteUser(id: string) {
    const users = readJSON(USERS_FILE);
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;
    writeJSON(USERS_FILE, filtered);
    return true;
}

export async function findUserByEmail(email: string) {
    const users = readJSON(USERS_FILE);
    return users.find((u) => u.email === email) || null;
}

export async function getMessages() {
    return readJSON(MESSAGES_FILE).sort((a, b) =>
        new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
    );
}

export async function saveMessage(message: JsonRecord) {
    const messages = readJSON(MESSAGES_FILE);
    const newMessage: JsonRecord = {
        ...message,
        id: Math.random().toString(36).substr(2, 6),
        status: 'unread',
        createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    writeJSON(MESSAGES_FILE, messages);
    return newMessage;
}

export async function updateMessageStatus(id: string, status: 'unread' | 'read') {
    const messages = readJSON(MESSAGES_FILE);
    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) return false;
    messages[index] = { ...messages[index], status };
    writeJSON(MESSAGES_FILE, messages);
    return true;
}

export async function deleteMessage(id: string) {
    const messages = readJSON(MESSAGES_FILE);
    const filtered = messages.filter((m) => m.id !== id);
    if (filtered.length === messages.length) return false;
    writeJSON(MESSAGES_FILE, filtered);
    return true;
}

export async function getProducts() {
    return readJSON(PRODUCTS_FILE);
}

export async function saveProduct(product: JsonRecord) {
    const products = readJSON(PRODUCTS_FILE);
    const newProduct = { ...product, id: product.id || Math.random().toString(36).substr(2, 6) };
    products.push(newProduct);
    writeJSON(PRODUCTS_FILE, products);
    return newProduct;
}

export async function updateProduct(id: string, data: JsonRecord) {
    const products = readJSON(PRODUCTS_FILE);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products[index] = { ...products[index], ...data };
    writeJSON(PRODUCTS_FILE, products);
    return true;
}

export async function deleteProduct(id: string) {
    const products = readJSON(PRODUCTS_FILE);
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    writeJSON(PRODUCTS_FILE, filtered);
    return true;
}
