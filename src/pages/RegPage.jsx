import * as React from 'react';
import {  Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import styles from './RegPage.module.css';
import TextField from '@material-ui/core/TextField';

// import { userApi } from '../utils/api';
// import GamePage from '../components/GamePage';


export default function App() {

  return (
    <Box 
    
    sx={{
      '& .MuiTextField-root': { m: 1 },
    }}
    > 
        <AppBar color='default'> 
          <Toolbar >                      
            <Typography variant="h4" className={styles.Bar}>
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
        
          <TextField id="outlined-basic" label="Логин" variant="outlined" className={styles.Button}/>
          <TextField id="outlined-basic" label="Email" variant="outlined" className={styles.Button}/>
          <TextField id="outlined-basic" label="Пароль" variant="outlined" className={styles.Button}/>
            <Link to="/game">
            <Button variant="contained" className={styles.Button} >Зарегистрироваться </Button>         
            </Link>
            
            {/* <Button onClick={()=>{userApi.signIn()}}> отправить запрос </Button> */}

        </List>

      </div>          
     
    </Box>
  );
}
