// Компонент `ParticipantSelector` используется для выбора
// пользователей, участвовавших в разработке игры.

import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles";
import { IconButton, Select, MenuItem } from "@mui/material";
//import classNames from "classnames";

import CompetenciesSearch from "./CompetenciesSearch";

import styles from "./CompetenciesSelector.module.css";

function CompetenciesSelector({
    className,
    // Вызвается, когда изменяется список выбранных участников.
    onChange = (f) => f,
    ...props
}) {
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    // Передается в компонент `UsersSearch`. Используется для того, чтобы
    // убрать из результата поиска тех пользователей, которых мы уже выбрали.
    const filterUnselectedParticipants = (users) => {
        const result = [];

        for (const user of users) {
            if (selectedParticipants.find((u) => u.name === user.name) === undefined) result.push(user);
        }

        return result;
    };

    const handleParticipantSelect = (user) => {
        if (user !== null) setSelectedParticipants([user, ...selectedParticipants]);
    };
    const handleParticipantDelete = (userIndex) => {
        selectedParticipants.splice(userIndex, 1);
        setSelectedParticipants([...selectedParticipants]);
    };

    useEffect(() => onChange(selectedParticipants), [selectedParticipants]);

    return (
        <div className={styles.participantsSelector}>
            <CompetenciesSearch onSelect={handleParticipantSelect} filterOptions={filterUnselectedParticipants} />
            <SelectedCompetencies className={styles.participantsSelector__selectedParticipants}>
                {selectedParticipants.map((u, index) => (
                    <Competence key={u.id} user={u} onDelete={() => handleParticipantDelete(index)} enableDelete />
                ))}
            </SelectedCompetencies>
        </div>
    );
}

// Компонент `SelectedParticipants` - контейнер, в котором
// будут отображаться выбранные участники.
function SelectedCompetencies({ className, children, ...props }) {
    // TODO:
    return (
        <div className={styles.selectedParticipants}>
            <div className={styles.selectedParticipants__headers}>
                <span className={styles.selectedParticipants__header}>Выбранные компетенции:</span>
            </div>
            <ul className={styles.selectedParticipants__list}>{children}</ul>
        </div>
    );
}

// `Participant` используется для отображения информации об участнике.
// Его следует передавать передавать в `SelectedParticipants`.
function Competence({
    className,
    user,
    onRoleChange = (f) => f,
    onDelete = (f) => f,
    enableDelete = false, // Если указано значение false, то крестик отображаться не будет.
    ...props
}) {
    const [role, setRole] = useState(null);

    const handleRoleChange = (evt) => {
        setRole(evt.target.value);
    };

    useEffect(() => onRoleChange(role), [role]);

    return (
        <li className={styles.selectedParticipants__participant}>
            <div className={styles.participant__loginContainer}>
                <span className={styles.participant__login}>{user.name}</span>
            </div>
            <div className={styles.participant__deleteButtonContainer}>
                {enableDelete && (
                    <IconButton onClick={onDelete}>
                        <ClearIcon />
                    </IconButton>
                )}
            </div>
        </li>
    );
}

const RoleSelect = styled(Select)({
    width: "100%",
});

export default CompetenciesSelector;
