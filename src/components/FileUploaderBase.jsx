/**
 * @file Базовый компонент для всех полей выбора файлов.
 */

import React, { useState, useEffect } from "react";
import classNames from "classnames";

import * as uploadAPI from "../utils/api/uploadAPI";

import styles from "./FileUploaderBase.module.css";

/** 
 * `FileUploaderBase` - является оберткой для полей выбра файлов
 * и не имеет графического представления. Выбранный файл 
 * загружается автоматически.
 */
function FileUploaderBase({ 
    className, 
    children, 
    onFileSelect = (f) => f,
    onFileLoad = (f) => f,
    onChange = (f) => f,
    onError = (f) => f,
    ...props 
}) {
    const handleChange = async (evt) => {
        if (evt.target.files.length > 0) {
            onFileSelect(evt);

            const response = await uploadAPI.upload(evt.target.files[0]);
            if (response.ok) {
                onFileLoad(await response.text());
            }
            else
                onError(new Error("Failed to upload file."));
        }

        onChange(evt);
    }; 

    return (
        <label className={classNames(className, styles.fileUploaderBase)}>
            {children}
            <input 
                className={classNames(styles.fileUploaderBase__input)} 
                type="file" 
                onChange={handleChange}
                {...props}
            />
        </label>
    );
}

export default FileUploaderBase;
