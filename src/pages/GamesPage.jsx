import React from "react";
// import SearchIcon from "@material-ui/icons/Search";
// import { Search, SearchIconWrapper, StyledInputBase } from "../styles/Default";
import { Button, Typography, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import styles from "./GamesPage.module.css";
import Header from "../components/Header";
import Competence from "../components/Competence";
import GameCard from "../components/Card";
import Popup from "../components/Dialog";
import PageLayout from "../layouts/PageLayout";
import MainLayout from "../layouts/MainLayout";
import Tags from "../components/Tags";

export default function GamesPage() {
    return (
        <MainLayout sidePageComponent={<Tags/>}>
            <PageLayout>                
                <Box className={styles.menu}>
                    <Box className={styles.menuButton}>
                        <Typography variant="h5" sx={{ ml: 3, mt: 2 }} className={styles.recommendButton}>
                            Рекомендуемые
                        </Typography>
                        <Link to="/games/:gameId" style={{ color: "#000000" }}>
                            <Typography variant="h5" sx={{ mr: 3, mt: 2 }}>
                                Показать все
                            </Typography>
                        </Link>
                    </Box>
                    <Box className={styles.recommend} sx={{ ml: 6 }}>
                        {/* ОСТОРОЖНО ТУТ ИДЁТ КАПИПАСТ CARD */}
                        <GameCard title="Игра#1" rating="0/5" />
                        <GameCard title="Игра#2" rating="5/5" />
                        <GameCard title="Игра#3" rating="2/5" />
                        <GameCard title="Игра#4" rating="1/5" />
                        <GameCard title="Игра#5" rating="0/5" />
                    </Box>
                    <Typography variant="h5" sx={{ ml: 3, mt: 2 }}>
                        Все игры
                    </Typography>
                    <Box className={styles.allgame} sx={{ ml: 6 }}>
                        {/* ОСТОРОЖНО ТУТ ИДЁТ КАПИПАСТ CARD */}
                        <GameCard title="Игра#1" rating="0/5" />
                        <GameCard title="Игра#2" rating="5/5" />
                        <GameCard title="Игра#3" rating="2/5" />
                        <GameCard title="Игра#4" rating="1/5" />
                        <GameCard title="Игра#5" rating="0/5" />
                        <GameCard title="Игра#6" rating="4/5" />
                        <GameCard title="Игра#7" rating="3/5" />
                        <GameCard title="Игра#8" rating="2/5" />
                        <GameCard title="Игра#9" rating="5/5" />
                        <GameCard title="Игра#10" rating="0/5" />
                    </Box>
                </Box>
            </PageLayout>
        </MainLayout>
    );
}
