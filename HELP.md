# Как запустить проект
## Старт проекта
### local
Запускаем проект, заходим на страницу в браузере http://localhost:8080/
1. Подключаемся к WS (жмем кнопку коннект)
2. Отправляем сообщение через окно
3. Смотрим результат

### стенд
Запускаем проект, заходим на страницу в браузере http://cloud.novaris.ru:8080/
1. Подключаемся к WS (жмем кнопку коннект) ws://cloud.novaris.ru:8080/ws
2. Отправляем сообщение через окно выбрав тип запроса
3. Смотрим результат (пока проблема) <br><br>

#### Создать игрока
```
SEND
destination:/see-battle/create-user/response
content-length:87

{"username":"username1","password": "passwordadad","chanelId":"550e8400-e29b-41d4-a716-446655440099"} 
```
_где_
- username - имя игрока
- password - пароль игрока
- chanelId - uuid для создания индивидуального канала для данного пользователя, этот uuid нужно использовать, чтобы подписаться на сообщения от сервера <br><br>

#### Ответ на запрос "Создать игрока". Внимание нужен chanelId  для подписи на топик /user/{chanelId}/see-battle/create-user/response
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440099/see-battle/create-user/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null, "userId":"85d19e55-5494-43b4-ac95-35cb0fc6aba1", "chanelId":"550e8400-e29b-41d4-a716-446655440099"} 
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- userId - идентификатор пользователя <br><br>
- chanelId - uuid для создания индивидуального канала для данного пользователя, этот uuid нужно использовать, чтобы подписаться на сообщения от сервера <br><br>

#### Получить игрока (вход)
```
SEND
destination:/see-battle/get-user/response
content-length:87

{"username":"username1","password": "passwordadad","chanelId":"550e8400-e29b-41d4-a716-446655440099"} 
```
_где_
- username - имя игрока
- password - пароль игрока
- chanelId - uuid для создания индивидуального канала для данного пользователя, этот uuid нужно использовать, чтобы подписаться на сообщения от сервера <br><br>

#### Ответ на запрос "Получить игрока (вход)". Внимание нужен chanelId  для подписи на топик /user/{chanelId}/see-battle/get-user/response
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440099/see-battle/get-user/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null, "userId":"85d19e55-5494-43b4-ac95-35cb0fc6aba1", "chanelId":"550e8400-e29b-41d4-a716-446655440099"} 
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- userId - идентификатор пользователя <br><br>
- chanelId - uuid для создания индивидуального канала для данного пользователя, этот uuid нужно использовать, чтобы подписаться на сообщения от сервера <br><br>


#### Создать игру, запрос
```
SEND
destination:/see-battle/create-game/request
content-length:87

{"userId":"85d19e55-5494-43b4-ac95-35cb0fc6aba1","sizeGrid":5} 
```
_где_
- userId - идентификатор игрока
- sizeGrid - размер поля (не обязательное поле)

#### Ответ на запрос создать игру. Внимание нужен chanelId  для подписи на топик /user/{chanelId}/see-battle/create-game/response
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440099/see-battle/create-game/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null,"matchId":"849cca9b-6356-42d7-aac9-362a208a721f"} 
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- matchId - идентификатор матча 


#### Создать флот
```
SEND
destination:/see-battle/create-fleet/request
content-length:168

{"matchId":"697b34cb-e49d-4dd2-a3cb-5c77e8886724","userId":"072f6c98-1f0f-453a-a08c-946b342353cd","grids":[[4,0,3,0,2],[4,0,3,0,0],[4,0,3,0,2],[4,0,0,0,0],[0,0,1,0,1]]} 
```
_где_
- matchId - идентификатор матча у которого мы создаем флот
- userId - идентификатор пользователя
- grids - поле с флотом <br><br>

#### Ответ на запрос создать флот. Внимание нужен chanelId  для подписи на топик /user/{chanelId}/see-battle/create-fleet/response
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440099/see-battle/create-fleet/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null,"errorGrids":[[4,0,3,0,2],[4,0,3,0,0],[4,0,3,0,2],[4,0,0,0,0],[0,0,1,0,1]],"isStartGame":"false"} 
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- errorGrids - поле флота где -777 в этой точке ошибка 
- isStartGame - признак старта игры, true - если соперник уже тоже расставил флот, false - соперник еще не готов <br><br> 

