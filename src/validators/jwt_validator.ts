import expressJWT from "express-jwt";

export default expressJWT({ 
    secret: <string> process.env.JWT_SECRET, 
    algorithms: ["HS256"] 
});