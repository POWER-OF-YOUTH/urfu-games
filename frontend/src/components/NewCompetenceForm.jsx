import React, { memo, useCallback, useState } from "react";
import classNames from "classnames";
import {
    Alert,
    Snackbar,
    TextField
} from "@mui/material";

import * as competenciesAPI from "../utils/api/competenciesAPI";

import styles from "./NewCompetenceForm.module.css";
import NavMainButton from "./NavMainButton";

const initialValues = {
    name: "",
    description: ""
};

function NewCompetenceForm({
    className,
    onSuccess = (f) => f,
    onError = (f) => f,
    ...props
}) {
    const [values, setValues] = useState(initialValues);
    const [nameProps, setNameProps] = useState({});
    const [descriptionProps, setDescriptionProps] = useState({});
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [successSnackbarMessage, setSuccessSnackbarMessage] = useState("");
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("");

    const showSuccessSnackbar = useCallback((message) => {
        setSuccessSnackbarMessage(message);
        setSuccessSnackbarOpen(true);
    }, []);
    const showErrorSnackbar = useCallback((message) => {
        setErrorSnackbarMessage(message);
        setErrorSnackbarOpen(true);
    }, []);
    const validateFields = useCallback(() => {
        let result = true;

        if (values.name.trim() === "") {
            setNameProps({error: true, helperText: "Поле не должно быть пустым."});
            result = false;
        }
        if (values.description.trim() === "") {
            setDescriptionProps({error: true, helperText: "Поле не должно быть пустым."});
            result = false;
        }
        return result;
    }, [values]);
    const resetFieldsProps = useCallback(() => {
        setNameProps({});
        setDescriptionProps({});
    }, []);

    const handleChange = (evt) => {
        resetFieldsProps();
        setValues({...values, [evt.target.name]: evt.target.value});
    };
    const handleSubmit = async (evt) => {
        evt.preventDefault();

        if (validateFields()) {
            try {
                await competenciesAPI.createCompetence(values.name, values.description);
                showSuccessSnackbar("Компетенция успешно добавлена.");
            }
            catch (err) {
                showErrorSnackbar(err.response.data.errors[0].detail);
            }
        }
    };
    const handleSuccessSnackbarClose = useCallback((evt, reason) => {
        if (reason !== "clickaway")
            setSuccessSnackbarOpen(false);
    }, []);
    const handleErrorSnackbarClose = useCallback((evt, reason) => {
        if (reason !== "clickaway")
            setErrorSnackbarOpen(false);
    }, []);

    return (
        <>
            <div
                className={classNames(className, styles.newCompetenceForm)}
                {...props}
            >
                <TextField
                    placeholder="Название"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onFocus={resetFieldsProps}
                    required
                    {...nameProps}
                    className={styles.textTitle}
                />
                <TextField
                    name="description"
                    placeholder="Описание"
                    value={values.description}
                    onChange={handleChange}
                    onFocus={resetFieldsProps}
                    rows={8}
                    multiline
                    required
                    {...descriptionProps}
                    className={styles.textTitle}
                />
                {/* <button type="button" onClick={handleSubmit}>Создать</button> */}
                <NavMainButton  className={styles.createButton} text={"Создать"} onClick={handleSubmit}></NavMainButton>
            </div>
            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={2000}
                onClose={handleSuccessSnackbarClose}
            >
                <Alert onClose={handleSuccessSnackbarClose} severity="success" variant="filled">
                    {successSnackbarMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={2000}
                onClose={handleErrorSnackbarClose}
            >
                <Alert onClose={handleSuccessSnackbarClose} severity="error" variant="filled">
                    {errorSnackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default memo(NewCompetenceForm);
