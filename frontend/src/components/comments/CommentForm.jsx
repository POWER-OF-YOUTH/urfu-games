import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { 
    Button, 
    TextField,
    IconButton
} from "@mui/material";

import styles from "./CommentForm.module.css";
import NavButton from "../NavButton";
import NavMainButton from "../NavMainButton";
import NavDeleteButton from "../NavDeleteButton";

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
                placeholder="Введите текст комментария"
                style={{width: "75%", backgroundColor: "#F2F2F2", outline: 0}}
                rows={2}
                inputRef={inputRef}
                multiline
            />
            <div className={styles.buttonsContainer}>               
                <NavMainButton  onClick={handleSendButtonClick} text={"Отправить"}></NavMainButton>
            </div>
        </div>
    );
}

export default CommentForm;
