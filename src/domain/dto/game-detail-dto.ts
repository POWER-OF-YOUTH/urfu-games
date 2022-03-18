import { GameDocument } from "../models/game";
import { CompetenceDocument } from "../models/competence";
import { UserDocument } from "../models/user";
import CompetenceDTO from "./competence-dto";
import UserDTO from "./user-dto";

class GameDetailDTO {
    public readonly id: string;
    public readonly competencies: Array<Readonly<CompetenceDTO>>;
    public readonly image: string;
    public readonly name: string;
    public readonly description: string;
    public readonly rating: number;
    public readonly author: UserDTO;
    public readonly participants: Array<Readonly<UserDTO>>;
    public readonly loaderUrl: string;
    public readonly dataUrl: string;
    public readonly frameworkUrl: string;
    public readonly codeUrl: string;
    public readonly createdAt: Date;
    public readonly uploaded: boolean;

    constructor(
        game: Readonly<GameDocument>, 
        author: Readonly<UserDocument>, 
        participants: Readonly<Array<Readonly<UserDocument>>>,
        competencies: Readonly<Array<Readonly<CompetenceDocument>>>
    ) {
        this.id = game.id;
        this.competencies = competencies.map(c => new CompetenceDTO(c));
        this.image = game.image;
        this.name = game.name;
        this.description = game.description;
        this.rating = game.rating;
        this.author = new UserDTO(author);
        this.participants = participants.map(p => new UserDTO(p));
        this.loaderUrl = game.loaderUrl;
        this.dataUrl = game.dataUrl;
        this.frameworkUrl = game.frameworkUrl;
        this.codeUrl = game.codeUrl;
        this.createdAt = game.createdAt;
        this.uploaded = game.uploaded;
    }

    static async create(
        game: Readonly<GameDocument>, 
        author?: Readonly<UserDocument>, 
        participants?: Readonly<Array<Readonly<UserDocument>>>,
        competencies?: Readonly<Array<Readonly<CompetenceDocument>>>,
    ): Promise<GameDetailDTO> {
        if (author === undefined)
            author = await game.getAuthor();

        if (participants === undefined)
            participants = await game.getParticipants();

        if (competencies === undefined)
            competencies = await game.getCompetencies();

        return new GameDetailDTO(
            game, 
            author, 
            participants,
            competencies
        );
    }
}

export default GameDetailDTO;
