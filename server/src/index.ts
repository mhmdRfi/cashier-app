import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path"
import dotenv from 'dotenv';
import {Request, Response} from "express";

dotenv.config({
    path: path.resolve(__dirname, '../.env'),
  });
  
  
const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(
	cors({
		// origin: process.env.WHITELISTED_DOMAIN
		//   ? process.env.WHITELISTED_DOMAIN.split(" ")
		//   : undefined,
	})
);

app.use("/", (req: Request, res: Response) => {
	res.send("server is running")
})

import authRouter from "./routes/authRouter"
// import userRouter from "./routes/userRouter";
// import transactionRouter from "./routes/transactionRouter";
// import cashierProductRouter from "./routes/cashierProductRouter";
// import productRouter from './routes/productRouter'
// import reportRouter from './routes/reportRouter'

// app.use('/products', productRouter)
// app.use('/report', reportRouter)

app.use("/auth", authRouter);
// app.use("/user", userRouter);

// app.use("/transaction", transactionRouter);
// app.use("/product", cashierProductRouter);

// app.use(
// 	"/uploads",
// 	express.static(path.join(__dirname, "./public/images"))
// );

app.listen(port, () => {
    console.log((`server started on port ${port}`));
    
})