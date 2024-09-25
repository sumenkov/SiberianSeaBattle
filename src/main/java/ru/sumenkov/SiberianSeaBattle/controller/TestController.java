/*
 *  Copyright 2023 Contributors to the Sports-club.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package ru.sumenkov.SiberianSeaBattle.controller;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RestController;
import ru.sumenkov.SiberianSeaBattle.model.Match;
import ru.sumenkov.SiberianSeaBattle.model.game.CustomFleet;
import ru.sumenkov.SiberianSeaBattle.model.game.Fleet;
import ru.sumenkov.SiberianSeaBattle.model.game.GridPoint;
import ru.sumenkov.SiberianSeaBattle.model.game.Warship;
import ru.sumenkov.SiberianSeaBattle.model.message.*;
import ru.sumenkov.SiberianSeaBattle.service.*;

import java.util.Optional;
import java.util.UUID;

/**
 * Description:
 *
 * @author <a href="mailto:onixbed@gmail.com">amaksimov</a>
 * crested on 09.09.2024
 */
@RequiredArgsConstructor
@RestController
@Slf4j
public class TestController {
    private final GameService gameService;
    private final SeaBattleService seaBattleService;
    private final PlayerService playerService;
    private final MatchService matchService;
    private final ActionHistoryService actionHistoryService;


    void initTest() {
        Fleet fleet = gameService.getFleet(10, 10);
        for (int countGame = 0; countGame < 10; countGame++) {
            log.info("fleat game " + countGame);
            for (Warship warship : fleet.getWarships()) {
                log.info(String.format("start (x=%s, y=%s) end (x=%s, y=%s) size %s live %s",
                        warship.getStart().x() + 1,
                        warship.getStart().y() + 1,
                        warship.getEnd().x() + 1,
                        warship.getEnd().y() + 1,
                        warship.getSize(),
                        warship.getLives()));
            }
            log.info("grids");
            GridPoint[][] grids = fleet.getGrids();
            GameService.print(grids);
            int x = Math.toIntExact(Math.round(Math.random() * 9));
            int y = Math.toIntExact(Math.round(Math.random() * 9));
            boolean isHit = gameService.checkShot(fleet,
                    x,
                    y);
            log.info(String.format("is hit %s x %s y %s",
                    isHit,
                    x + 1,
                    y + 1));

        }
        log.info("-------------------");
        log.info("start checkCustomFleet (проверка кастамной расстановки флота)");
        int[][] customGrids = new int[10][10];
        customGrids[3][4] = 1;
        customGrids[5][5] = 2;
        customGrids[5][6] = 2;

        customGrids[5][7] = 3;

        CustomFleet customFleet = gameService.checkCustomFleet(customGrids);


        for (Warship warship : customFleet.getFleet().getWarships()) {
            log.info(String.format("start (x=%s, y=%s) end (x=%s, y=%s) size %s live %s",
                    warship.getStart().x() + 1,
                    warship.getStart().y() + 1,
                    warship.getEnd().x() + 1,
                    warship.getEnd().y() + 1,
                    warship.getSize(),
                    warship.getLives()));
        }
        log.info("grids");
        GridPoint[][] grids = customFleet.getFleet().getGrids();
        GameService.print(grids);
        int x = Math.toIntExact(Math.round(Math.random() * 9));
        int y = Math.toIntExact(Math.round(Math.random() * 9));
        boolean isHit = gameService.checkShot(fleet,
                x,
                y);
        log.info(String.format("is hit %s x %s y %s",
                isHit,
                x + 1,
                y + 1));


    }




    //TODO не удалять нужен для тестов
    //@PostConstruct
    void  initTest2() {
        CreateUserRequestMessage createUserRequestMessage = new CreateUserRequestMessage();
        createUserRequestMessage.setUsername("userName");
        createUserRequestMessage.setPassword("123");
        createUserRequestMessage.setChanelId(UUID.randomUUID().toString());
        seaBattleService.createUser(createUserRequestMessage);
       var player = playerService.getPlayerByName("userName").orElse(null);
        CreateGameRequestMessage createGameRequestMessage = new CreateGameRequestMessage();
        createGameRequestMessage.setSizeGrid(5);
        createGameRequestMessage.setUserId(player.getId().toString());
        MatchRequestMessage message = new MatchRequestMessage();
        message.setUserId(player.getId().toString());
        seaBattleService.getMatch(message);
        seaBattleService.createGame(createGameRequestMessage);
        seaBattleService.getMatch(message);
        GenerateFleetRequestMessage generateFleetRequestMessage = new GenerateFleetRequestMessage();
       Match match = matchService.getWaitMatchByPlayerId(player.getId()).orElse(null);
        generateFleetRequestMessage.setMatchId(match.getId().toString());
        generateFleetRequestMessage.setUserId(player.getId().toString());
        seaBattleService.generateFleet(generateFleetRequestMessage);
        seaBattleService.getMatch(message);


        CreateUserRequestMessage createUserRequestMessage2 = new CreateUserRequestMessage();
        createUserRequestMessage2.setUsername("userName2");
        createUserRequestMessage2.setPassword("123");
        createUserRequestMessage2.setChanelId(UUID.randomUUID().toString());
        seaBattleService.createUser(createUserRequestMessage2);
        var player2 = playerService.getPlayerByName("userName2").orElse(null);
        JoinGameRequestMessage joinGameRequestMessage = new JoinGameRequestMessage();
        joinGameRequestMessage.setMatchId(match.getId().toString());
        joinGameRequestMessage.setUserId(player2.getId().toString());
        seaBattleService.joinGame(joinGameRequestMessage);
        seaBattleService.getMatch(message);
        GenerateFleetRequestMessage generateFleetRequestMessage2 = new GenerateFleetRequestMessage();
        generateFleetRequestMessage2.setMatchId(match.getId().toString());
        generateFleetRequestMessage2.setUserId(player2.getId().toString());
        seaBattleService.generateFleet(generateFleetRequestMessage2);
        seaBattleService.getMatch(message);
    }
}
