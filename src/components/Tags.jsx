import React from "react";
import { Typography, Box } from "@material-ui/core";
import styles from "./Tags.module.css";
import Competence from "./Competence";
import Popup from "./Dialog";


class Tags extends React.Component {
    render() {
        return (
            <Box className={styles.tags}>
                <Typography variant="h5" sx={{ mb: 1 }}>
                    Компетенции
                </Typography>
                <Competence color="#DB5762" width="100px" competenceName="тег#1">
                    <Popup title="Системная аналитика" competenceName="тег#1">
                        <Typography guterBottom>Тег посвещённый развитию компетенции о системном анализе</Typography>
                        <Typography gutterBottom>
                            Это научно-методологическая дисциплина, которая изучает принципы, методы и средства
                            исследования сложных объектов посредством представления их в качестве систем и анализа этих
                            систем.
                        </Typography>
                    </Popup>
                </Competence>
                <Competence color="#DB44E8" width="100px">
                    <Popup title="Математический анализ" competenceName="тег#2">
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
                <Competence color="#60C6E8" width="100px">
                    <Popup title="Программирование на языке C++" competenceName="тег#3">
                        <Typography guterBottom>Тег посвещённый развитию навыка Программирования на C++</Typography>
                        <Typography gutterBottom>
                            Это один из самых распространённых языков в мире который, компилируемый , структурированный,
                            объектно-ориентированный, невероятно упрощающий работу с большими программами и при этом
                            имеющий огромный потенциал для развития.
                        </Typography>
                    </Popup>
                </Competence>
                <Competence color="#4352E8" width="100px">
                    <Popup title="Теория вероятности" competenceName="тег#4">
                        <Typography guterBottom>Тег посвещённый развитию компетенции про Теорию вероятности</Typography>
                        <Typography gutterBottom>
                            Это раздел математики, изучающий случайные события, случайные величины, их свойства и
                            операции над ними.
                        </Typography>
                    </Popup>
                </Competence>
                <Competence color="#89FF50" width="220px">
                    <Popup title="Системная аналитика" competenceName="тег#5">
                        <Typography guterBottom>Тег посвещённый развитию компетенции о системном анализе</Typography>
                        <Typography gutterBottom>
                            Это научно-методологическая дисциплина, которая изучает принципы, методы и средства
                            исследования сложных объектов посредством представления их в качестве систем и анализа этих
                            систем.
                        </Typography>
                    </Popup>
                </Competence>
                <Competence color="#FFB347" width="60px">
                    <Popup title="Математический анализ" competenceName="тег#6">
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
                <Competence color="#89FFDC" width="60px">
                    <Popup title="Программирование на языке C++" competenceName="тег#7">
                        <Typography guterBottom>Тег посвещённый развитию навыка Программирования на C++</Typography>
                        <Typography gutterBottom>
                            Это один из самых распространённых языков в мире который, компилируемый , структурированный,
                            объектно-ориентированный, невероятно упрощающий работу с большими программами и при этом
                            имеющий огромный потенциал для развития.
                        </Typography>
                    </Popup>
                </Competence>
                <Competence color="#8252E8" width="60px">
                    <Popup title="Математический анализ" competenceName="тег#8">
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
        );
    }
}

export default Tags;
