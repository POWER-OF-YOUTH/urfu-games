class CompetenceDTO {
    constructor(competence) {
        console.log(competence);
        this.id = competence.id;
        this.name = competence.name;
        this.description = competence.description;
        this.createdAt = competence.createdAt;
    }

    static async create(competence) {
        return new CompetenceDTO(competence);
    }
}

export default CompetenceDTO;
