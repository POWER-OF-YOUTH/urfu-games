import authAPI from "./authAPI.js";

async function verifyToken(req, res, next) {
    const authHeader = req.header("authorization");
    if (!authHeader.startsWith("Bearer "))
        return next({statusCode: 403, errors: [{detail: "No bearer authorization token provided"}]});

    const token = authHeader.substring(7, authHeader.length);
    const resp = await authAPI.check(token)
    if(resp.ok){
        return next();
    }

    const json = await resp.json();
    return next({...json, statusCode: 403});
}

export default verifyToken;