#### Подключится к игре вторым игроком
```
SEND
destination:/see-battle/join-game/request
content-length:123

{"matchId":"440e8400-e29b-41d4-a716-446655440000","userId":"550e8400-e29b-41d4-a716-446655440045"}
```
_где_
- matchId - идентификатор матча к которой мы подключаемся
- userId - идентификатор игрока (второго игрока)

#### Ответ на запрос подключится к игре вторым игроком. Внимание нужен chanelId  для подписи на топик /user/{chanelId}/see-battle/join-game/response
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440088/see-battle/join-game/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null,"userId":"072f6c98-1f0f-453a-a08c-946b342354cd","isStartGame":"false"} 
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- userId - идентификатор пользователя <br><br>

#### Сделать выстрел
```
SEND
destination:/see-battle/shot-game/request
content-length:110

{"matchId":"440e8400-e29b-41d4-a716-446655440000","userId":"777e8400-e29b-41d4-a716-446655440000","x":1,"y":2}
```
_где_
- matchId - идентификатор матча в которой делаем выстрел
- userId - идентификатор, который стреляет
- x - координата по ox от 0 до размера поля -1
- y - координата по oy от 0 до размера поля -1 <br><br>

#### Ответ на запрос "Сделать выстрел"  Внимание нужен chanelId  для подписи на топик /user/{chanelId}/see-battle/shot-game/response
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440088/see-battle/shot-game/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null,"isHit":true,"opponentGrids":[[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,3,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400]]} 
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- isHit - признак попадания, true - попал, false -промах
- opponentGrids - карта соперника с туманом войны! где 0 - промах, -400 - туман, и размер корабля <br><br>

#### Получить список игр по статусу
```
SEND
destination:/see-battle/matches/request
content-length:110

{"matchStatus":"WAIT","chanelId":"777e8400-e29b-41d4-a716-446655440000"}
```
_где_
- chanelId - uuid для создания индивидуального канала для данного пользователя, этот uuid нужно использовать, чтобы подписаться на сообщения от сервера <br><br>
- matchStatus - статус игры (WAIT - ожидают соперника,  IN_PROGRESS - в процессе игры, COMPLETED -завершены,  ALL - все) <br><br>

#### Ответ на запрос "Получить список игр по статусу"  Внимание нужен chanelId  для подписи на топик /user/{chanelId}/see-battle/matches/response
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440088/see-battle/matches/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null, "matches":[{"id":"248b6042-e77a-475a-8085-ddbd2f2a9ea7","sizeGrid":5,"ownerName":"username1","opponentName":"username2","winnerName":null, "matchStatus":"WAIT"}]} 
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- matches - информация об игре <br><br>
    - matchStatus - статус игры (WAIT - ожидают соперника,  IN_PROGRESS - в процессе игры, COMPLETED -завершены,  ALL - все) <br><br>

#### Получить историю игры
```
SEND
destination:/see-battle/match-history/request
content-length:110

{"matchId":"777e8400-e29b-41d4-a716-446655440000","chanelId":"777e8400-e29b-41d4-a716-446655440000"}
```
_где_
- chanelId - uuid для создания индивидуального канала для данного пользователя, этот uuid нужно использовать, чтобы подписаться на сообщения от сервера <br><br>
- matchId - идентификатор матча <br><br>

#### Ответ на запрос "Получить историю игры"  Внимание нужен chanelId  для подписи на топик /user/{chanelId}/see-battle/match-history/response
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440088/see-battle/match-history/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null,"actionHistories":[{"id":"333e8400-e29b-41d4-a716-446655440000", "playerId":"7296a601-6268-4c15-a84e-a59419049db2","matchId":"777e8400-e29b-41d4-a716-446655440000", "x":1, "y":2}]}
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- actionHistories - массив хода игры <br><br>


