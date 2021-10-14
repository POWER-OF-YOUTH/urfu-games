import * as React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Button, Typography, Toolbar, Box, AppBar  } from '@material-ui/core';

import Unity, { UnityContext } from "react-unity-webgl";
import { Link, useParams } from "react-router-dom";
import styles from './GamePage.module.css';

export default function App() {

  const params = useParams();

  const gameId = params.gameId;
   
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
          <Typography  variant="h4" sx={{ mr: 5 }} >
            UrFU Games
          </Typography>
          <Link style={{ textDecoration: 'none', color: '#000000' } } to="/game">
            <Button sx={{ m: 1 }} size='large' color="inherit" variant="text"  >темы  </Button>
          </Link>
          <div className={styles.bar}>
            <Link to="/signup">
              <button className={styles.barItem} variant="text">Зарегистрироваться </button>
            </Link>
            <Link to="/signin">
              <button className={styles.barItem} variant="text">Войти </button>
            </Link>
            {/* <Link to="/signup">
              <button className={styles.barItem} variant="text">Зарегистрироваться </button>
            </Link> */}
          </div>
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

