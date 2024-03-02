import bcrypt from "bcrypt"
import jwt, {Secret} from "jsonwebtoken";
import { registerQuery, keepLoginQuery, forgotPasswordQuery, setPasswordQuery, updatePasswordQuery } from "../queries/authQuery"
import { findUserQuery } from "../queries/userQuery";
import handlebars from "handlebars";
import fs from "fs"
import path from "path";
import transporter from "../utils/transporter";

const registerService = async (username: string, email: string, password: string, type: string) => {
    try{

        const check = await findUserQuery({email, username}) 

        if (check) throw new Error("Email or username has already existed")

        const secretKey: Secret | undefined = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            throw new Error("JWT_SECRET_KEY is not set in the environment");
        }

        const resetToken = jwt.sign({email}, secretKey);
        const resetTokenExpiry = new Date(Date.now() + 3600000);

        // await forgotPasswordQuery (email, resetToken, resetTokenExpiry)

        const temp = await fs.readFileSync(
            path.join(__dirname, "../template", "reset-password.html"),
            "utf-8"
        );

        const resetPasswordLink = `${process.env.FE_BASE_URL}/auth/reset-password?resetToken=${resetToken}`
        const tempCompile = await handlebars.compile(temp);
        const tempResult = tempCompile({ email: email, link: resetPasswordLink });
        const gmailUser = process.env.GMAIL_USER;
        if (typeof gmailUser !== 'string') {
            throw new Error("GMAIL_USER is not set in the environment");
        }

        if (typeof email !== 'string') {
            throw new Error("Recipient email is invalid");
        }

        await transporter.sendMail({
            from: gmailUser,
            to: email,
            subject: "Email Confirmation",
            html: tempResult,
          });
          
        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(password, salt)
        const res = await registerQuery (username, email, hashPassword, type, resetToken, resetTokenExpiry)
    
        return res;
    } catch (err){
        console.error("Error in registerService:", err);
        throw err
    }
};

const loginService = async (email: string, password: string,) => {
    try{
        const check = await findUserQuery({email});
        if (!check) throw new Error ("email doesn't exist")

        if(!check.password) throw new Error("Password is not set for this user")

        if (check.status == "inactive") throw new Error("Cashier is inactive")

        const isValid = await bcrypt.compare(password, check.password);
        if (!isValid) throw new Error("Password is incorrect");

        const payload = {
            id: check.id,
            email: check.email,
            username: check.username,
            roleId: check.roleId,
            status: check.status,
        }

        const secretKey: Secret | undefined = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            throw new Error("JWT_SECRET_KEY is not set in the environment");
        }

        const token = jwt.sign(payload, secretKey, {
            expiresIn: "1hr"
        });

        return {user: check, token};
        
    } catch (err){
        console.error("Error in loginService:", err);
        throw err;
    }
};

const keepLoginService = async (id: number) => {
    try {
        const res = await keepLoginQuery(Number(id));

        if (!res) throw new Error("User doesn't exist");

        return res;
    } catch (err){
        console.error("Error in keepLoginService:", err);
        throw err;
    }
};

const forgotPasswordService = async (email: string) => {
    try {
        const check = await findUserQuery({email});
        if (!check) throw new Error ("email doesn't exist");

        const secretKey: Secret | undefined = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            throw new Error("JWT_SECRET_KEY is not set in the environment");
        }

        const token = jwt.sign({email}, secretKey, {
            expiresIn: "1hr"
        });
        const tokenExpiry = new Date(Date.now() + 3600000);

        await forgotPasswordQuery (email, token, tokenExpiry)

        const temp = await fs.readFileSync(
            path.join(__dirname, "../template", "forgot-password.html"),
            "utf-8"
        );

        const resetPasswordLink = `${process.env.FE_BASE_URL}/auth/reset-password?resetToken=${token}`
        const tempCompile = await handlebars.compile(temp);
        const tempResult = tempCompile({ email: check.email, link: resetPasswordLink });
        const gmailUser = process.env.GMAIL_USER;
        if (typeof gmailUser !== 'string') {
            throw new Error("GMAIL_USER is not set in the environment");
        }

        if (typeof check.email !== 'string') {
            throw new Error("Recipient email is invalid");
        }

        await transporter.sendMail({
            from: gmailUser,
            to: check.email,
            subject: "Reset Password",
            html: tempResult,
          });
      
        //   return res;
        } catch (err) {
            console.error("Error in forgotPasswordService:", err);
          throw err;
        }

};

const setPasswordService = async (resetToken: string, password: string) => {
    try{

        const secretKey: Secret | undefined = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            throw new Error("JWT_SECRET_KEY is not set in the environment");
        }

        const decoded = jwt.verify(resetToken, secretKey);
        if (typeof decoded === 'object' && 'email' in decoded) {
            
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            await setPasswordQuery(decoded.email, hashPassword); 
        } else {
            
            throw new Error("Invalid token");
        }
    } catch (err){
        console.error("Error in setPasswordService:", err);
        throw err;
    }
}

const updatePasswordService = async (id: number, password: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await updatePasswordQuery(Number(id), hashPassword);
    } catch (err) {
        console.error("Error in updatePasswordService:", err);
        throw err
    }
}


export {registerService, loginService, keepLoginService, forgotPasswordService, setPasswordService, updatePasswordService}