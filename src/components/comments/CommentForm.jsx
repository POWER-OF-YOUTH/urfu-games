import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { 
    Button, 
    TextField,
    IconButton
} from "@material-ui/core";

import styles from "./CommentForm.module.css";

function CommentForm({ onSubmit }) {
    const inputRef = React.useRef(null);

    const clearInput = () => { 
        inputRef.current.value = ""; 
    };
    
    const handleClearButtonClick = () => {
        clearInput();
    };
    const handleSendButtonClick = () => {
        const text = inputRef.current.value;

        if (text.length > 0)
            onSubmit(text);

        clearInput();
    };

    return (
        <div className={styles.container}>
            <TextField
                id="outlined-multiline-static"
                placeholder="Оставьте комментарий"
                style={{width: "100%"}}
                rows={2}
                inputRef={inputRef}
                multiline
            />
            <div className={styles.buttonsContainer}>
                <IconButton 
                    className={styles.cancelButton} 
                    variant="contained" 
                    onClick={handleClearButtonClick}
                >
                    <DeleteIcon />
                </IconButton>
                <Button 
                    className={styles.sendButton} 
                    variant="contained"
                    onClick={handleSendButtonClick}
                >
                    Отправить
                </Button>
            </div>
        </div>
    );
}

export default CommentForm;
