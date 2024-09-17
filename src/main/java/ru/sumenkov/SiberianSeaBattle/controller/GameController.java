package ru.sumenkov.SiberianSeaBattle.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;


import ru.sumenkov.SiberianSeaBattle.acl.GameMapper;
import ru.sumenkov.SiberianSeaBattle.model.game.Fleet;
import ru.sumenkov.SiberianSeaBattle.model.message.*;
import ru.sumenkov.SiberianSeaBattle.service.GameService;
import ru.sumenkov.SiberianSeaBattle.service.SeaBattleService;

@Controller
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;
    private final SeaBattleService seaBattleService;

    @MessageMapping("/see-battle/chat/request")
    @SendTo("/see-battle/chat/response")
    public Greeting greeting(HelloMessage message) throws Exception {
        Fleet fleet = gameService.getFleet(10, 10);
        int[][] grids =  GameMapper.toGridsForOwner(fleet.getGrids());
        StringBuilder stRor = new StringBuilder();
        stRor.append("Вид карта для для владелца карты <br>");
        for (int[] row : grids) {

            for (int point : row) {
                stRor.append(point);
                stRor.append(" ");
            }
            stRor.append("<br>");
        }
        stRor.append("<br> Вид карта для соперника");
        stRor.append("<br>");
        int[][] opponentGrids =  GameMapper.toGridsForOpponent(fleet.getGrids());
        for (int[] row : opponentGrids) {

            for (int point : row) {
                stRor.append(point);
                stRor.append(" ");
            }
            stRor.append("<br>");
        }

        return new Greeting( HtmlUtils.htmlEscape(message.getName()) + "<br>Текущий расклад: <br>" + stRor.toString() + "!");
    }

    @MessageMapping("/see-battle/create-game/request")
    @SendTo("/see-battle/create-game/response")
    public CreateGameResponseMessage createGame(CreateGameRequestMessage request) throws Exception {
        return seaBattleService.createGame(request);
    }

    @MessageMapping("/see-battle/create-fleet/request")
    @SendTo("/see-battle/create-fleet/response")
    public CreateFleetResponseMessage createFleet(CreateFleetRequestMessage request) throws Exception {
        return seaBattleService.createFleet(request);
    }

    @MessageMapping("/see-battle/generate-fleet/request")
    @SendTo("/see-battle/generate-fleet/response")
    public GenerateFleetResponseMessage generateFleet(GenerateFleetRequestMessage request) throws Exception {
        return seaBattleService.generateFleet(request);
    }

    @MessageMapping("/see-battle/join-game/request")
    @SendTo("/see-battle/join-game/response")
    public JoinGameResponseMessage joinGame(JoinGameRequestMessage request) throws Exception {
        return seaBattleService.joinGame(request);
    }

}