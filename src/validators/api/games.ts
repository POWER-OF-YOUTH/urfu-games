import { body, param } from "express-validator";

import requestValidator from "../request_validator";

const getGame = [
    param("id").isUUID()
];

const gamesValidator = {
    getGame
};

export default gamesValidator;