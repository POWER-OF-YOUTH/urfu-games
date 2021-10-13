import { IUser, Role } from "../../models/user";

export namespace DTO {
    export class User {
        public readonly id: string;
        public readonly login: string;
        public readonly email: string;
        public readonly role: number;
        public readonly name: string;
        public readonly surname: string;
        public readonly patronymic: string;
        public readonly avatar: string;
        public readonly registration_date: string;

        constructor(user: IUser) {
            this.id = user.id;
            this.login = user.login;
            this.email = user.email;
            this.role = user.role;
            this.name = user.name;
            this.surname = user.surname;
            this.patronymic = user.patronymic;
            this.avatar = user.avatar;
            this.registration_date = user.registration_date.toUTCString();
        }
    }
}
