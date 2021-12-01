import { ICompetence } from "../../models/competence";

export default class CompetenceDTO {
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
    public readonly createdAt: Date;

    constructor(competence: ICompetence) {
        this.id = competence.id;
        this.name = competence.name;
        this.description = competence.description;
        this.createdAt = competence.createdAt;
    }
}
