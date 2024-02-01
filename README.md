# mveureactshop

## Запуск контейнера с mongodb
`docker run -d --name local-mongo --restart=always -p 27019:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=11111 mongo`

