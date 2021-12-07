import React from "react";
import { Rating, Typography, Box } from "@material-ui/core";
import styles from "./GameCard.module.css";
import { Link } from "react-router-dom";
import test from "../components/images/GameImg.jpg";
import { styled } from "@mui/material/styles";

function GameCard({ game }) {
    console.log(game.toJSON());

    return (
        <Box className={styles.image}>
            <Link to={`/games/${game.id}`}>
                <img src={game.image}  className={styles.avatar}/>
            </Link>
            <Box className={styles.content}>
                <Typography gutterBottom variant="h6"  sx={{ ml: 1 }}>
                    {game.name} 
                    <div className={styles.ratingContainer}>
                        <StyledRating className={styles.ratingIcon} name="read-only" readOnly />
                        <Typography className={styles.rating}  sx={{ mr: 1 }}>{game.rating}</Typography>
                    </div>
                </Typography>
            </Box>
        </Box>
    );
}

const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
        color: "#F2F2F2",
    },
    "& .MuiRating-iconEmpty": {
        color: "#D8D8D8",
    },
});

export default GameCard;
