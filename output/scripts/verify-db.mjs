import { getUsers, updateUser, deleteProduct, getProducts } from './src/lib/db-server.ts';

async function test() {
    try {
        console.log("Initial Products:", (await getProducts()).length);

        // Test Deletion
        const successDelete = await deleteProduct("35gbo8");
        console.log("Delete 'test' product (35gbo8):", successDelete);

        console.log("Products after delete:", (await getProducts()).length);

        // Test User Update
        const users = await getUsers();
        if (users.length > 0) {
            const firstUser = users[0];
            console.log("Updating user:", firstUser.email);
            const successUpdate = await updateUser(firstUser.id, { role: 'admin' });
            console.log("Update user success:", successUpdate);
        }

        console.log("✅ Verification Complete");
    } catch (e) {
        console.error("❌ Verification Failed:", e);
    }
}

test();
