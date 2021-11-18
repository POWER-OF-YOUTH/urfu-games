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
                        <Popup title="Системная аналитика" competenceName="компетенция">
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
                        <Popup title="Математический анализ" competenceName="компетенция">
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
                        <Popup title="Программирование на языке C++" competenceName="C++">
                            <Typography guterBottom>Тег посвещённый развитию навыка Программирования на C++</Typography>
                            <Typography gutterBottom>
                                Это один из самых распространённых языков в мире который, компилируемый ,
                                структурированный, объектно-ориентированный, невероятно упрощающий работу с большими
                                программами и при этом имеющий огромный потенциал для развития.
                            </Typography>
                        </Popup>
                    </Competence>
                    <Competence color="#5500FF" width="100px">
                        <Popup title="Теория вероятности" competenceName="Теория вероятностей">
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
                        <Popup title="Системная аналитика" competenceName="Системный анализ">
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
                        <Popup title="Математический анализ" competenceName="Математический анализ">
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
                        <Popup title="Программирование на языке C++" competenceName="компетенция">
                            <Typography guterBottom>Тег посвещённый развитию навыка Программирования на C++</Typography>
                            <Typography gutterBottom>
                                Это один из самых распространённых языков в мире который, компилируемый ,
                                структурированный, объектно-ориентированный, невероятно упрощающий работу с большими
                                программами и при этом имеющий огромный потенциал для развития.
                            </Typography>
                        </Popup>
                    </Competence>
                    <Competence color="#9900FF" width="60px">
                        <Popup title="Математический анализ" competenceName="компетенция">
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
                    <Box className={styles.recommend} sx={{ ml: 6 }}>
                        {/* ОСТОРОЖНО ТУТ ИДЁТ КАПИПАСТ CARD */}                        
                        <GameCard title= "Игра#1" rating= "0/5"/>
                        <GameCard title= "Игра#2" rating= "5/5"/>
                        <GameCard title= "Игра#3" rating= "2/5"/>
                        <GameCard title= "Игра#4" rating= "1/5"/>
                        <GameCard title= "Игра#5" rating= "0/5"/>
                    </Box>
                    <Typography variant="h5" sx={{ ml: 3, mt: 2 }}>
                        Все игры
                    </Typography>
                    <Box className={styles.allgame} sx={{ ml: 6 }}>
                        {/* ОСТОРОЖНО ТУТ ИДЁТ КАПИПАСТ CARD */}
                        <GameCard title= "Игра#1" rating= "0/5"/>
                        <GameCard title= "Игра#2" rating= "5/5"/>
                        <GameCard title= "Игра#3" rating= "2/5"/>
                        <GameCard title= "Игра#4" rating= "1/5"/>
                        <GameCard title= "Игра#5" rating= "0/5"/>
                        <GameCard title= "Игра#6" rating= "4/5"/>
                        <GameCard title= "Игра#7" rating= "3/5"/>
                        <GameCard title= "Игра#8" rating= "2/5"/>
                        <GameCard title= "Игра#9" rating= "5/5"/>
                        <GameCard title= "Игра#10" rating= "0/5"/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
