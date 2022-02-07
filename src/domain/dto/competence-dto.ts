import { CompetenceDocument } from "../models/competence";

class CompetenceDTO {
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
    public readonly createdAt: Date;

    constructor(competence: CompetenceDocument) {
        this.id = competence.id;
        this.name = competence.name;
        this.description = competence.description;
        this.createdAt = competence.createdAt;
    }

    static async create(competence: CompetenceDocument): Promise<CompetenceDTO> {
        return new CompetenceDTO(competence);
    }
}

export default CompetenceDTO;
