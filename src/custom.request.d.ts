declare namespace Express {
    export interface Request {
        user?: { id: string, role: number }
        data?: any
    }
}

