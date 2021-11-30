import React, { useState } from "react";
import { Rating, Typography, Box } from "@material-ui/core";
import styles from "./Card.module.css";
import { Link } from "react-router-dom";
import test from "../components/images/GameImg.jpg";
import { styled } from "@mui/material/styles";

const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
        color: "#F2F2F2",
    },
    "& .MuiRating-iconEmpty": {
        color: "#D8D8D8",
    },
});

function GameCard({ images, title, rating }) {
    return (
        <Box className={styles.image}>
            <Link to="/games/:gameId">
                <img src={test} />
            </Link>
            <Box className={styles.content}>
                <Typography gutterBottom variant="h6"  sx={{ ml: 1 }}>
                    {title} 
                    <div className={styles.ratingContainer}>
                        <StyledRating className={styles.ratingIcon} name="read-only" readOnly />
                        <Typography className={styles.rating}  sx={{ mr: 1 }}>{rating}</Typography>
                    </div>
                </Typography>
            </Box>
        </Box>
    );
}

export default GameCard;
