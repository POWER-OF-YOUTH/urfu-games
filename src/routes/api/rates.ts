import express from 'express';

import * as validators from "../../validators/api/rates";
import * as controllers from '../../controllers/api/rates';
import validateToken from "../../validators/validateToken";

const ratesRouter = express.Router();

ratesRouter.post('/', validateToken, validators.submitRate, controllers.submitRate);

export default ratesRouter;