import * as React from 'react';
import {  BrowserRouter as Router,  Switch,  Route,  Link} from "react-router-dom";
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import LoginPage from "./LoginPage";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import style from '../Styles/MainStyle.css';
import TextField from '@material-ui/core/TextField';
import { MailRounded } from '@material-ui/icons';


export default function SelectedListItem() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);


  return (
    <Box 
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1, width: '25ch' },
    }}
    noValidate
    autoComplete="off"> 
    

        <AppBar>
          <Toolbar>                      
            <Typography variant="h5">
              Urfu Games 
            </Typography>
          </Toolbar>
        </AppBar>
        
        <div className="Regmenu">
        <ListItemText primary="Вход в аккаунт" />   

        
        <List>    
                 

      

        {/* <TextField
          error
          id="outlined-error-helper-text"
          label="Error"
          defaultValue="Hello World"
          helperText="Incorrect entry."
        /> */}
        
          <TextField id="outlined-basic" label="Логин/email" variant="outlined" />
          <TextField id="outlined-basic" label="Пароль" variant="outlined" />
            <Link to='/'>
            <ListItemText primary="Вход" />            
            </Link>
            

        </List>


      </div>

          
     
    </Box>
  );
}
