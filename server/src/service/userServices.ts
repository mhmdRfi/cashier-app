import { findCashierQuery, updateCashierQuery, deleteCashierQuery, findInactiveCashierQuery, uploadAvatarQuery } from "../queries/userQuery";

const findCashierService = async () => {
    try{
        const cashier = await findCashierQuery();
        return cashier;
    } catch (err){
        console.error("Error in findCashierService:", err);
        throw err;
    }
};

const findInactiveCashierService = async () => {
    try{
        const cashier = await findInactiveCashierQuery();
        return cashier;
    } catch (err){
        console.error("Error in findInactiveCashierService:", err);
        throw err;
    }
};

const updateCashierService = async (id: number, email: string, username: string, status: string, type: string) => {
    try{
        await updateCashierQuery(Number(id), String(email), String(username), String(status), String(type));
    } catch (err){
        console.error("Error in updateCashierService:", err);
        throw err;
    }
}

const deleteCashierService = async (id: number) => {
    try{
        await deleteCashierQuery(Number(id));
    } catch (err){
        console.error("Error in deleteCashierService:", err);
        throw err;
    }
}

const uploadAvatarService = async (id: number, avatar: string) => {
    try {
        await uploadAvatarQuery(Number(id), String(avatar))
    } catch (err) {
        console.error("Error in uploadAvatarService:", err);
        throw err
    }
}



export {findCashierService, updateCashierService, deleteCashierService, uploadAvatarService, findInactiveCashierService}
