import CompetenceDTO from "./competence-dto";

class CheckpointDTO {
    constructor(checkpoint, competence) {
        this.id = checkpoint.id;
        this.name = checkpoint.name;
        this.competence = competence !== null ? new CompetenceDTO(competence) : null;
        this.description = checkpoint.description;
        this.createdAt = checkpoint.createdAt;
    } 

    static async create(checkpoint) {
        return CheckpointDTO(
            checkpoint,
            await checkpoint.getCompetence()
        );
    }
}

export default CheckpointDTO;
