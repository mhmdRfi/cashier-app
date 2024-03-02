import jwt, {Secret} from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { User } from "./user";

declare global {
    namespace Express {
        interface Request {
            user? : User
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try{
        let token = req.headers.authorization;

        if (!token) return res.status(500).send("Access denied");

        token = token.split(" ")[1];

        if (token === "null" || !token)
        return res.status(500).send("Unauthorized token")

        const secretKey: Secret | undefined = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            throw new Error("JWT_SECRET_KEY is not set in the environment");
        }

        const verifiedUser = jwt.verify(token, secretKey) as User;
        if (!verifiedUser) return res.status(500).send("Unauthorized token");

        req.user = verifiedUser;
        next();
    } catch (err){
        return res.status(500).send("Invalid Token")
    }
};

const checkRoles = (req: Request, res: Response, next: NextFunction) => {
  try{
    if(req.user?.roleId == 1) {
      next();
    } else {
      return res.status(500).send("Unauthorized");
    }
  } catch (err){
    return res.status(500).send("Unauthorized");
  }
}

export default verifyToken; checkRoles;