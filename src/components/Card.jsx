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
                <Typography gutterBottom variant="h6" component="div">
                    {title}
                    <div className={styles.ratingContainer}>
                        <StyledRating className={styles.ratingIcon} name="read-only" readOnly />
                        <Typography className={styles.rating} sx={{ ml: 2 }} >{rating}</Typography>
                    </div>
                </Typography>
            </Box>
        </Box>
    );
}

{
    /* <StyledRating
className={styles.rating}
name="customized-color"
defaultValue={2}
getLabelText={(value) => `${value} Heart${value !== 1 ? "s" : ""}`}
precision={0.5}
icon={<FavoriteIcon fontSize="inherit" />}
emptyIcon={<StarIcon  fontSize="inherit" />}
readOnly
/> */
}

/* <Box className={styles.allCard}> 
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
</Box> */

export default GameCard;
