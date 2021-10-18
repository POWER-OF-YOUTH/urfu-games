import * as React from 'react';

import { Button, Typography, Toolbar, Box, AppBar, Rating  } from '@material-ui/core';

import { Link, useParams } from "react-router-dom";
import styles from './GamePage.module.css';
import test from '../components/GameImg.jpg';
import StarIcon from '@material-ui/icons/Star';

const labels = {
  0.5: '0.5',
  1: '1',
  1.5: '1.5',
  2: '2',
  2.5: '2.5',
  3: '3',
  3.5: '3.5',
  4: '4',
  4.5: '4.5',
  5: '5',
};

export default function GamePage() {
  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);


  return (
    <Box >
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
        <Box className={styles.menu}>
            <div className={styles.maininf}>
            <img src={test} />
            <Box className={styles.text}>
                <Typography align="left" variant="h4" sx={{  mt: 2  }}>
                Название
                </Typography>
                <Typography  align="left" variant="h6" sx={{  mt: 1  }} >
                  Автор: 
                </Typography>
                <Typography align="left" variant="h6" sx={{  mt: 1, mb: 20  }} >
                  Участники: 
                </Typography>
                {/* <Typography align="left" variant="h6" sx={{  mt: 1  }} >
                  Компетенции: 
                </Typography> */}
                <Rating
                  name="hover-feedback"
                  value={value}
                  precision={0.5}
                  onChange={(event, newValue) => {
                  setValue(newValue);}}
                  onChangeActive={(event, newHover) => {
                  setHover(newHover);
                  }}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}/>
                  {value !== null && (
                  <Box >{labels[hover !== -1 ? hover : value]}
                  </Box>  
                )}
                <Link style={{ textDecoration: 'none', color: '#000000' } } to="/games/:gameId">
                <Button className={styles.button} size='large' variant="contained" color="success" >Играть  </Button>         
                </Link> 
                
                
                </Box>


            </div>
            <Box className={styles.about}> 
            <Typography align="left" variant="h6" >
              Описание 
            </Typography>

            </Box>

        </Box>

    </Box>
  );
}

