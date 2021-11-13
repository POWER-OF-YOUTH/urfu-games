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

import styles from "./SignUpPage.module.css";

function SignUpPage(props) {
    const rootStore = useContext(RootStoreContext);
    const authStore = rootStore.authStore;

    React.useEffect(() => {
        authStore.clearErrors();
    }, []);

    const handleFormSubmit = async (values) => {
        await authStore.signUp(values);

        // Если в процессе регистрации ошибок не возникло
        if (authStore.errors.length === 0)
            props.history.push("/signin");
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
                <Header variant="hideall" />
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
