import { cookies } from 'next/headers';
import { findUserByEmail } from './db-server';
import { encrypt } from './auth-shared';
import bcrypt from 'bcryptjs';

export * from './auth-shared';

export async function login(formData: { email?: string; password?: string }) {
    const user = await findUserByEmail(formData.email || '');

    if (user && user.password && await bcrypt.compare(formData.password || '', user.password as string)) {
        const sessionUser = { email: user.email as string, role: user.role as string };
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const session = await encrypt({ user: sessionUser, expires });

        (await cookies()).set('session', session, { expires, httpOnly: true });
        return { success: true, user: sessionUser };
    }
    return { success: false, error: 'Invalid credentials' };
}

export async function logout() {
    (await cookies()).set('session', '', { expires: new Date(0) });
}
