import React, { useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import classNames from "classnames";
import { styled, Button } from "@mui/material";

import FileUploaderBase from "../../components/FileUploaderBase";

import styles from "./CoverUploader.module.css";

/**
 * Компонент для загрузки обложки игры.
 */
function CoverUploader({ 
    className, 
    onFileLoad = (f) => f,
    ...props 
}) {
    const [dataUrl, setDataUrl] = useState(null);

    const handleFileLoad = (url) => { 
        setDataUrl(url); 

        onFileLoad(url);
    };

    return (
        <FileUploaderBase 
            className={classNames(className, styles.coverUploader)} 
            accept="image/*"
            onFileLoad={handleFileLoad}
            {...props}
        >
            <div className={classNames(styles.coverUploader__container)}>
                {dataUrl !== null ? (
                    <img 
                        className={classNames(styles.coverUploader__image)}
                        src={dataUrl} 
                    />
                ) : (
                    <CoverUploaderButton
                        className={classNames(styles.coverUploader__button)}
                        variant="contained"
                        color="primary"
                        component="span"
                    >
                        <UploadIcon className={classNames(styles.coverUploader__icon)} />
                    </CoverUploaderButton>
                )}
            </div>
        </FileUploaderBase>
    );
}

const CoverUploaderButton = styled(Button)({
    backgroundColor: "#FFF",
    boxShadow: "none",
    "&:hover": {
        backgroundColor: "#EEE",
        boxShadow: "none",
    },
});

export default CoverUploader;
