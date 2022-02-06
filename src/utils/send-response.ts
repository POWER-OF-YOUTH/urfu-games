import { Response } from "express";

function sendResponse<T>(res: Response, data: T, status: number = 200) {
    res.status(status).json(data);
}

export default sendResponse;
