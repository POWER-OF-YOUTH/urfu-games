import React, {
    useState,
    useRef,
    useCallback
} from "react";
import { NavLink } from "react-router-dom";
import {
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Button
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { formatRelative } from "date-fns";
import { ru } from "date-fns/locale";
import { observer } from "mobx-react-lite";

import { useStore } from "../../hooks";

import styles from "./CommentView.module.css";

function CommentView({ comment, onUpdate = f => f, onDelete = f => f }) {
    const { auth } = useStore();

    const [menuAnchorElement, setMenuAnchorElement] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);
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
    const handleDeleteButtonClick = async () => {
        clearMenuAnchor();

        onDelete(comment);
        await comment.delete();
    };
    const handleCancelButtonClick = () => disableEditing();
    const handleSaveButtonClick = async () => {
        disableEditing();

        onUpdate(comment);
        await comment.update(inputRef.current.value);
    };

    // render blocks
    const renderAuthor = useCallback((author) => (
        <NavLink className={styles.author} to={`/users/${author.id}`}>
            {author.login}
        </NavLink>
    ), []);
    const avatarBlock = (
        <div>
            <div className={styles.avatarFrame}>
                <img className={styles.avatar} src={comment.author.avatar} alt="Аватар" /> 
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
                { auth.authenticated && auth.user.id == comment.author.id
                    ? <MenuItem onClick={handleChangeButtonClick}>Изменить</MenuItem>
                    : <></>
                }
                { auth.authenticated && (auth.user.id == comment.author.id || auth.user.isAdmin())
                    ? <MenuItem onClick={handleDeleteButtonClick}>Удалить</MenuItem>
                    : <></>
                }
            </Menu>
        </div>
    );
    const normalModeBody = (
        <div className={styles.containerNormalMode}>
            {avatarBlock}
            <div className= {styles.commentBody}>
                {renderAuthor(comment.author)}
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
                {renderAuthor(comment.author)}
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

