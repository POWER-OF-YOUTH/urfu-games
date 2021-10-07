import * as React from 'react';
import { makeStyles } from '@material-ui/core';

import { Button, Typography, Toolbar, Box, AppBar, Stack, IconButton, styled, 
    Card, CardContent  , CardMedia, CardActionArea,  Container, CssBaseline, CardActions   } from '@material-ui/core';
import { ClassNames } from '@emotion/react';

export default function MediaCard() {
  return (
    <Card sx={{ maxWidth: 300 }} >
      <CardMedia 
        image="/components/test.jpg" 
        component="img"
        alt="green iguana"        
        height="150"
      />
      <CardContent >
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
    </Card>
  );
}