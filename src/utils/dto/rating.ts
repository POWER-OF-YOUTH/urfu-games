import { IRatingPopulated } from "../../models/rating";
import UserDTO from "./user";

export default class RateDTO {
    public readonly id: string;
    public readonly author: UserDTO;
    public readonly value: number;
    public readonly createdAt: Date;

    constructor(rating: IRatingPopulated) {
        this.id = rating.id;
        this.author = new UserDTO(rating.author);
        this.value = rating.value;
        this.createdAt = rating.createdAt;
    }
}
