import React, { useState } from "react";
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
    DialogContent,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import styles from "./GamesPage.module.css";
import Header from "../components/Header";
import Competence from "../components/Competence";
import GameCard from "../components/Card";
import Popup from "../components/Dialog";

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
                        <Popup title="Системная аналитика" tegs="тег#1">
                            <Typography guterBottom>
                                Тег посвещённый развитию компетенции о системном анализе
                            </Typography>
                            <Typography gutterBottom>
                                Это научно-методологическая дисциплина, которая изучает принципы, методы и средства
                                исследования сложных объектов посредством представления их в качестве систем и анализа
                                этих систем.
                            </Typography>
                        </Popup>
                    </Competence>
                    <Competence color="#CC00FF" width="100px">
                        <Popup title="Математический анализ" tegs="тег#2">
                            <Typography guterBottom>
                                Тег посвещённый развитию компетенции о математическом анализ
                            </Typography>
                            <Typography gutterBottom>
                                Это совокупность разделов математики, соответствующих историческому разделу под
                                наименованием «анализ бесконечно малых», объединяет дифференциальное и интегральное
                                исчисления.
                            </Typography>
                        </Popup>
                    </Competence>
                    <Competence color="#00BBFF" width="100px">
                        <Popup title="Программирование на языке C++" tegs="тег#3">
                            <Typography guterBottom>Тег посвещённый развитию навыка Программирования на C++</Typography>
                            <Typography gutterBottom>
                                Это один из самых распространённых языков в мире который, компилируемый ,
                                структурированный, объектно-ориентированный, невероятно упрощающий работу с большими
                                программами и при этом имеющий огромный потенциал для развития.
                            </Typography>
                        </Popup>
                    </Competence>
                    <Competence color="#5500FF" width="100px">
                        <Popup title="Теория вероятности" tegs="тег#4">
                            <Typography guterBottom>
                                Тег посвещённый развитию компетенции про Теорию вероятности
                            </Typography>
                            <Typography gutterBottom>
                                Это раздел математики, изучающий случайные события, случайные величины, их свойства и
                                операции над ними.
                            </Typography>
                        </Popup>
                    </Competence>
                    <Competence color="green" width="220px">
                        <Popup title="Системная аналитика" tegs="тег#5">
                            <Typography guterBottom>
                                Тег посвещённый развитию компетенции о системном анализе
                            </Typography>
                            <Typography gutterBottom>
                                Это научно-методологическая дисциплина, которая изучает принципы, методы и средства
                                исследования сложных объектов посредством представления их в качестве систем и анализа
                                этих систем.
                            </Typography>
                        </Popup>
                    </Competence>
                    <Competence color="#FF8800" width="60px">
                        <Popup title="Математический анализ" tegs="тег#6">
                            <Typography guterBottom>
                                Тег посвещённый развитию компетенции о математическом анализ
                            </Typography>
                            <Typography gutterBottom>
                                Это совокупность разделов математики, соответствующих историческому разделу под
                                наименованием «анализ бесконечно малых», объединяет дифференциальное и интегральное
                                исчисления.
                            </Typography>
                        </Popup>
                    </Competence>
                    <Competence color="#00FFCC" width="60px">
                        <Popup title="Программирование на языке C++" tegs="тег#7">
                            <Typography guterBottom>Тег посвещённый развитию навыка Программирования на C++</Typography>
                            <Typography gutterBottom>
                                Это один из самых распространённых языков в мире который, компилируемый ,
                                структурированный, объектно-ориентированный, невероятно упрощающий работу с большими
                                программами и при этом имеющий огромный потенциал для развития.
                            </Typography>
                        </Popup>
                    </Competence>
                    <Competence color="#9900FF" width="60px">
                        <Popup title="Математический анализ" tegs="тег#8">
                            <Typography guterBottom>
                                Тег посвещённый развитию компетенции о математическом анализ
                            </Typography>
                            <Typography gutterBottom>
                                Это совокупность разделов математики, соответствующих историческому разделу под
                                наименованием «анализ бесконечно малых», объединяет дифференциальное и интегральное
                                исчисления.
                            </Typography>
                        </Popup>
                    </Competence>
                </Box>
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
                    <Box className={styles.recommend}>
                        {/* ОСТОРОЖНО ТУТ ИДЁТ КАПИПАСТ CARD */}
                        <GameCard />
                        <GameCard />
                        <GameCard />
                        <GameCard />
                        <GameCard />
                        <GameCard />
                    </Box>
                    <Typography variant="h5" sx={{ ml: 3, mt: 2 }}>
                        Все игры
                    </Typography>
                    <Box className={styles.allgame}>
                        {/* ОСТОРОЖНО ТУТ ИДЁТ КАПИПАСТ CARD */}
                        <GameCard />
                        <GameCard />
                        <GameCard />
                        <GameCard />
                        <GameCard />
                        <GameCard />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
