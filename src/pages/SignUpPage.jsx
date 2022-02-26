import React, { useState } from "react";
import { Helmet } from "react-helmet";

import { 
    Button, 
    Typography, 
    TextField,
    Alert
} from "@material-ui/core";
import { observer } from "mobx-react-lite";

import { useStore } from "../hooks";

import styles from "./SignUpPage.module.css";

function SignUpPage({ history }) {
    const { auth } = useStore();

    const handleFormSubmit = async (values) => {
        await auth.signUp(values);

        if (auth.errors.length === 0)
            history.push("/signin", history.location.state);
    };
  
    React.useEffect(() => {
        auth.clearErrors();
    }, []);

    const alert = auth.errors.length > 0 ? 
        <Alert className={styles.alert} severity="error">
            {auth.errors[0].message}
        </Alert>
        : 
        <></>; 

    return (
        <>
            <Helmet>
                <title>Регистрация</title>
            </Helmet>
            <div className={styles.wrapper}>
                <SignUpForm onSubmit={handleFormSubmit} />
                {alert}
            </div>
        </>
    );
}

function SignUpForm({ onSubmit }) {
    const [values, setValues] = useState({
        login: "",
        email: "",
        password: "",
        passwordRepeat: "",
    });

    const handleFieldChange = (name) => (evt) => {
        const value = evt.target.value;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = () => onSubmit(values);

    return (
        <div className={styles.signUpForm}>
            <Typography variant="h5" className={styles.title}>Регистрация</Typography>
            <div className={styles.signUpFormBody}>
                <div className={styles.fieldsContainer}>
                    <TextField 
                        id="outlined-basic" 
                        variant="outlined" 
                        className={styles.field} 
                        label="Логин"
                        onChange={handleFieldChange("login")} 
                    />
                    <TextField 
                        id="outlined-basic" 
                        variant="outlined" 
                        className={styles.field} 
                        label="Email"
                        onChange={handleFieldChange("email")} 
                    />
                    <TextField 
                        id="outlined-basic" 
                        variant="outlined" 
                        className={styles.field} 
                        label="Пароль"
                        type="password"
                        onChange={handleFieldChange("password")} 
                    />
                    <TextField 
                        id="outlined-basic" 
                        variant="outlined" 
                        className={styles.field} 
                        label="Повтор пароля"
                        type="password"
                        onChange={handleFieldChange("passwordRepeat")} 
                    />
                </div>
                <Button 
                    className={styles.registerButton} 
                    variant="contained" 
                    onClick={handleSubmit}
                >
                    Зарегистрироваться
                </Button>
            </div>
        </div>
    );
}

export default observer(SignUpPage);
