import CompetenceDTO from "./competence-dto";
import UserDTO from "./user-dto";

class GameDetailDTO {
    constructor(game, participants, competencies) {
        this.id = game.id;
        this.participants = participants.map((p) => new UserDTO(p));
        this.competencies = competencies.map((c) => new CompetenceDTO(c));
        this.image = game.image;
        this.name = game.name;
        this.description = game.description;
        this.loaderUrl = game.loaderUrl;
        this.dataUrl = game.dataUrl;
        this.frameworkUrl = game.frameworkUrl;
        this.codeUrl = game.codeUrl;
        this.createdAt = game.createdAt;
        this.rating = game.rating;
        this.isPublicated = game.isPublicated;
    }

    static async create(game) {
        return new GameDetailDTO(
            game, 
            await game.getParticipants(),
            await game.getCompetencies()
        );
    }
}

export default GameDetailDTO;
