import React, { memo, useState } from "react";
import classNames from "classnames";
import {
    Alert,
    Snackbar
} from "@mui/material";

import * as competenciesAPI from "../utils/api/competenciesAPI";

import styles from "./NewCompetenceForm.module.css";

const initialValues = {
    name: "",
    description: ""
};

const snackbarHideDuration = 2000;

function NewCompetenceForm({
    className,
    onSuccess = (f) => f,
    onError = (f) => f,
    ...props
}) {
    const [values, setValues] = useState(initialValues);
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

    const handleChange = (evt) => {
        setValues({...values, [evt.target.name]: evt.target.value});
    };
    const handleSubmit = async (evt) => {
        evt.preventDefault();

        const response = await competenciesAPI.createCompetence(
            values.name,
            values.description
        );

        if (response.ok) {
            setSuccessSnackbarOpen(true);
            onSuccess();
            setValues(initialValues);
        }
        else {
            setErrorSnackbarOpen(true);
            onError();
        }
    };
    const handleSuccessSnackbarClose = (evt, reason) => {
        if (reason !== "clickaway")
            setSuccessSnackbarOpen(false);
    };
    const handleErrorSnackbarClose = (evt, reason) => {
        if (reason !== "clickaway")
            setErrorSnackbarOpen(false);
    };

    return (
        <>
            <form
                className={classNames(className, styles.newCompetenceForm)}
                onSubmit={handleSubmit}
                {...props}
            >
                <input
                    name="name"
                    placeholder="Название"
                    value={values.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Описание"
                    value={values.description}
                    onChange={handleChange}
                    rows={8}
                    required
                />
                <button type="submit">Создать</button>
            </form>
            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={snackbarHideDuration}
                onClose={handleSuccessSnackbarClose}
            >
                <Alert onClose={handleSuccessSnackbarClose} severity="success" variant="filled">
                    Компетенция успешно добавлена.
                </Alert>
            </Snackbar>
            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={snackbarHideDuration}
                onClose={handleErrorSnackbarClose}
            >
                <Alert onClose={handleSuccessSnackbarClose} severity="error" variant="filled">
                    Произошла ошибка создании компетенции.
                </Alert>
            </Snackbar>
        </>
    );
}

export default memo(NewCompetenceForm);
