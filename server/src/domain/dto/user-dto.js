class UserDTO {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.patronymic = user.patronymic;
        this.login = user.login;
        this.email = user.email;
        this.role = user.role;
        this.avatar = user.avatar;
        this.createdAt = user.createdAt;
    }

    static async create(user) {
        return new UserDTO(user);
    }
}

export default UserDTO;
