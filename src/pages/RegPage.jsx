import * as React from 'react';
import {  BrowserRouter as Router,  Switch,  Route,  Link} from "react-router-dom";
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import LoginPage from "./LoginPage";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button, Grid } from '@material-ui/core';
import styles from './RegPage.module.css';
import TextField from '@material-ui/core/TextField';
import { MailRounded } from '@material-ui/icons';
// import { userApi } from '../utils/api';
// import GamePage from '../components/GamePage';


export default function SelectedListItem() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  return (
    <Box 
    
    sx={{
      '& .MuiTextField-root': { m: 1 },
    }}
    > 
    

        <AppBar > 
          <Toolbar >                      
            <Typography variant="h5" className={styles.Bar}>
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
            <Link to='/game'>
            <Button variant="contained" className={styles.Button} >Зарегистрироваться </Button>         
            </Link>
            
            {/* <Button onClick={()=>{userApi.signIn()}}> отправить запрос </Button> */}

        </List>

      </div>          
     
    </Box>
  );
}
