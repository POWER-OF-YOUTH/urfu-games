import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Button, Typography, TextField, InputBase, CardMedia, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { observer, useLocalObservable } from "mobx-react-lite";
import uploadCover from "../components/images/uploadCover.svg";
import styles from "./CreateGamePage.module.css";

const ColorButton = styled(Button)({
    backgroundColor: "#B0FF9D",
    color: "#000",
    textTransform: "none",
    boxShadow: "none",
    "&:hover": {
        backgroundColor: "#B0FF9D",
        boxShadow: "none",
    },
});

const CoverButton = styled(Button)({
    backgroundColor: "#FFF",
    boxShadow: "none",
    "&:hover": {
        backgroundColor: "#EEE",
        boxShadow: "none",
    },
});

const InputForm = styled(InputBase)({
    fontSize: "20px",
    padding: "0 10px",
});

// useEffect(() => {
//     // const actualBtn = document.getElementsByClassName("uploadForm")[0];
//     // const fileChosen = document.getElementsByClassName("choosenFile");
//     // actualBtn.addEventListener("change", function () {
//     //     fileChosen.textContent = this.files[0].name;
//     // });
// });

function GamesNewPage() {
    return (
        <div className={styles.container}>
            <div className={styles.cover}>
                <span className={styles.textCaption}>Обложка</span>
                <div className={styles.cover__content}>
                    {/* <img src="../components/images/test.jpg"></img> */}
                    <input accept="image/*" id="cover" multiple type="file" className={styles.uploadForm} />
                    <label htmlFor="cover">
                        <CoverButton
                            variant="contained"
                            color="primary"
                            component="span"
                            className={styles.cover__image}
                        >
                            <CardMedia component="img" image={uploadCover}></CardMedia>
                        </CoverButton>
                    </label>
                </div>
            </div>
            <div className={styles.info}>
                <div className={styles.info__name}>
                    <span className={styles.textCaption}>Название</span>
                    <div className={styles.info__name__form}>
                        {/* <input className={styles.inputForm}></input> */}
                        <InputForm placeholder="Введите название" className={styles.inputForm}></InputForm>
                        {/* <TextField id="standard-basic" label="Standard" className={styles.inputForm}></TextField> */}
                    </div>
                </div>
                <div className={styles.competencies}>
                    <span className={styles.textCaption}>Компетенции</span>
                    <div className={styles.competencies__search}>
                        <div className={styles.competencies__search__field}>
                            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Поиск компетенции" />
                            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.description}>
                <span className={styles.textCaption}>Описание</span>
                <div className={styles.description__input}>
                    <InputForm
                        placeholder="Введите описание"
                        multiline
                        rows={7}
                        className={styles.inputForm}
                    ></InputForm>
                </div>
            </div>
            <div className={styles.members}>
                <span className={styles.textCaption}>Участники/Разработчики</span>
                <div className={styles.members__list}></div>
            </div>
            <div className={styles.files}>
                <span className={styles.textCaption}>Файлы игры</span>
                <div className={styles.files__list}>
                    <input accept="image/*" id="contained-button-file" multiple type="file" />
                    <label htmlFor="contained-button-file">
                        <span className={styles.choosenFile}>Файл</span>
                        {/* <Button variant="contained" color="primary" component="span">
                            Upload
                        </Button> */}
                    </label>
                </div>
            </div>
            <div className={styles.upload}>
                <ColorButton variant="contained" className={styles.upload__button}>
                    <span className={styles.textCaption}>Опубликовать</span>
                </ColorButton>
            </div>
        </div>
    );
}

export default observer(GamesNewPage);
