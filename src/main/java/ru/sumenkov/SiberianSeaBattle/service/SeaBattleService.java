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
package ru.sumenkov.SiberianSeaBattle.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sumenkov.SiberianSeaBattle.acl.GameMapper;
import ru.sumenkov.SiberianSeaBattle.model.Match;
import ru.sumenkov.SiberianSeaBattle.model.Player;
import ru.sumenkov.SiberianSeaBattle.model.game.CustomFleet;
import ru.sumenkov.SiberianSeaBattle.model.game.Fleet;
import ru.sumenkov.SiberianSeaBattle.model.game.GridPoint;
import ru.sumenkov.SiberianSeaBattle.model.game.MatchFleet;
import ru.sumenkov.SiberianSeaBattle.model.message.CreateFleetRequestMessage;
import ru.sumenkov.SiberianSeaBattle.model.message.CreateFleetResponseMessage;
import ru.sumenkov.SiberianSeaBattle.model.message.CreateGameRequestMessage;
import ru.sumenkov.SiberianSeaBattle.model.message.CreateGameResponseMessage;
import ru.sumenkov.SiberianSeaBattle.model.message.GenerateFleetRequestMessage;
import ru.sumenkov.SiberianSeaBattle.model.message.GenerateFleetResponseMessage;
import ru.sumenkov.SiberianSeaBattle.model.message.Status;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Description: Сервис фасад игры
 *
 * @author <a href="mailto:onixbed@gmail.com">amaksimov</a>
 * crested on 17.09.2024
 */
@Service
@RequiredArgsConstructor
public class SeaBattleService {

    private final PlayerService playerService;
    private final MatchService matchService;
    private final ActionHistoryService actionHistoryService;
    private final GameService gameService;
    private final Map<UUID, MatchFleet> matchIdToMatchFleet = new HashMap<>();

    /**
     * Создать матч игры
     *
     * @param request запрос на создание игры
     * @return резултат создания игры
     */
    public CreateGameResponseMessage createGame(CreateGameRequestMessage request) {
        //TODO добавить проверку входных данных
        // проверка юзера как?
        int sizeGrid = Optional.ofNullable(request.getSizeGrid()).orElse(5);

        Optional<Player> user = playerService.getPlayerByName(request.getUsername());
        Player owner = user.orElseGet(() -> playerService.createPlayer(request.getUsername()));
        Match match = matchService.createMatch(owner, sizeGrid);
        //TODO возможно нужно закинуть в бд но уччитывая маппинги это накладно
        matchIdToMatchFleet.put(match.getId(), new MatchFleet(new HashMap<>()));
        CreateGameResponseMessage response = new CreateGameResponseMessage();
        response.setMatchId(match.getId().toString());
        response.setMatchId(owner.getId().toString());

        return response;
    }

    /**
     * Создаем флот
     *
     * @param request запрос на создание флота
     * @return резултат
     */
    public CreateFleetResponseMessage createFleet(CreateFleetRequestMessage request) {
        //TODO добавить проверку входных данных
        Match match = checkMatch(request.getMatchId());
        checkUser(request.getUserId(), match);
        UUID userId = UUID.fromString(request.getUserId());
        MatchFleet mathFleet = getMatchFleet(match, userId);

        CreateFleetResponseMessage response = new CreateFleetResponseMessage();
        CustomFleet customFleet = gameService.checkCustomFleet(request.getGrids());
        if (customFleet.isStatus()) {
            mathFleet.userIdToFleet().put(userId, customFleet.getFleet());
            response.setStatus(Status.OK);
        } else {
            response.setStatus(Status.ERROR);
            response.setErrorDescription("Ощибка в расстановке флота");
            response.setErrorGrids(customFleet.getErrorGrids());
        }

        return response;
    }

    /**
     * Генерируем флот (авторасстановка флота)
     *
     * @param request запрос
     * @return резултат расстановки
     */
    public GenerateFleetResponseMessage generateFleet(GenerateFleetRequestMessage request) {
        //TODO добавить проверку входных данных
        Match match = checkMatch(request.getMatchId());
        checkUser(request.getUserId(), match);
        UUID userId = UUID.fromString(request.getUserId());
        MatchFleet mathFleet = getMatchFleet(match, userId);
        GenerateFleetResponseMessage response = new GenerateFleetResponseMessage();
        Fleet fleet = gameService.getFleet(match.getSizeGrid(), match.getSizeGrid());
        mathFleet.userIdToFleet().put(userId, fleet);
        response.setStatus(Status.OK);
        int[][] grids = GameMapper.toGridsForOwner(fleet.getGrids());
        response.setGrids(grids);

        return response;
    }


    private boolean notEqualsUser(String userId, Player player) {
        if (player == null) {
            return true;
        }
        return !userId.equals(player.getId().toString());
    }

    private MatchFleet getMatchFleet(Match match, UUID userId) {
        MatchFleet mathFleet = matchIdToMatchFleet.get(match.getId());
        if (mathFleet == null) {
            throw new RuntimeException(String.format("Игра с %s не найдена, произошла ошибка", match.getId()));
        }

        if (mathFleet.userIdToFleet().get(userId) != null) {
            throw new RuntimeException(
                    String.format("В игре с %s игрок %s, уже расставил флот", match.getId(), userId));
        }

        return mathFleet;
    }

    private void checkUser(String userId, Match match) {
        if (notEqualsUser(userId, match.getOwner()) && notEqualsUser(userId, match.getOpponent())) {
            throw new RuntimeException(String.format("Игрок с %s не учавствует в игре %s ", userId, match.getId()));

        }
    }

    private Match checkMatch(String matchId) {
        Optional<Match> matchOpt = matchService.getMatchById(matchId);
        if (matchOpt.isEmpty()) {
            throw new RuntimeException("Игра не найдена " + matchId);
        }
        Match match = matchOpt.get();
        if (match.getWinner() != null) {
            throw new RuntimeException(String.format("Игра с %s закончилась ", matchId));
        }
        return match;
    }
}
