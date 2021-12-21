import React, { 
    useState, 
    useContext
} from "react";
import { Helmet } from "react-helmet";

import { Redirect } from "react-router-dom";
import { 
    Button, 
    Typography, 
    TextField,
    Alert
} from "@material-ui/core";
import { observer } from "mobx-react-lite";

import { useStore } from "../hooks";

import styles from "./SignInPage.module.css";

function SignInPage({ history, ...props }) {
    const { auth } = useStore();

    const handleFormSubmit = async (values) => {
        await auth.signIn(values);

        // Если в процессе входа ошибок не возникло
        if (auth.errors.length === 0)
            window.ym(86784357, 'reachGoal', 'signin');
    };
  
    const alert = auth.errors.length > 0 ? 
        <Alert className={styles.alert} severity="error">
            {auth.errors[0].message}
        </Alert>
        : 
        <></>; 
    React.useEffect(() => {
        auth.clearErrors();
    }, []);
    React.useEffect(() => {
        if (auth.authenticated) {
            if (history.location.state !== undefined 
             && history.location.state.redirectTo !== undefined)
                history.push(history.location.state.redirectTo);
            else
                history.push("/games");
        }
    }, [auth.authenticated]);
    return (
        <>
            <Helmet>
                <title>Вход</title>
            </Helmet>
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
