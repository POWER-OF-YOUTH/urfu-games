/*
    В этом файле хранятся специальные типы, с определенными способами преобразования.
    Например они позволяют преобразовать дату, переданную в виде строки, в объект Date.
*/
import { types } from "mobx-state-tree";

export const DateTime = types.custom({
    name: "DateTime",
    fromSnapshot(value) {
        return new Date(value);
    },
    toSnapshot(value) {
        return value;
    },
    isTargetType(value) {
        return value instanceof Date;
    },
    getValidationMessage(value) {
        return "";
    }
});

export const APIError = types.custom({
    name: "APIError",
    fromSnapshot(value) {
        if (value.message)
            return { message: value.message };
        return { message: value.detail };
    },
    toSnapshot(value) {
        return new Error(value.message);
    },
    isTargetType(value) {
        return value instanceof Error;
    },
    getValidationMessage(value) {
        return "";
    }
});
