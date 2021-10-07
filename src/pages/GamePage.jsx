import * as React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Button, Typography, Toolbar, Box, AppBar  } from '@material-ui/core';

import Unity, { UnityContext } from "react-unity-webgl";
import { Link } from "react-router-dom";
import styles from './GamePage.module.css';
import {Search,SearchIconWrapper,StyledInputBase} from '../styles/Default';

export default function App() {
   
  const unityContext = new UnityContext({
    loaderUrl: "./TestGame/Build/TestGame.loader.js",
    dataUrl: "./TestGame/Build/TestGame.data",
    frameworkUrl: "./TestGame/Build/TestGame.framework.js",
    codeUrl: "./TestGame/Build/TestGame.wasm",
  });

  function refreshPage(){
    window.location.reload();
}
  return (
    <Box>
        <AppBar color='default'>
          <Toolbar>
          <Typography  variant="h6" sx={{ mr: 5 }} >
          Что-то-Games
          </Typography>
          <Link style={{ textDecoration: 'none', color: '#000000' } } to="/main">
            <Button  size='large' color="inherit" variant="text"  > Темы  </Button>
          </Link>
          <button variant="text" className={styles.bar}>Войти </button>
              <Link to="/register">
            <button variant="text" className={styles.bar} >Зарегистрироваться </button>
          </Link>
          </Toolbar>
        </AppBar>
        <div>
          <Unity unityContext={unityContext}
          className={styles.container}>
          </Unity>
          <button className={styles.button}  type="button" onClick={ refreshPage }> <span>Restart</span> </button>
        </div>
        {/* <Box className={styles.Menu}>
         <Typography variant="h5" sx={{ ml: 3, mt: 2 }}>
           Недавно добавленные
          </Typography>       

          <Typography variant="h5" sx={{ ml: 3, mt: 20 }} >
            Рекомендуемое
          </Typography>
         </Box> */}        
    </Box>
  );
}

