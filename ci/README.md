# Развертывание проекта

В данном файле описано как развернуть *production* версию проекта на удалённом сервере.

## Установка зависимостей

Для запуска проекта на вашем сервере должны быть установлены зависимости приведенные ниже:

- nodejs (v16);
- git;
- nginx;
- docker;

## Клонирование репозитория

Следующим шагом будет клонирование репозитория *power-of-youth/urfu-games*:

```bash
git clone https://github.com/power-of-youth/urfu-games
```

## Запуск проекта

Для запуска проекта перейдите в папку `urfu-games/ci` и выполните следующую команду:

```bash
sudo ./build.sh && ./deploy.sh && sudo \
POSTGRES_PASSWORD={POSTGRES_PASSWORD} \
ADMIN_PASSWORD={ADMIN_PASSWORD} \
JWT_SECRET={JWT_SECRET} \
USER_PWD_SALT={USER_PWD_SALT} \
./start.sh
```

где
*POSTGRES_PASSWORD* - пароль, который будет использоваться для подключения к базе данных;
*ADMIN_PASSWORD* - пароль пользователя *admin*;
*JWT_SECRET* - секрет для подписи токенов *JWT*;
*USER_PWD_SALT* - соль для хэширования паролей пользователей.
