import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const registerQuery = async (username: string, email: string, password: string, type: string, resetToken: string, resetTokenExpiry: Date) => {
    try {
        const result = await prisma.users.create({
            data: { 
                username,
                email,
                password,
                type,
                resetToken,
                resetTokenExpiry,
                roleId: 2,
                status: "active"
            },
        });
        return result;
    } catch (err) {
        console.error("Error in registerQuery:", err);
        throw err;
    }
};

const keepLoginQuery = async (id: number) => {
    try {
        const res = await prisma.users.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                roleId: true,
            },
        });
        return res;
    } catch (err) {
        console.error("Error in keepLoginQuery:", err);
        throw err;
    }
};

const forgotPasswordQuery = async (email: string, resetToken: string, resetTokenExpiry: Date) => {
    try {
        await prisma.users.update({ 
            where: { email },
            data: { resetToken, resetTokenExpiry } 
        });
    } catch (err) {
        console.error("Error in forgotPasswordQuery:", err);
        throw err;
    }
};

const setPasswordQuery = async (email: string, password: string) => {
    try {
        await prisma.users.update({
            where: { email: email },
            data: { password, resetToken: null, resetTokenExpiry: null }
        });
    } catch (err) {
        console.error("Error in setPasswordQuery:", err);
        throw err;
    }
};

const updatePasswordQuery = async (id: number, password: string) => {
    try {
        await prisma.users.update({
            where: { id: id },
            data: { password }
        });
    } catch (err) {
        console.error("Error in updatePasswordQuery:", err);
        throw err;
    }
};

export { registerQuery, keepLoginQuery, forgotPasswordQuery, setPasswordQuery, updatePasswordQuery };
