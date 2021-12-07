import React from "react";
import { Rating as MUIRating } from "@material-ui/core";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

import styles from "./GameCard.module.css";

function GameCard({ className = "", game }) {
    return (
        <div className={`${styles.card} ${className}`}>
            <Link className={styles.coverLink} to={`/games/${game.id}`}>
                <img src={game.image} className={styles.cover}/>
                <div className={styles.contentWrapper}>
                    <div className={styles.content}>
                        <div className={styles.nameContainer}>
                            <h3 className={styles.name}>
                                {game.name}
                            </h3>
                        </div>
                        <div className={styles.ratingContainer}>
                            <Rating readOnly size="small" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

const Rating = styled(MUIRating)({
    "& .MuiRating-iconFilled": {
        color: "#F2F2F2",
    },
    "& .MuiRating-iconEmpty": {
        color: "#D8D8D8",
    },
});

export default GameCard;
