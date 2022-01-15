import express from "express";

import * as competenciesValidator from "../../validators/api/competencies";
import * as competenciesController from "../../controllers/api/competencies";
import validateToken from "../../validators/validateToken";

const competenciesRouter = express.Router();

competenciesRouter.post("/", 
    validateToken, 
    competenciesValidator.addCompetence, 
    competenciesController.addCompetence
);

competenciesRouter.get("/:competenceId", 
    competenciesValidator.getCompetence, 
    competenciesController.getCompetence
);

competenciesRouter.get("/", 
    competenciesValidator.getCompetencies, 
    competenciesController.getCompetencies
);

competenciesRouter.put("/:competenceId", 
    validateToken,
    competenciesValidator.updateCompetence,
    competenciesController.updateCompetence
);

competenciesRouter.delete("/:competenceId",
    validateToken,
    competenciesValidator.deleteCompetence,
    competenciesController.deleteCompetence
);

export default competenciesRouter;
