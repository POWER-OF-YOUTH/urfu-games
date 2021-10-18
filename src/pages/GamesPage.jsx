import * as React from 'react';
import { Button, Typography, Toolbar, Box, AppBar, Stack, IconButton, styled, 
  Card, CardContent  , CardMedia, CardActionArea,  Container, CssBaseline   } from '@material-ui/core';
import { Link } from "react-router-dom";
import styles from './GamesPage.module.css';
import test from '../components/GameImg.jpg';

const Input = styled('input')({
  display: 'none',
});

export default function GamesPage() {
  return (
    <Box className={styles.all}>
      <AppBar color='default' >
        <Toolbar>
          <Typography variant="h4" sx={{ mr: 5 }} >
            UrFU Games
          </Typography>
          <Link style={{ textDecoration: 'none', color: '#000000' } } to="/game">
            <Button sx={{ m: 1 }} size='large' color="inherit" variant="text"  >темы  </Button>
          </Link>
          <Stack >
            <label htmlFor="contained-button-file">
             <Input accept="image/*" id="contained-button-file" multiple type="file" />
              <Button sx={{ m: 1 }} size='large' color="inherit" variant="text" component="span" >
                Загрузить игру
              </Button>
            </label>
          </Stack>
          <div className={styles.bar}>
            <Link to="/signup">
              <button variant="text" className={styles.barItem} >Зарегистрироваться </button>
            </Link>
            <Link to="/signin">
              <button variant="text" className={styles.barItem}>Войти </button>
            </Link>
          </div>
        </Toolbar>
      </AppBar>   
      
      <Box className={styles.tegs} >
          <Typography variant="h5" sx={{ mb: 1 }}>
            Популярные теги
          </Typography>    

          <Typography variant="subtitle1" sx={{ pr: 18 }}>
            Тег #1 Тег #2 Тег #3  Тег #4
          </Typography>
          <Link style={{ textDecoration: 'none', color: '#000000' } } to="/:gameId">
            <Button size='small' color="inherit" variant="text"  >показать все теги  </Button>         
          </Link> 
          <Typography variant="h5" sx={{ mt: 3 }}>
            Подборка
          </Typography>
          <Typography variant="subtitle1" sx={{ my: 0.5 }}>
            Категория #1 Категория #2 Категория #3 Категория #4
          </Typography>
          <Link style={{ textDecoration: 'none', color: '#000000' } } to="/:gameId">
            <Button size='small' color="inherit" variant="text"  >показать все категории  </Button>         
          </Link>     
      </Box>

      <Box className={styles.menu}>
         <Typography variant="h5" sx={{ ml: 3, mt: 2  }}>
           Недавно добавленные
          </Typography>
        <Card sx={{ maxWidth: 345, ml: 5, mt: 3  }}>
        <CardMedia
        component="img"
        height="140"
        image="/static/images/cards/contemplative-reptile.jpg"
        alt="game 1"
        />
        <CardContent>
         <Typography gutterBottom variant="h5" component="div">
            Игра #1
          </Typography>
          <Typography variant="body2" color="text.secondary">
            образовательная игра #1 , в ней вы познакомитесь с основами физики
           </Typography>
        </CardContent>
        </Card>       
          <Typography variant="h5" sx={{ ml: 3, mt: 8 }} >
            Рекомендуемое
          </Typography>                  
          <Card sx={{ maxWidth: 345, ml: 5, mt: 3  }}>
            <CardMedia
            component="img"
            height="140"
            image={test}
            alt="game 1"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                  Игра #1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                образовательная игра #1, в ней вы познакомитесь с основами физики
              </Typography>
            </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
