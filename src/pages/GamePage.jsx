import * as React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Button, Typography, Toolbar, Box, AppBar  } from '@material-ui/core';

import Unity, { UnityContext } from "react-unity-webgl";
import { Link } from "react-router-dom";
import styles from './GamePage.module.css';
import {Search,SearchIconWrapper,StyledInputBase} from '../styles/Default';
// import GamePage from './components/GamePage.jsx';



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
          <Typography  variant="h6"  >
          Что-то-Games
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          </Toolbar>
        </AppBar>         
        <div>
          <Unity unityContext={unityContext}
          className={styles.Container}>           
          </Unity>
          <button className={styles.Button}  type="button" onClick={ refreshPage }> <span>Restart</span> </button>            
        </div>           
    </Box>    
  );
}

