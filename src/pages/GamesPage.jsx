import * as React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { blue, deepPurple } from '@material-ui/core/colors';
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
    Avatar 
} from "@material-ui/core";
import { Link } from "react-router-dom";
import styles from "./GamesPage.module.css";
import test from "../components/GameImg.jpg";

const Input = styled("input")({
    display: "none",
});

// Добавить компетенции как в игре
// const competencies = [
//     {
//         name: "Математика"
//     },
//     {
//         name: "Физика",
//         color: "purple"
//     },
//     {
//         name: "Химия",
//         color: "darkred"
//     }
// ].map((competence, i) => (
//     <Competence key={i} color={competence.color}>{competence.name}</Competence>
// ));

export default function GamesPage() {
    return (
        <Box className={styles.all}>
            <AppBar color="default" >
                <Toolbar>
                    <Typography variant="h4" sx={{ mr: 5 }} >
                        UrFU Games
                    </Typography>                    
                    <div className={styles.infbutton}>
                        <Link style={{ textDecoration: "none", color: "#000000" }} to="/profile">
                            <Button sx={{ m: 1 }} size="large" color="inherit" variant="text">
                                Кабинет
                            </Button>
                        </Link>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file" />
                            <Button sx={{ m: 1 }} size="large" color="inherit" variant="text" component="span">
                                Загрузить игру
                            </Button>
                        </label>
                    </div>
                    <Avatar sx={{ bgcolor: blue[500], mr: 3  }}>L</Avatar>
                    <Typography variant="h6" className={styles.logotip}>
                        #Login
                    </Typography> 
                    {/* <div className={styles.regbutton}>
                        <Link to="/signin">
                            <button className={styles.regbutton1}>Войти </button>
                        </Link>
                        <Link to="/signup">
                            <button className={styles.regbutton2}>Зарегистрироваться </button>
                        </Link>
                    </div> */}
                </Toolbar>
            </AppBar>
            <Box className={styles.mainmenu}>
                <Box className={styles.tags}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        Компетенции
                    </Typography>
                    <Typography variant="subtitle1" sx={{ pr: 18 }}>
                        Тег #1 Тег #2 Тег #3 Тег #4
                    </Typography>
                    <Link style={{ textDecoration: "none", color: "#000000" }} to="/:gameId">
                        <Button size="small" color="inherit" variant="text">
                            показать все теги{" "}
                        </Button>
                    </Link>
                    <Typography variant="h5" sx={{ mt: 3 }}>
                        Подборки
                    </Typography>
                    <Typography variant="subtitle1" sx={{ my: 0.5 }}>
                        Категория #1 Категория #2 Категория #3 Категория #4
                    </Typography>
                    <Link style={{ textDecoration: "none", color: "#000000" }} to="/:gameId">
                        <Button size="small" color="inherit" variant="text">
                            показать все категории{" "}
                        </Button>
                    </Link>
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
                        <Link to="/games/:gameId">
                            <Typography
                                variant="h5"
                                sx={{ mr: 3, mt: 2 }}
                                style={{ textDecoration: "none", color: "#000000" }}
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
