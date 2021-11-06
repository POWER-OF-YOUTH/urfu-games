import UserDTO from "./user";

export default class CommentDTO {
    public readonly id: string;
    public readonly gameId: string;
    public readonly author: UserDTO;
    public readonly text: string;
    public readonly createdAt: Date;

    constructor(data: any) {
        this.id = data.id;
        this.gameId = data.gameId;
        this.author = new UserDTO(data.author);
        this.text = data.text;
        this.createdAt = data.createdAt;
    }
}
