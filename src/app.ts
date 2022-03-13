import express, {
    Application,
    Request,
    Response,
    NextFunction
} from "express";

import router from "./routes";

const app: Application = express();

app.use(express.json()); 

app.use("/", router);

app.use(
    async <TError>(
        err: TError, 
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        console.log(err);
        res.send({ message: "error" });
    }
);

export default app;
