/**
 * @file Кнопка для загрузки файлов игры.
 */

import React, { useState } from "react";
import classNames from "classnames";
import { styled, Button } from "@mui/material";

import FileUploaderBase from "../../components/FileUploaderBase";

import styles from "./FileUploader.module.css";

function FileUploader({
    className,
    onFileSelect = (f) => f,
    onFileLoad = (f) => f,
    ...props
}) {
    const [file, setFile] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const handleFileSelect = (evt) => {
        setLoaded(false);
        setFile(evt.target.files[0]);

        onFileSelect(evt);
    };
    const handleFileLoad = (url) => {
        setLoaded(true);

        onFileLoad(url);
    };

    const renderText = () => {
        if (file !== null && !loaded)
            return "Загрузка";
        else if (file !== null && loaded)
            return file.name;
        return "Выберите файл";
    };

    return (
        <FileUploaderBase
            className={classNames(className, styles.fileUploader)}
            accept="zip/*"
            onFileSelect={handleFileSelect}
            onFileLoad={handleFileLoad}
            {...props}
        >
            <FileUploaderButton
                className={classNames(styles.fileUploader__button)}
                variant="outlined"
                component="span"
                sx={{
                    // Применяем стили, когда файл загрузился
                    ...((file !== null && loaded) && {
                        borderColor: "green",
                        color: "green",
                        "&:hover": {
                            borderColor: "lightgreen"
                        }
                    })
                }}
                disabled={file !== null && !loaded}
            >
                {renderText()}
            </FileUploaderButton>
        </FileUploaderBase>
    );
}

const FileUploaderButton = styled(Button)({
    width: "100%",
});

export default FileUploader;
