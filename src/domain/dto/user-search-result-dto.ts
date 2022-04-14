import { UserDocument } from "../models/user";

class UserSearchResultDTO {
    public readonly id: string;
    public readonly login: string;
    public readonly email: string;
    public readonly role: number;
    public readonly avatar: string;
    public readonly createdAt: Date;

    constructor(user: Readonly<UserDocument>) {
        this.id = user.id;
        this.login = user.login;
        this.email = user.email;
        this.role = user.role;
        this.avatar = user.avatar;
        this.createdAt = user.createdAt;
    }

    static async create(user: Readonly<UserDocument>): Promise<UserSearchResultDTO> {
        return new UserSearchResultDTO(user);
    }
}

export default UserSearchResultDTO;
