import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { Button, Typography, TextField, Alert } from "@mui/material";
import { observer } from "mobx-react-lite";

import { useStore } from "../hooks";

import styles from "./SignUpPage.module.css";
import NavButton from "../components/NavButton";
import NavMainButton from "../components/NavMainButton";

function SignUpPage({ history }) {
    const { auth } = useStore();

    const handleFormSubmit = async (values) => {
        await auth.signUp(values);

        if (auth.errors.length === 0) {
            await auth.signIn({ login: values.login, password: values.password });
            history.goBack();
        } else console.error(auth.errors);
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

    const clickChange = (evt) => {
        console.log("скрыть");
    };

    const handleSubmit = () => onSubmit(values);

    useEffect(() => onChange({ ...values }), [values]);

    return (
        <div className={styles.signUpForm}>
            <div className={styles.signUpFormBody}>
                <div className={styles.fieldsContainer}>
                    {/* <Typography variant="h5" className={styles.title}>
                        Регистрация
                    </Typography> */}
                    <h2 className={styles.title}>Регистрация</h2>
                    <TextField
                        id="filled-basic"
                        className={styles.field}
                        name="login"
                        variant="filled"                        
                        label="Логин"                        
                        onChange={handleFieldChange}
                        onClick={clickChange}
                        InputProps={{ disableUnderline: true }}
                        size="small"
                    />
                    <TextField
                        id="outlined-basic"
                        variant="filled"
                        className={styles.field}
                        name="email"
                        label="Email"
                        onChange={handleFieldChange}
                        InputProps={{ disableUnderline: true }}
                        size="small"
                    />
                    <TextField
                        id="outlined-basic"
                        className={styles.field}
                        variant="filled"
                        name="password"
                        type="password"
                        label="Пароль"
                        onChange={handleFieldChange}
                        InputProps={{ disableUnderline: true }}
                        size="small"
                    />
                    <TextField
                        id="outlined-basic"
                        className={styles.field}
                        variant="filled"
                        name="passwordRepeat"
                        label="Повторите пароль"
                        type="password"
                        onChange={handleFieldChange}
                        InputProps={{ disableUnderline: true }}
                        size="small"
                    />
                    <NavMainButton text={"Регистрация"} href={"/signup"}></NavMainButton>
                    {/* <NavButton text={"Регистрация"} href={"/signup"}></NavButton> */}
                </div>
            </div>
        </div>
    );
}

export default observer(SignUpPage);
