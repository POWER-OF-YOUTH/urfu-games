// Компонент `UsersSearch` представляет собой текстовое поле,
// с помощью которого можно искать пользователей по логину.

import React, { useState, useEffect } from "react";
//import classNames from "classnames";
import { TextField, Autocomplete } from "@mui/material";

import * as searchAPI from "../utils/api/searchAPI";

import styles from "./CompetenciesSearch.module.css";

const defaultCompetenciesSearchValue = { name: "" };

function CompetenciesSearch({
    className,
    // Вызывается, когда пользователь выбирает один
    // из предложенных результатов поиска.
    onSelect = (f) => f,
    filterOptions = (f) => f,
    ...props
}) {
    const [open, setOpen] = useState(false);
    // Здесь будут храниться результаты поиска.
    const [options, setOptions] = useState([]);
    // Значение `value` компонента `Autocomplete`.
    const [value, setValue] = useState(defaultCompetenciesSearchValue);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setValue(defaultCompetenciesSearchValue);
    };
    const handleInputChange = async (evt) => {
        console.log(await (await searchAPI.searchCompetencies(evt.target.value)).json());
        const competenciesSearchResponse = await searchAPI.searchCompetencies(evt.target.value);
        if (competenciesSearchResponse.ok) setOptions(await competenciesSearchResponse.json());
        else setOptions([]);
    };
    const handleCompetencieSelect = (evt, user) => {
        if (user !== null) {
            onSelect(user);
            setValue(defaultCompetenciesSearchValue);
        }
    };

    useEffect(() => {
        if (open) {
            searchAPI
                .searchCompetencies()
                .then((r) => {
                    console.log(r.name);
                    if (r.ok) return r.json();
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
                className={styles.usersSearch__input}
                onChange={handleInputChange}
                placeholder="Поиск компетенций"
            />
        );
    };
    const renderOption = (props, option) => {
        return (
            <li {...props} className={styles.usersSearch__option}>
                {option.name}
            </li>
        );
    };
    return (
        <Autocomplete
            className={styles.usersSearch}
            filterOptions={filterOptions}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            onChange={handleCompetencieSelect}
            options={options}
            getOptionLabel={(option) => option.name}
            value={value}
            renderInput={renderInput}
            renderOption={renderOption}
            disablePortal
        />
    );
}

export default CompetenciesSearch;