#### Получить поля игроков (наблюдать за игрой)
```
SEND
destination:/see-battle/grids/request
content-length:110

{"matchId":"777e8400-e29b-41d4-a716-446655440000","chanelId":"777e8400-e29b-41d4-a716-446655440000"}
```
_где_
- chanelId - uuid для создания индивидуального канала для данного пользователя, этот uuid нужно использовать, чтобы подписаться на сообщения от сервера <br><br>
- matchId - идентификатор матча <br><br>

#### Ответ на запрос "Получить поля игроков (наблюдать за игрой)"  Внимание нужен chanelId  для подписи на топик /user/{chanelId}/see-battle/grids/response
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440088/see-battle/grids/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null, "matchStatus":"WAIT", "playerOneGrids": [[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,3,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400]], "playerOneName":"иван", "playerOneId":"444e8400-e29b-41d4-a716-446655440111","playerTwoGrids": [[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,3,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400]], "playerTwoName":"иван", "playerTwoId":"333e8400-e29b-41d4-a716-446655440642"}]}
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- playerOneGrids - поле первого игрока 
- playerOneName - имя первого игрока
- playerOneId - id первого игрока
- playerTwoGrids - поле второго игрока
- playerTwoName - имя второго игрока
- playerTwoId - id второго игрока



#### Получить Игру игрока в статусе не завершонная
```
SEND
destination:/see-battle/match/request
content-length:110

{"userId":"85d19e55-5494-43b4-ac95-35cb0fc6aba1"}
```
_где_
- userId - uuid для игрока который запрашивает статус игры и поля <br><br>


#### Ответ на запрос "Получить Игру игрока в статусе не завершонная"  Внимание нужен chanelId  для подписи на топик /user/{chanelId}/see-battle/match/response
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440088/see-battle/match/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null, "matchStatus":"WAIT", "opponentGrids": [[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,3,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400]], "grids": [[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,3,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400]]}]}
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- playerOneGrids - поле первого игрока
- playerOneName - имя первого игрока
- playerOneId - id первого игрока
- playerTwoGrids - поле второго игрока
- playerTwoName - имя второго игрока
- playerTwoId - id второго игрока



### Дополнительные нотификации
#### Нотификация на запрос "Сделать выстрел" для соперника  Внимание нужен chanelId  для подписи на топик /see-battle/shot-game-owner/response
Нужен чтобы соперник обновлял карту свою и понимал что теперь его ход
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440088/see-battle/shot-game-owner/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null,"isHit":true,"grids":[[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,3,-400,-400,-400],[-400,-400,-400,-400,-400],[-400,-400,-400,-400,-400]]} 
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- isHit - признак попадания, true - попал, false -промах
- grids - карта владельца карты БЕЗ тумана войны! где 0 - пусто, или размер корабля <br><br>

#### Нотификация на запрос "Подключится к игре вторым игроком" для соперника(владельца игры). Внимание нужен chanelId для подписи на топик /see-battle/join-game-owner/response
Нужно, чтобы сообщить, что нашелся соперник и ждем расстановку флота
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440088/see-battle/join-game-owner/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null} 
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус <br><br>

#### Нотификация на запрос "Создать флот" для соперника(второго игрока если он уже есть). Внимание нужен chanelId для подписи на топик /see-battle/fleet-opponent/response
```
MESSAGE
destination:/user/550e8400-e29b-41d4-a716-446655440088/see-battle/fleet-opponent/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null, "isStartGame":true} 
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- isStartGame - признак старта игры, true -можно начинать играть, false-ждем соперника пока он расставит флот <br><br>

#### Нотификация обновления данных
```
MESSAGE
destination:/see-battle/notification-all/response
content-type:application/json
subscription:sub-2
message-id:51974435-4a3b-04a2-50e3-6f76b43df000-1
content-length:136

{"status":"OK","errorDescription":null,"type":"MATCH_WAIT"}
```
_где_
- status - статус "OK" или "ERROR"
- errorDescription - текс ошибки если статус
- type -   MATCH_WAIT - обновился список игр в ожидании , MATCH_COMPLETED - обновился список игр со статусом завершены , MATCH_HISTORY - обновилась история игр, GRIDS_UPDATE - обновление поля в теле будет выставлено значение String matchId
- matchId  - идентификатор матча только если тип GRIDS_UPDATE <br><br>