// Компонент `ParticipantSelector` используется для выбора
// пользователей, участвовавших в разработке игры.

import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles";
import { IconButton, Select, MenuItem } from "@mui/material";
import classNames from "classnames";

import UsersSearch from "./UsersSearch";

import styles from "./ParticipantsSelector.module.css";

function ParticipantsSelector(
    { 
        className, 
        // Вызвается, когда изменяется список выбранных участников.
        onChange = (f) => f, 
        ...props
    }
) {
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    // Передается в компонент `UsersSearch`. Используется для того, чтобы
    // убрать из результата поиска тех пользователей, которых мы уже выбрали.
    const filterUnselectedParticipants = (users) => {
        const result = [];

        for (const user of users) {
            if (selectedParticipants.find((u) => u.login === user.login) === undefined)
                result.push(user);
        }

        return result;
    };

    const handleParticipantSelect = (user) => { 
        if (user !== null)
            setSelectedParticipants([user, ...selectedParticipants]);
    };
    const handleParticipantDelete = (userIndex) => {
        selectedParticipants.splice(userIndex, 1);
        setSelectedParticipants([...selectedParticipants]);
    };

    useEffect(() => onChange(selectedParticipants), [selectedParticipants]);

    return (
        <div className={classNames(className, styles.participantsSelector)}>
            <UsersSearch 
                onSelect={handleParticipantSelect} 
                filterOptions={filterUnselectedParticipants} 
            />
            <SelectedParticipants className={classNames(styles.participantsSelector__selectedParticipants)}>
                {selectedParticipants.map((u, index) => (
                    <Participant 
                        key={u.id}
                        user={u} 
                        onDelete={() => handleParticipantDelete(index)} 
                        enableDelete 
                    />
                ))}
            </SelectedParticipants>
        </div>
    );
}

// Компонент `SelectedParticipants` - контейнер, в котором 
// будут отображаться выбранные участники.
function SelectedParticipants({ className, children, ...props }) { // TODO:
    return (
        <div className={classNames(className, styles.selectedParticipants)}>
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

// `Participant` используется для отображения информации об участнике. 
// Его следует передавать передавать в `SelectedParticipants`.
function Participant(
    { 
        className, 
        user, 
        onRoleChange = (f) => f,
        onDelete = (f) => f,
        enableDelete = false, // Если указано значение false, то крестик отображаться не будет.
        ...props 
    }
) {
    const [role, setRole] = useState(null);

    const handleRoleChange = (evt) => {
        setRole(evt.target.value);
    };

    useEffect(() => onRoleChange(role), [role]);

    return (
        <li className={classNames(className, styles.selectedParticipants__participant, styles.participant)}>
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
                <RoleSelect 
                    variant="standard"
                    value={role} 
                    onChange={handleRoleChange}
                    displayEmpty
                >
                    <MenuItem value={null}>Не указана</MenuItem>
                    <MenuItem value="Участник">Участник</MenuItem>
                </RoleSelect>
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

const RoleSelect = styled(Select)({
    width: "100%"
});

export default ParticipantsSelector;

