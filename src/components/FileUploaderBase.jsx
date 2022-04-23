// В данном файле описан базовый компонент 
// для всех полей выбора файлов.

import React, { useState, useEffect } from "react";
import classNames from "classnames";

import styles from "./FileUploaderBase.module.css";

// `FileUploaderBase` - является оберткой для полей выбра файлов
// и не имеет графического представления. Выбранный файл 
// загружается автоматически.
function FileUploaderBase({ 
    className, 
    children, 
    onFileSelect = (f) => f,
    onFileLoad = (f) => f,
    onChange = (f) => f,
    ...props 
}) {
    const [fileReader] = useState(new FileReader());

    const handleChange = (evt) => {
        if (evt.target.files.length > 0) {
            onFileSelect(evt.target.files[0]);

            fileReader.readAsDataURL(evt.target.files[0]);
        }

        onChange(evt);
    }; 
    const handleLoad = (evt) => {
        onFileLoad(fileReader.result);
    };

    useEffect(() => {
        fileReader.addEventListener("load", handleLoad);

        return () => {
            fileReader.removeEventListener("load", handleLoad);
        };
    }, []);

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
