import { UserDocument } from "../models/user";

class UserDTO {
    public readonly id: string;
    public readonly login: string;
    public readonly email: string;
    public readonly role: number;
    public readonly name: string;
    public readonly surname: string;
    public readonly patronymic: string;
    public readonly avatar: string;
    public readonly createdAt: Date;

    constructor(user: Readonly<UserDocument>) {
        this.id = user.id;
        this.login = user.login;
        this.email = user.email;
        this.role = user.role;
        this.name = user.name;
        this.surname = user.surname;
        this.patronymic = user.patronymic;
        this.avatar = user.avatar;
        this.createdAt = user.createdAt;
    }

    static async create(user: Readonly<UserDocument>): Promise<UserDTO> {
        return new UserDTO(user);
    }
}

export default UserDTO;
