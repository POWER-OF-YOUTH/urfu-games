import Ajv from "ajv";
import addFormats from "ajv-formats";

import modelsSchema from "../config/schemes/validation/models.json";
import routesSchema from "../config/schemes/validation/routes.json";

const ajv = new Ajv({ useDefaults: true, coerceTypes: true });
addFormats(ajv);
ajv.addKeyword("$anchor");

ajv.addSchema(modelsSchema);
ajv.addSchema(routesSchema);

export default ajv;
