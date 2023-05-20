import React from "react";
import { Rating as MUIRating } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Star from "../components/svg/Star.svg";
import styles from "./GameCard.module.css";

function GameCard({ className = "", game }) {
    return (
        <div className={`${styles.card} ${className}`}>
            <div  className={styles.banner}>
                <Link className={styles.coverLink} to={`/games/${game.id}`}>
                    <img src={game.image} className={styles.cover} />
                    <div className={styles.blockTitle}>
                        <span className={styles.blockName}>{game.name}</span> 
                    </div>
                    <div className={styles.blockCompetence}>                        
                        <span className={styles.blockText}>Математика</span>
                        <span className={styles.blockText}>Геометрия</span>
                        <span className={styles.blockText}>Пространственное мышление</span> 
                    </div>
                    <div className={styles.infoWrapper}>
                        <div className={styles.ratingContainer}>
                            <img src={Star} className={styles.ratingImg} />
                            <div className={styles.text}>
                                <font>{game.rating}</font>                                
                            </div>
                            {/* <Rating readOnly defaultValue={game.rating} size="small" /> */}
                        </div>
                    </div>
                </Link>
            </div>
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
