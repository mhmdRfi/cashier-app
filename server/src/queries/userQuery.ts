import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findUserQuery = async ({ email = null, username = null }: { email?: string | null; username?: string | null }) => {
    try {
        const user = await prisma.users.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });

        return user;
    } catch (err) {
        console.error("Error in findUserQuery:", err);
        throw err;
    }
};

const findCashierQuery = async () => {
    try {
        const cashier = await prisma.users.findMany({
            where: {
                status: "active",
                roleId: 2,
            },
        });

        return cashier;
    } catch (err) {
        console.error("Error in findCashierQuery:", err);
        throw err;
    }
};

const findInactiveCashierQuery = async () => {
    try {
        const cashier = await prisma.users.findMany({
            where: {
                status: "inactive",
                roleId: 2,
            },
        });

        return cashier;
    } catch (err) {
        console.error("Error in findInactiveCashierQuery:", err);
        throw err;
    }
};

const updateCashierQuery = async (id: number, email: string, username: string, status: string, type: string) => {
    try {
        await prisma.users.update({
            where: { id: id },
            data: { email, username, status, type },
        });
    } catch (err) {
        console.error("Error in updateCashierQuery:", err);
        throw err;
    }
};

const deleteCashierQuery = async (id: number) => {
    try {
        await prisma.users.delete({
            where: { id: id },
        });
    } catch (err) {
        console.error("Error in deleteCashierQuery:", err);
        throw err;
    }
};

const uploadAvatarQuery = async (id: number, avatar: string) => {
    try {
        await prisma.users.update({
            where: { id: id },
            data: { avatar },
        });
    } catch (err) {
        console.error("Error in uploadAvatarQuery:", err);
        throw err;
    }
};

export { findUserQuery, findCashierQuery, updateCashierQuery, deleteCashierQuery, uploadAvatarQuery, findInactiveCashierQuery };
