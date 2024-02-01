# mveureactshop

## Запустить контейнер с mongodb
`docker run -d --name local-mongo --restart=always -p 27019:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=11111 mongo`

## Настроить конфиг \config\default.json
```json
{
  "port": 5000,
  "ip": "127.0.0.1",
  "MONGODB_URL": "mongodb://admin:11111@127.0.0.1:27019/mveureactshop?authSource=admin",
  "jwtSecret": "1"
}
```

## Наполнить БД тестовыми данными
`npm run initializedb`

## Запустить в dev-режиме сервер и клиент:
`npm run dev`

## Пользователь по умолчанию для входа в систему
Логин: root
Пароль: 11111
