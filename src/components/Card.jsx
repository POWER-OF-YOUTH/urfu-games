import React, { useState } from "react";
import { Card, CardContent, CardMedia, CardActionArea, Container, CssBaseline, Rating, Typography } from "@material-ui/core";
import styles from "./Card.module.css";
import { Link } from "react-router-dom";
import test from "../components/images/GameImg.jpg";

function GameCard({ children }) {
    return (
        <Card sx={{ maxWidth: 345, ml: 5, mt: 3 }}>
            <Link to="/games/:gameId">
                <CardMedia component="img" height="180" image={test} alt="game 1" />
            </Link>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Игра #1
                </Typography>
                <div className={styles.ratingContainer}>
                    <Typography component="legend"></Typography>
                    <Rating name="read-only" readOnly />
                    <Typography sx={{ ml: 1.5 }} className={styles.rating}>
                        0/5
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
}

export default GameCard;
