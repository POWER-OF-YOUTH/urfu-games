class UserSearchResultDTO {
    constructor(user) {
        this.id = user.id;
        this.login = user.login;
        this.email = user.email;
        this.role = user.role;
        this.avatar = user.avatar;
        this.createdAt = user.createdAt;
    }

    static async create(user) {
        return new UserSearchResultDTO(user);
    }
}

export default UserSearchResultDTO;
