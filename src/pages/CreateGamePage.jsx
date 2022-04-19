import React, { useState } from "react";
import classNames from "classnames";
import { styled } from "@mui/material/styles";
import { Button, InputBase, CardMedia, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { observer } from "mobx-react-lite";
import ParticipantsSelector from "../components/ParticipantsSelector";
import CompetenciesSelector from "../components/CompetenciesSelector";
import uploadCover from "../components/images/uploadCover.svg";

import Block from "../components/Block";

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

const FileInputButton = styled(Button)({
    backgroundColor: "#84DCC6",
    marginLeft: "5px",
    width: "150px",
    height: "30px",
    color: "#000",
    textTransform: "none",
    boxShadow: "none",
    fontFamily: "var(--main-font-family)",
    fontWeight: "bold",
    fontSize: "25",
    "&:hover": {
        backgroundColor: "#84DCC6",
        boxShadow: "none",
    },
});

function GamesNewPage() {
    const [coverFile, setCoverFile] = useState({
        file: "",
        coverUrl: "",
    });
    const [fileName, setFileName] = useState({
        fileInput1: "",
        fileInput2: "",
        fileInput3: "",
        fileInput4: "",
    });

    const handleFieldChange = (evt) => {
        setFileName({ ...fileName, [evt.target.name]: evt.target.files[0].name });
    };
    const UploadCover = (e) => {
        const reader = new FileReader();
        let file = e.target.files[0];
        reader.onload = () => {
            setCoverFile({
                file: file,
                coverUrl: reader.result,
            });
            // if (reader.readyState === 2) {
            //     this.setState({ profileImg: reader.result });
            // }
        };
        reader.readAsDataURL(file);
    };

    return (
        <Block className={classNames(styles.content)}>
            <fieldset className={classNames(styles.gamePublicationForm)}>
                <legend>Публикация игры</legend>
                <label>
                    Обложка
                    <input 
                        className={styles.uploadForm}
                        accept="image/*" 
                        type="file" 
                    />                    
                </label>
                <label>
                    Название
                    <input className={styles.name} />
                </label>
                <label>
                    Описание
                    <textarea/>
                </label>
                <div className={classNames(styles.competenciesSelectorContainer)}>
                    <CompetenciesSelector />
                </div>
                <div className={classNames(styles.participantsSelectorContainer)}>
                    <ParticipantsSelector />
                </div>
                <label>
                    Загрузите файл вида example.framework.js
                    <input type="file" onChange={handleFieldChange} />
                </label>
                <label>
                    Загрузите файл вида example.data
                    <input type="file" onChange={handleFieldChange} />
                </label>
                <label>
                    Загрузите файл вида example.loader.js
                    <input type="file" onChange={handleFieldChange} />
                </label>
                <label>
                    Загрузите файл вида example.wasm
                    <input type="file" onChange={handleFieldChange} />
                </label>
                <ColorButton variant="contained" className={styles.uploadButton}>
                    Опубликовать
                </ColorButton>
            </fieldset>
        </Block>
    );
    /*
    return (
        <div className={styles.container}>
            <div className={styles.cover}>
                <span className={styles.textCaption}>Обложка</span>
                <div className={styles.cover__content}>
                    <input accept="image/*" id="cover" type="file" onChange={UploadCover} className={styles.uploadForm}/>                    
                    <label htmlFor="cover">
                        <CoverButton
                            variant="contained"
                            color="primary"
                            component="span"
                            className={styles.cover__image}
                        >
                            {coverFile.coverUrl ? <CardMedia component="img" image={coverFile.coverUrl}></CardMedia> : <CardMedia component="img" image={uploadCover}></CardMedia>}                         
                            
                        </CoverButton>
                    </label>                    
                </div>
            </div>
            <div className={styles.info}>
                <div className={styles.info__name}>
                    <span className={styles.textCaption}>Название</span>
                    <div className={styles.info__name__form}>
                        <InputForm placeholder="Введите название" className={styles.inputForm}></InputForm>
                    </div>
                </div>
                <div className={styles.competencies}>
                    <span className={styles.textCaption}>Компетенции</span>
                    <div className={styles.competencies__search}>
                        {/* <div className={styles.search__field}>
                            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Поиск компетенции" />
                            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </div> }
                        <div>
                            <CompetenciesSelector></CompetenciesSelector>
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
                <div className={styles.members__list}>
                    <div className={styles.search__field}>
                        <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Поиск участника" />
                        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </div>
                </div>
            </div>
            <div className={styles.files}>
                <span className={styles.textCaption}>Файлы игры</span>
                <div className={styles.files__list}>
                    <span className={styles.files__list__item__cover}>Загрузите файл вида example.framework.js</span>
                    <FileInputItem name="fileInput1" onChange={handleFieldChange}></FileInputItem>
                    <span className={styles.files__list__item__cover}>Загрузите файл вида example.data</span>
                    <FileInputItem name="fileInput2" onChange={handleFieldChange}></FileInputItem>
                    <span className={styles.files__list__item__cover}>Загрузите файл вида example.loader.js</span>
                    <FileInputItem name="fileInput3" onChange={handleFieldChange}></FileInputItem>
                    <span className={styles.files__list__item__cover}>Загрузите файл вида example.wasm</span>
                    <FileInputItem name="fileInput4" onChange={handleFieldChange}></FileInputItem>
                </div>
            </div>
            <div className={styles.upload}>
                <ColorButton variant="contained" className={styles.upload__button}>
                    <span className={styles.textCaption}>Опубликовать</span>
                </ColorButton>
            </div>
        </div>
    );
    */
}

function FileInputItem(props) {
    const [fileName, setFileName] = useState("");

    const handleFieldChange = (evt) => {
        setFileName(evt.target.files[0].name);
        props.onChange(evt);
    };

    return (
        <label className={styles.files__list__item}>
            <input accept="image/*" type="file" {...props} onChange={handleFieldChange} className={styles.uploadForm} />
            <div className={styles.files__item__name}>
                <span className={styles.choosenFile}>{fileName}</span>
            </div>
            <FileInputButton variant="contained" color="primary" component="span">
                Обзор..
            </FileInputButton>
        </label>
    );
}

export default observer(GamesNewPage);
