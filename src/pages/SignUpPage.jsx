import * as React from "react";
import { Redirect } from "react-router-dom";
import styles from "./SignUpPage.module.css";
import { Button, Typography, Toolbar, Box, AppBar, List, TextField  } from "@material-ui/core";
import authAPI from "../utils/api/authAPI";
import checkAuthentication from "../utils/checkAuthentication";
import validator from "validator";

export default function SignUpPage(props) {
    const [values, setValues] = React.useState({
        login: "",
        email: "",
        password: "",
        passwordRepeat: "",
    });
    const [auth, setAuth] = React.useState(null);
    const [errors, setErorrs] = React.useState([]);
  
    const handleChange = (prop) => (event) => {
        const value = event.target.value;
        setValues({ ...values, [prop]:value });
        setErorrs([]);
    };

    const onRegistrationButtonClick = async () => {
        let validationResult = validateFields(values);
        if (!validationResult.success) {
            setErorrs(validationResult.errors);
        }
        else {
            const signUpResult = await authAPI.signUp(values);
            if(!signUpResult.success) {
                setErorrs(signUpResult.errors);
            }
            else {
                props.history.push("/signin");
            }
        }
    };
  
    const validateFields = (fields) => {
        const errors = [];

        if (!validator.matches(fields.login, "[0-9a-zA-Z]+"))
            errors.push(new Error("Пароль не соответствует указанному шаблону: [0-9a-zA-Z]+"));
        if (!validator.isEmail(fields.email))
            errors.push(new Error("Email указан неверно."));
        if (!validator.isLength(fields.password, { min: 6, max: 30 }))
            errors.push(new Error("Пароль должен содержать от 6 до 30 символов."));
        if (!validator.matches(fields.password, "[0-9a-zA-Z_\\-@#%., ]+"))
            errors.push(new Error("Пароль не соответствует указанному шаблону: [0-9a-zA-Z_\\-@#%., ]+."));
        if (!validator.equals(fields.password, fields.passwordRepeat))
            errors.push(new Error("Пароли не совпадают."));
    
        return { success: errors.length === 0, errors };
    };

    React.useEffect(async() => { setAuth(await checkAuthentication()); }, []);
  
    const Input = ({ label, name, type = "text", ...props }) => (
        <TextField 
            id="outlined-basic" 
            variant="outlined" 
            className={styles.button} 
            label={label} 
            type={type}
            onChange={handleChange({name})} 
            {...props}
        />
    );
    if(!auth){return(<></>);}
    else if(auth.success){return(<Redirect to="/"/>);}
    else{
        return (
            <Box sx={{"& .MuiTextField-root": { m: 1 },}}>
                <AppBar color="default">
                    <Toolbar >
                        <Typography variant="h4" className={styles.bar}>UrFU Games</Typography>
                    </Toolbar>
                </AppBar>        
                <div className={styles.menu}>
                    <Typography variant="h5" className={styles.line}>Регистрация</Typography>
                    <List>
                        <Input label="Логин" name="login" />
                        <Input label="Email" name="email" />
                        <Input label="Пароль" type="password" name="password" />
                        <Input label="Повтор пароля" type="password" name="passwordRepeat" />
                    </List>
                    <Button variant="contained" className={styles.button} onClick={onRegistrationButtonClick}>Зарегистрироваться</Button>
                </div>
                { errors.length > 0 ? <p className={styles.errorMessage}>{errors[0].message}</p> : <></> }
            </Box>
        );
    }
}
