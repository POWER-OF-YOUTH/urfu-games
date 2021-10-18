import * as React from "react";
import {  Redirect } from "react-router-dom";
import { 
    Button, 
    Typography, 
    Toolbar, 
    Box, 
    AppBar, 
    List, 
    TextField
} from "@material-ui/core";
import styles from "./SignInPage.module.css";
import authAPI from "../utils/api/authAPI";
import checkAuthentication from "../utils/checkAuthentication";

export default function SignInPage(props) {
    const [values, setValues] = React.useState({
        login: "",
        password: "",
    });
    const [auth, setAuth] = React.useState(null);
    const [errors, setErorrs] = React.useState([]);
  
    const handleChange = (prop) => (event) => {
        const value = event.target.value;
        setValues({ ...values, [prop]:value });
        setErorrs([]);
    };

    const onLogInButtonClick = async () => {
        const signInResult = await authAPI.signIn(values);
        if(!signInResult.success) {
            setErorrs(signInResult.errors);
        }
        else {
            localStorage.setItem("user", JSON.stringify(signInResult.data.user));
            localStorage.setItem("token", signInResult.data.token);
            props.history.push("/");
        }
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
    if(!auth) return(<></>);
    else if(auth.success) return(<Redirect to="/"/>);
    return (
        <Box sx={{"& .MuiTextField-root": { m: 1 }}}> 
            <AppBar color="default">
                <Toolbar>
                    <Typography variant="h4" className={styles.bar}>
                        Urfu Games 
                    </Typography>
                </Toolbar>
            </AppBar>        
            <div className={styles.menu}>
                <Typography variant="h5" className={styles.line}>
                    Вход в аккаунт
                </Typography>
                <List>
                    <Input label="Логин/Email" name="login" />
                    <Input label="Пароль" type="password" />
                    <Button variant="contained" className={styles.button} onClick={onLogInButtonClick}>
                        Войти
                    </Button>
                </List>
            </div>
            { errors.length > 0 ? <p className={styles.errorMessage}>{errors[0].message}</p> : <></> }     
        </Box>
    );
}
