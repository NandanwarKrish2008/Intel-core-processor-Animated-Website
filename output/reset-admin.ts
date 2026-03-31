import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'users.json');

interface User {
    id: string;
    email: string;
    password: string;
    role: string;
}

async function resetAdmin() {
    const users: User[] = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const admin = users.find((u: User) => u.email === 'admin@intel.com' || u.id === '1');

    if (admin) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash('password123', salt);
        admin.email = 'admin@intel.com';
        admin.role = 'admin';
        console.log('Admin user updated: admin@intel.com / Admin@123');
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } else {
        console.log('Admin user not found');
    }
}

resetAdmin().catch(console.error);
