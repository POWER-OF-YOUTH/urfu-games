import React, { useState } from "react";
import { 
    Rating,
    Typography,
    Box,
} from "@material-ui/core";
import styles from "./Card.module.css";
import { Link } from "react-router-dom";
import test from "../components/images/GameImg.jpg";

function GameCard({ img, title, rating }) {
    return (
        <Box className={styles.allCard}> 
            <Box className={styles.allImage} sx={{ mt: 3, backgroundImage: img }}>            
                <Link to="/games/:gameId">
                    <Box className={styles.empty}> </Box>
                </Link>
                <Box className={styles.text}>
                    <Typography gutterBottom variant="h6" component="div">
                        { title }
                        <div className={styles.ratingContainer}>
                            <Rating className={styles.rating} name="read-only" readOnly />
                            <Typography className={styles.rating}>{ rating }</Typography>
                        </div>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default GameCard;
