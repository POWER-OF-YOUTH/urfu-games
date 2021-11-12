import { IRating } from "../../models/rating";

export namespace DTO {
    export class Rate {
        public readonly id: string;
        public readonly gameId: string;
        public readonly author: string;
        public readonly value: number;
        public readonly createdAt: string;

        constructor(rate: IRating = undefined) {
            if (rate === undefined)
                return;
            this.id = rate.id;
            console.log(rate);
            this.gameId = rate.gameId;
            this.author = rate.author;
            this.value = rate.value;
            this.createdAt = rate.createdAt.toUTCString();
        }
    }
}
