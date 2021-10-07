import * as React from 'react';
import {  Link } from "react-router-dom";
import styles from './SignUpPage.module.css';
import { Button, Typography, Toolbar, Box, AppBar, List, TextField  } from '@material-ui/core';

// import { userApi } from '../utils/api';
// import GamePage from '../components/GamePage';


export default function App() {

  return (
    <Box sx={{'& .MuiTextField-root': { m: 1 },}}>
    <AppBar color='default'>
          <Toolbar >
            <Typography variant="h4" className={styles.bar}>
              Urfu Games 
            </Typography>
          </Toolbar>
        </AppBar>        
      <div className={styles.menu}>
            <Typography variant="h5" className={styles.line}>
              Регистрация
            </Typography>
        <List>
        {/* <TextField
          error
          id="outlined-error-helper-text"
          label="Error"
          defaultValue="Hello World"
          helperText="Incorrect entry."
        /> */}        
          <TextField id="outlined-basic" label="Логин" variant="outlined" className={styles.button}/>
          <TextField id="outlined-basic" label="Email" variant="outlined" className={styles.button}/>
          <TextField id="outlined-basic" label="Пароль" variant="outlined" className={styles.button}/>
            <Link to="/game" style={{ textDecoration: 'none' }}>
            <Button variant="contained" className={styles.button} >Зарегистрироваться </Button>
            </Link>            
            {/* <Button onClick={()=>{userApi.signIn()}}> отправить запрос </Button> */}
        </List>
      </div>     
    </Box>
  );
}
