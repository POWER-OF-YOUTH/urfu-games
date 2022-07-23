import Ajv from "ajv";
import addFormats from "ajv-formats";

import modelsSchema from "../config/schemes/validation/models.json" assert { type: "json" };
import routesSchema from "../config/schemes/validation/routes.json" assert { type: "json" };

const ajv = new Ajv({ useDefaults: true, coerceTypes: true });
addFormats(ajv);
ajv.addKeyword("$anchor");

ajv.addSchema(modelsSchema);
ajv.addSchema(routesSchema);

export default ajv;
