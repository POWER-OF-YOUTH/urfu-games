/**
 * Компонент `CompetenciesSearch` это текстовое поле,
 * с помощью которого можно искать пользователей по логину.
 */

import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { TextField, Autocomplete } from "@mui/material";

import * as searchAPI from "../utils/api/searchAPI";

import styles from "./CompetenciesSearch.module.css";

const defaultCompetenciesSearchValue = { name: "" };

function CompetenciesSearch({
    className,
    onSelect = (f) => f, ///< Вызывается, когда пользователь выбирает один из предложенных вариантов поиска.
    filterOptions = (f) => f,
    ...props
}) {
    const [open, setOpen] = useState(false);
    /// Результаты поиска.
    const [options, setOptions] = useState([]);
    /// Значение `value` компонента `Autocomplete`.
    const [value, setValue] = useState(defaultCompetenciesSearchValue);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setValue(defaultCompetenciesSearchValue);
    };
    const handleInputChange = async (evt) => {
        const competenciesSearchResponse = await searchAPI.searchCompetencies(evt.target.value);
        if (competenciesSearchResponse.ok)
            setOptions(await competenciesSearchResponse.json());
        else setOptions([]);
    };
    const handleCompetenceSelect = (evt, user) => {
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
                className={classNames(props.className, styles.usersSearch__input)}
                onChange={handleInputChange}
                placeholder="Поиск компетенций"
            />
        );
    };
    const renderOption = (props, option) => {
        return (
            <li {...props} className={classNames(props.className, styles.usersSearch__option)}>
                {option.name}
            </li>
        );
    };
    return (
        <Autocomplete
            className={classNames(className, styles.competenciesSearch)}
            filterOptions={filterOptions}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            onChange={handleCompetenceSelect}
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
