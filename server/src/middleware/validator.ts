import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validator = (validations: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for (let validation of validations){
            const result = await validation.run(req);
            if(result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()){
            return next();
        }

        return res.status(400).json({errors: errors.array()});
    };
};

export default validator