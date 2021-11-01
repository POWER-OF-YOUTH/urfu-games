import React, { 
    useState, 
    useContext
} from "react";

import { Redirect } from "react-router-dom";
import { 
    Button, 
    Typography, 
    TextField,
    Alert
} from "@material-ui/core";
import { observer } from "mobx-react-lite";

import Header from "../components/Header";
import { RootStoreContext } from "../models/root";

import styles from "./SignInPage.module.css";

function SignInPage(props) {
    const rootStore = useContext(RootStoreContext);
    const authStore = rootStore.authStore;

    const handleFormSubmit = async (values) => {
        await authStore.signIn(values);

        // Если в процессе входа ошибок не возникло
        if (authStore.errors.length === 0)
            props.history.push("/games");
    };
  
    const alert = authStore.errors.length > 0 ? 
        <Alert className={styles.alert} severity="error">
            {authStore.errors[0].message}
        </Alert>
        : 
        <></>; 
    return authStore.authenticated ? 
        (
            <Redirect to="/games" />
        ) : (
            <>
                <Header />
                <div className={styles.wrapper}>
                    <SignInForm onSubmit={handleFormSubmit} />
                    {alert}
                </div>
            </>
        );
}

function SignInForm({ onSubmit, onChange }) {
    const [values, setValues] = useState({
        login: "",
        password: "",
    });

    const handleFieldChange = (name) => (evt) => {
        const value = evt.target.value;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = () => onSubmit(values);

    return (
        <div className={styles.signInForm}>
            <Typography variant="h5" className={styles.title}>Вход</Typography>
            <div className={styles.signInFormBody}>
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
                        label="Пароль"
                        type="password"
                        onChange={handleFieldChange("password")} 
                    />
                </div>
                <Button 
                    className={styles.registerButton} 
                    variant="contained" 
                    onClick={handleSubmit}
                >
                    Войти
                </Button>
            </div>
        </div>
    );
}

export default observer(SignInPage);
