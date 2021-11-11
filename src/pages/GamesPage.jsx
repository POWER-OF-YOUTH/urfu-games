import * as React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { blue, deepPurple } from "@material-ui/core/colors";
import {
    Button,
    Typography,
    Toolbar,
    Box,
    AppBar,
    Stack,
    IconButton,
    styled,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Container,
    CssBaseline,
    Rating,
    Avatar,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import styles from "./GamesPage.module.css";
import test from "../components/GameImg.jpg";
import Header from "../components/Header";
import Competence from "../components/Competence";
// import image from '../components/GameImage.jpg';

const Input = styled("input")({
    display: "none",
});

export default function GamesPage() {
    return (
        <Box>
            <Header />
            <Box className={styles.mainmenu}>
                <Box className={styles.tags}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        Компетенции
                    </Typography>
                    <Competence color="red" width="100px">
                        <span> Тег #1 </span>
                    </Competence>
                    <Competence color="#CC00FF" width="100px">
                        <span> Тег #2 </span>
                    </Competence>
                    <Competence color="#00BBFF" width="100px">
                        <span> Тег #3 </span>
                    </Competence>
                    <Competence color="#5500FF" width="100px">
                        <span> Тег #4 </span>
                    </Competence>
                    <Competence color="green" width="220px">
                        <span> Тег #5 </span>
                    </Competence>
                    <Competence color="#FF8800" width="60px">
                        <span> Тег #6 </span>
                    </Competence>
                    <Competence color="#00FFCC" width="60px">
                        <span> Тег #7 </span>
                    </Competence>
                    <Competence color="#9900FF" width="60px">
                        <span> Тег #8 </span>
                    </Competence>
                </Box>
                {/* <Card className={styles.Games}>
            <CardActionArea>
                <CardMedia 
                className={styles.Container}
                image="/components/GameImage.jpg" 
                titile="games" />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                Lizard
            </Typography>

            </CardContent>
            </CardActionArea>
        </Card>              */}

                <Box className={styles.menu}>
                    <Box className={styles.menuButton}>
                        <Typography variant="h5" sx={{ ml: 3, mt: 2 }} className={styles.recommendButton}>
                            Рекомендуемые
                        </Typography>
                        <Link to="/games/:gameId"  style={{color: "#000000" }}>
                            <Typography
                                variant="h5"
                                sx={{ mr: 3, mt: 2 }}                                
                            >
                                Показать все
                            </Typography>
                        </Link>
                    </Box>
                    <Box className={styles.recommend}>
                        <Card sx={{ maxWidth: 345, ml: 5, mt: 3 }}>
                            <Link to="/games/:gameId">
                                <CardMedia component="img" height="180" image={test} alt="game 1" />
                            </Link>
                            <CardContent className={styles.darkbox}>
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
                        {/* ОСТОРОЖНО ТУТ ИДЁТ КАПИПАСТ CARD */}
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
                        <Card sx={{ maxWidth: 345, ml: 5, mt: 3 }}>
                            <Link to="/games/:gameId">
                                <CardMedia component="img" height="180" image={test} alt="game 1" />
                            </Link>
                            <CardContent className={styles.darkbox}>
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
                    </Box>
                    <Typography variant="h5" sx={{ ml: 3, mt: 2 }}>
                        Все игры
                    </Typography>
                    <Box className={styles.allgame}>
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
                        {/* ОСТОРОЖНО ТУТ ИДЁТ КАПИПАСТ CARD */}
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
                        <Card sx={{ maxWidth: 345, ml: 5, mt: 3 }}>
                            <Link to="/games/:gameId">
                                <CardMedia component="img" height="180" image={test} alt="game 1" />
                            </Link>
                            <CardContent className={styles.darkbox}>
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
                        
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
