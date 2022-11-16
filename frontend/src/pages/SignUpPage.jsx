import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { Button, Typography, TextField, Alert } from "@mui/material";
import { observer } from "mobx-react-lite";

import { useStore } from "../hooks";

import styles from "./SignUpPage.module.css";

function SignUpPage({ history }) {
    const { auth } = useStore();

    const handleFormSubmit = async (values) => {
        await auth.signUp(values);
        await auth.signIn({ login: values.login, password: values.password });

        if (auth.errors.length === 0) {
            console.log(auth.errors);
            history.goBack();
        }        
        else console.log(auth.errors);
    };
    const handleFormChange = () => auth.clearErrors();

    useEffect(() => {
        auth.clearErrors();
    }, []);
    const renderAlert = () =>
        auth.errors.length > 0 && (
            <Alert className={styles.alert} severity="error">
                {auth.errors[0].message}
            </Alert>
        );
    return (
        <>
            <Helmet>
                <title>Регистрация</title>
            </Helmet>
            <div className={styles.wrapper}>
                <SignUpForm onSubmit={handleFormSubmit} onChange={handleFormChange} />
                {renderAlert()}
            </div>
        </>
    );
}

function SignUpForm({ onSubmit = (f) => f, onChange = (f) => f }) {
    const [values, setValues] = useState({
        login: "",
        email: "",
        password: "",
        passwordRepeat: "",
    });

    const handleFieldChange = (evt) => {
        setValues({ ...values, [evt.target.name]: evt.target.value });
    };
    const handleSubmit = () => onSubmit(values);

    useEffect(() => onChange({ ...values }), [values]);

    return (
        <div className={styles.signUpForm}>
            <Typography variant="h5" className={styles.title}>
                Регистрация
            </Typography>
            <div className={styles.signUpFormBody}>
                <div className={styles.fieldsContainer}>
                    <TextField
                        id="outlined-basic"
                        className={styles.field}
                        name="login"
                        variant="outlined"
                        label="Логин"
                        onChange={handleFieldChange}
                    />
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        className={styles.field}
                        name="email"
                        label="Email"
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
                    <TextField
                        id="outlined-basic"
                        className={styles.field}
                        variant="outlined"
                        name="passwordRepeat"
                        label="Повтор пароля"
                        type="password"
                        onChange={handleFieldChange}
                    />
                </div>
                <Button className={styles.registerButton} variant="contained" onClick={handleSubmit}>
                    Зарегистрироваться
                </Button>
            </div>
        </div>
    );
}

export default observer(SignUpPage);
