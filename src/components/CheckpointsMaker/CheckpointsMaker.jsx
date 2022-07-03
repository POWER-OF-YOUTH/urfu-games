/**
 * @file Компонент предназначенный для создания чекпоинтов.
 */

import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./CheckpointsMaker.module.css";

function CheckpointsMaker({
    className,
    competencies = [],
    onChange = (f) => f,
    ...props
}) {
    const [checkpoints, setCheckpoints] = useState([]);
    const selectElement = useRef(null);

    const handleAddClick = () => {
        setCheckpoints([
            ...checkpoints,
            {
                name: "",
                description: "",
                competence: null
            }
        ]);
    };
    const handleCheckpointChange = (index, data) => {
        checkpoints[index] = data;
        setCheckpoints([ ...checkpoints ]);
    };
    const handleCheckpointDelete = (index) => {
        checkpoints.splice(index, 1);
        setCheckpoints([ ...checkpoints ]);
    };

    useEffect(() => {
        if (selectElement !== null) {
            selectElement.current.values = checkpoints;
            selectElement.current.onchange = onChange;
            selectElement.current.dispatchEvent(new Event("change"));
        }
    }, [checkpoints]);

    return (
        <>
            <select 
                style={{width: "1px", height: "1px", opacity: "0", position: "absolute"}}
                ref={selectElement}
                required={checkpoints.length == 0}
            />
            <div className={classNames(styles.checkpointsMaker, className)} {...props}>
                {checkpoints.map((c, i) => (
                    <Checkpoint 
                        key={i}
                        checkpoint={c}
                        competencies={competencies} 
                        onChange={(data) => handleCheckpointChange(i, data)}
                        onDelete={() => handleCheckpointDelete(i)}
                    />
                ))}
                <button onClick={handleAddClick}>Добавить</button>
            </div>
        </>
    );
}

function Checkpoint({
    checkpoint,
    competencies,
    onChange = (f) => f,
    onDelete = (f) => f,
    ...props
}) {
    const [values, setValues] = useState({
        name: checkpoint.name,
        description: checkpoint.description,
        competence: checkpoint.competence 
    });

    const handleChange = (evt) => {
        setValues({ ...values, [evt.target.name]: evt.target.value });
    };

    useEffect(() => {
        if (!competencies.includes(values.competence))
            setValues({ values, competence: null });
    }, [competencies]);
    useEffect(() => onChange(values), [values]);

    return (
        <div className={styles.checkpoint} {...props}>
            <input
                name="name"
                placeholder="Название чекпоинта"
                onChange={handleChange}
                required
            />
            <textarea
                name="description"
                placeholder="Описание чекпоинта"
                rows={2}
                onChange={handleChange}
                required
            />
            <legend>
                Компетенция:
                {" "} 
                <select name="competence" onChange={handleChange}>
                    <option value={null}>Нет</option>
                    {competencies.map((c) => 
                        <option key={c.id} value={c.id}>{c.name}</option>
                    )}
                </select>
            </legend>
            <button onClick={onDelete}>Удалить</button> 
        </div>
    );
}

export default observer(CheckpointsMaker);
