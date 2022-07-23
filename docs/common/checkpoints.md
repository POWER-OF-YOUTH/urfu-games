# Чекпоинты

## Описание

Чекпоинты — это условные триггеры, которые срабатывают когда пользователь
завершает определенный этап игры, или выполняет какую-либо заданную
последовательность действий. К каждому чекпоинту может быть привязана компетенция.

### Активация чекпоинта

Чекпоинты активируются игрой с помощью специальной функции, которая
принимает на вход идентификатор чекпоинта. Когда чекпоинт активируется, в
базе данных задаётся соотвествующая пометка для конкретного игрока. Если к 
чекпоинту привязана компетенция, то его активация начисляет 1 балл за данную 
компетенцию. Сброс прогресса прохождения игры вызывает удаление пометок о собранных
игроком чекпоинтах, после чего они могут быть повторно активированы.

## Требования

- к каждому чекпоинту может быть привязана компетенция;
- чекпоинты активируются игрой;
- если к активированному чекпоинту привязана компетенция, то игроку начисляется
процент освоения этой компетенции.

## Атрибуты чекпоинта

- уникальный идентификатор;
- имя;
- описание;
- активируемая компетенция;
- игра.

## Схема базы данных

![checkpoints](https://user-images.githubusercontent.com/22858278/166919250-7b8e2cf6-a4c3-4638-98ae-8718ef2e86e7.png)