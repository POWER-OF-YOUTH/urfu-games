import React from "react";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import {
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Button
} from "@material-ui/core";
import { formatRelative } from "date-fns";
import { ru } from "date-fns/locale";
import { observer } from "mobx-react-lite";

import styles from "./CommentView.module.css";

function CommentView({ comment, store }) {
    const [menuAnchorElement, setMenuAnchorElement] = React.useState(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const inputRef = React.useRef(null);
    const isMenuOpen = Boolean(menuAnchorElement);

    // usefull functions
    const clearMenuAnchor = () => {
        setMenuAnchorElement(null);
    };
    const disableEditing = () => {
        setMenuAnchorElement(null);
        setIsEditing(false);
    };
    const enableEditing = () => {
        setIsEditing(true);
    };

    // handlers
    const handleMenuButtonClick = (evt) => setMenuAnchorElement(evt.currentTarget);
    const handleMenuClose = () => clearMenuAnchor();
    const handleChangeButtonClick = () => enableEditing();
    const handleDeleteButtonClick = () => {
        clearMenuAnchor();
        store.deleteComment(comment.id);
    };
    const handleCancelButtonClick = () => disableEditing();
    const handleSaveButtonClick = () => {
        disableEditing();
        comment.update(inputRef.current.value);
    };

    // render blocks
    const avatarBlock = (
        <div>
            <div className={styles.avatarFrame}>
                <img className={styles.avatar} src="/default-avatar.png" alt="Аватар" /> 
            </div>
        </div>
    );
    const dateBlock = (
        <span className={styles.creationDate}>
            {formatRelative(comment.createdAt, Date.now(), { locale: ru })}
        </span>
    );
    const menuBlock = (
        <div>
            <IconButton 
                className={styles.moreButton} 
                size="small" 
                id="basic-button" 
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? "true" : undefined}
                onClick={handleMenuButtonClick}
            >
                <MoreHorizIcon className={styles.moreIcon}/>
            </IconButton>
            <Menu 
                id="basic-menu"
                anchorEl={menuAnchorElement}
                open={isMenuOpen}
                onClose={handleMenuClose} 
                MenuListProps={{"aria-labelledby": "basic-button"}}
            >
                <MenuItem onClick={handleChangeButtonClick}>Изменить</MenuItem>
                <MenuItem onClick={handleDeleteButtonClick}>Удалить</MenuItem>
            </Menu>
        </div>
    );
    const normalModeBody = (
        <div className={styles.containerNormalMode}>
            {avatarBlock}
            <div className= {styles.commentBody}>
                <span className={styles.author}>{comment.author}</span>
                {dateBlock}
                <div className={styles.textContainer}>
                    <span className={styles.text}>
                        {comment.text}
                    </span>
                </div>
            </div>
            {menuBlock}
        </div>
    );
    const editModeBody = (
        <div className={styles.containerEditMode}>
            {avatarBlock}
            <div className={styles.commentBody}>
                <span className={styles.author}>{comment.author}</span>
                {dateBlock}
                <TextField
                    className={styles.editInput}
                    id="standard-basic"
                    variant="standard"
                    defaultValue={comment.text}
                    inputRef={inputRef}
                    multiline
                    autoFocus
                />
                <div className={styles.buttonsContainer}>
                    <Button 
                        className={styles.cancelButton}
                        variant="contained"
                        onClick={handleCancelButtonClick}
                    >
                        Отменить
                    </Button>
                    <Button 
                        className={styles.saveButton} 
                        variant="contained"
                        onClick={handleSaveButtonClick}
                    >
                        Сохранить
                    </Button>
                </div>
            </div>
        </div>
    );
    return isEditing ? editModeBody : normalModeBody;
}

export default observer(CommentView);

