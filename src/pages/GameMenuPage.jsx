import * as React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Button, Typography, Toolbar, Box, AppBar, Stack, IconButton, styled, 
  Card, CardContent  , CardMedia, CardActionArea,  Container, CssBaseline   } from '@material-ui/core';
import {Search,SearchIconWrapper,StyledInputBase} from '../styles/Default';
import { Link } from "react-router-dom";
import styles from './GameMenuPage.module.css';
// import image from '../components/GameImage.jpg';

const Input = styled('input')({
  display: 'none',
});

export default function SearchAppBar() {
  return (
    <Box >
      
      
      
      <AppBar color='default' >
        
        <Toolbar>          
          <Typography variant="h4">
            Что-то-Games
          </Typography>

          


      

          <Link to="/game">
            <Button variant="text" className={styles.Button} >темы </Button>         
          </Link> 

          <Stack direction="row" alignItems="center" spacing={2}>
            <label htmlFor="contained-button-file">
              <Input accept="image/*" id="contained-button-file" multiple type="file" />
                <Button variant="text"  component="span" className={styles.Button}>  
                  Загрузить игру 
                </Button>
            </label>
            <label htmlFor="icon-button-file">
              <Input accept="image/*" id="icon-button-file" type="file" />
              <IconButton color="primary" aria-label="upload picture" component="span">          
            </IconButton>
            </label>
          </Stack>        
          
          <Search>

            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase className={styles.Searchs}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>          
            <button variant="text" className={styles.Bar}>Войти </button>            
              <Link to="/register">
            <button variant="text" className={styles.Bar} >Зарегистрироваться </button>         
          </Link>
        </Toolbar>
        
      </AppBar>
      
      <Container className={styles.Menu}>
              
      {/*       
       <Card className={styles.Games}>
         <CardActionArea>
            <CardMedia 
            className={styles.Container}
            image="/components/GameImage.jpg" 
            titile="games" />
          <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>

          </CardContent>
          </CardActionArea>
      </Card>              */}

      </Container>

      



    </Box>
  );
}