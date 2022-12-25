import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { Button, Typography, TextField, Alert } from "@mui/material";
import { observer } from "mobx-react-lite";

import { useStore } from "../hooks";

import styles from "./SignInPage.module.css";

function SignInPage({ history }) {
    const { auth } = useStore();

    const handleFormSubmit = async (values) => {
        await auth.signIn(values);

        if (auth.errors.length === 0) history.goBack();
    };
    const handleFormChange = () => auth.clearErrors();

    useEffect(() => {
        auth.clearErrors();
    }, []);
    useEffect(() => {
        if (auth.authenticated) {
            if (history.location.state !== undefined && history.location.state.redirectTo !== undefined)
                history.push(history.location.state.redirectTo);
            else history.push("/games");
        }
    }, [auth.authenticated]);
    const renderAlert = () =>
        auth.errors.length > 0 && (
            <Alert className={styles.alert} severity="error">
                {auth.errors[0].message}
            </Alert>
        );
    return (
        <>
            <Helmet>
                <title>Вход</title>
            </Helmet>
            <div className={styles.wrapper}>
                <SignInForm onSubmit={handleFormSubmit} onChange={handleFormChange} />
                {renderAlert()}
            </div>
        </>
    );
}

function SignInForm({ onSubmit = (f) => f, onChange = (f) => f }) {
    const [values, setValues] = useState({
        login: "",
        password: "",
    });

    const handleFieldChange = (evt) => {
        setValues({ ...values, [evt.target.name]: evt.target.value });
    };
    const handleSubmit = () => onSubmit(values);

    useEffect(() => onChange({ ...values }), [values]);

    return (
        <div className={styles.signInForm}>
            <Typography variant="h5" className={styles.title}>
                Вход
            </Typography>
            <div className={styles.signInFormBody}>
                <div className={styles.fieldsContainer}>
                    <TextField
                        id="outlined-basic"
                        className={styles.field}
                        variant="outlined"
                        name="login"
                        label="Логин"
                        onChange={handleFieldChange}
                    />
                    <TextField
                        id="outlined-basic"
                        className={styles.field}
                        variant="outlined"
                        name="password"
                        label="Пароль"
                        type="password"
                        onChange={handleFieldChange}
                    />
                </div>
                <Button className={styles.registerButton} variant="contained" onClick={handleSubmit}>
                    Войти
                </Button>
            </div>
        </div>
    );
}

export default observer(SignInPage);
