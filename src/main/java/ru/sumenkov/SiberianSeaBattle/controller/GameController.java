package ru.sumenkov.SiberianSeaBattle.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;
import ru.sumenkov.SiberianSeaBattle.model.Fleet;

import ru.sumenkov.SiberianSeaBattle.acl.GameMapper;
import ru.sumenkov.SiberianSeaBattle.model.game.Fleet;
import ru.sumenkov.SiberianSeaBattle.model.message.HelloMessage;
import ru.sumenkov.SiberianSeaBattle.model.response.Greeting;
import ru.sumenkov.SiberianSeaBattle.service.GameService;

@Controller
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

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

}
