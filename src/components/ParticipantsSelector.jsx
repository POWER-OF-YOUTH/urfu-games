/*
 * @file Компонент `ParticipantSelector`.
 */

import React, { useState, useEffect, useRef } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import UsersSearch from "./UsersSearch";
import useStore from "../hooks/useStore";

import styles from "./ParticipantsSelector.module.css";

/**
 * Компонент для выбора пользователей, участвовавших в разработке игры.
 */
function ParticipantsSelector({ 
    className, 
    onChange = (f) => f, 
    required,
    ...props
}) {
    const { auth } = useStore();
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const selectElement = useRef(null);

    const filterUnselectedParticipants = (participants) => {
        const result = [];

        for (const participant of participants) {
            if ((auth.user !== null && participant.login !== auth.user.login) 
            || (selectedParticipants.find((p) => p.login === participant.login) === undefined))
                result.push(participant);
        }

        return result;
    };

    const handleParticipantSelect = (participant) => { 
        if (participant !== null) {
            setSelectedParticipants([...selectedParticipants, participant]);
        }
    };
    const handleParticipantDelete = (participantIndex) => {
        selectedParticipants.splice(participantIndex, 1);
        setSelectedParticipants([...selectedParticipants]);
    };

    useEffect(() => {
        if (selectElement !== null) {
            selectElement.current.values = [...selectedParticipants];
            selectElement.current.onchange = onChange;
            selectElement.current.dispatchEvent(new Event("change"));
        }
    }, [selectedParticipants]);

    return (
        <div className={classNames(className, styles.participantsSelector)} {...props}>
            <UsersSearch 
                onSelect={handleParticipantSelect} 
                filterOptions={filterUnselectedParticipants} 
            />
            <select 
                style={{width: "1px", height: "1px", opacity: "0", position: "absolute"}}
                ref={selectElement}
                required={required && selectedParticipants.length === 0 && auth.user === null}
            />
            <SelectedParticipants className={classNames(styles.participantsSelector__selectedParticipants)}>
                {auth.user && (
                    <Participant 
                        user={auth.user} 
                        role="Автор"
                    />
                )}
                {selectedParticipants.map((p, index) => (
                    <Participant 
                        key={p.id}
                        user={p} 
                        role="Участник"
                        onDelete={() => handleParticipantDelete(index)} 
                        enableDelete 
                    />
                ))}
            </SelectedParticipants>
        </div>
    );
}

/* 
 * Компонент `SelectedParticipants` - контейнер, в котором 
 * будут отображаться выбранные участники.
 */
function SelectedParticipants({ className, children, ...props }) { // TODO:
    return (
        <div className={classNames(className, styles.selectedParticipants)} {...props}>
            <div className={classNames(styles.selectedParticipants__headers)}>
                <span className={classNames(styles.selectedParticipants__header)}>Пользователь</span>
                <span className={classNames(styles.selectedParticipants__header)}>Роль</span>
            </div>
            <ul className={classNames(styles.selectedParticipants__list)}>
                {children}
            </ul>
        </div>
    );
}

/* 
 * `Participant` используется для отображения информации об участнике. 
 * Его следует передавать передавать в `SelectedParticipants`.
 */
function Participant(
    { 
        className, 
        user, 
        role = "Участник",
        onDelete = (f) => f,
        enableDelete = false, // Если указано значение false, то крестик отображаться не будет.
        ...props 
    }
) {
    return (
        <li
            className={classNames(className, styles.selectedParticipants__participant, styles.participant)}
            {...props}
        >
            <div className={classNames(styles.participant__avatarContainer)}>
                <img 
                    className={classNames(styles.participant__avatar)} 
                    src={user.avatar} 
                    alt={`Аватар пользователя ${user.login}`} 
                />
            </div>
            <div className={classNames(styles.participant__loginContainer)}>
                <span className={classNames(styles.participant__login)}>{user.login}</span>
            </div>
            <div className={classNames(styles.participant__roleContainer)}>
                <span>{role}</span>
            </div>
            <div className={classNames(styles.participant__deleteButtonContainer)}>
                {enableDelete && (
                    <IconButton onClick={onDelete}>
                        <ClearIcon />
                    </IconButton>
                )}
            </div>
        </li>
    );
}

export default observer(ParticipantsSelector);

