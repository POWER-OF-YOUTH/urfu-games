// Компонент `UsersSearch` представляет собой текстовое поле,
// с помощью которого можно искать пользователей по логину.

import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { TextField, Autocomplete } from "@mui/material";

import * as searchAPI from "../utils/api/searchAPI";

import styles from "./UsersSearch.module.css";

const defaultUsersSearchValue = { login: "" };

function UsersSearch(
    { 
        className, 
        // Вызывается, когда пользователь выбирает один 
        // из предложенных результатов поиска.
        onSelect = (f) => f, 
        filterOptions = (f) => f, 
        ...props 
    }
) {
    const [open, setOpen] = useState(false);
    // Здесь будут храниться результаты поиска.
    const [options, setOptions] = useState([]); 
    // Значение `value` компонента `Autocomplete`.
    const [value, setValue] = useState(defaultUsersSearchValue); 

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setValue(defaultUsersSearchValue); 
    };
    const handleInputChange = async (evt) => { 
        const usersSearchResponse = await searchAPI.searchUsers(evt.target.value);
        if (usersSearchResponse.ok)
            setOptions(await usersSearchResponse.json());
        else
            setOptions([]);
    };
    const handleUserSelect = async (evt, user) => { 
        if (user !== null) {
            onSelect(user);
            setValue(defaultUsersSearchValue);
        }
    };

    useEffect(() => {
        if (open) {
            searchAPI.searchUsers()
                .then((r) => { 
                    if (r.ok) 
                        return r.json(); 
                    return [];
                })
                .then((json) => setOptions(json))
                .catch((err) => console.error(err));
        }
    }, [open]);

    const renderInput = (props) => {
        return (
            <TextField 
                {...props} 
                className={classNames(props.className, styles.usersSearch__input)}
                onChange={handleInputChange}
                placeholder="Поиск пользователей" 
            />
        );
    };
    const renderOption = (props, option) => {
        return (
            <li 
                {...props} 
                className={classNames(props.className, styles.usersSearch__option)}
            >
                {option.login}
            </li>
        );
    };
    return (
        <Autocomplete 
            className={classNames(className, styles.usersSearch)}
            filterOptions={filterOptions}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            onChange={handleUserSelect}
            options={options} 
            getOptionLabel={(option) => option.login}
            value={value}
            renderInput={renderInput}
            renderOption={renderOption}
            disablePortal
        />
    );
}

export default UsersSearch;
