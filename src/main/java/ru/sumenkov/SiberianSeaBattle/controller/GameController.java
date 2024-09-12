package ru.sumenkov.SiberianSeaBattle.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;
import ru.sumenkov.SiberianSeaBattle.model.Fleet;
import ru.sumenkov.SiberianSeaBattle.model.message.HelloMessage;
import ru.sumenkov.SiberianSeaBattle.model.response.Greeting;
import ru.sumenkov.SiberianSeaBattle.service.GameService;

@Controller
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Greeting greeting(HelloMessage message) throws Exception {
        Fleet fleet = gameService.getFleet(10, 10);
        StringBuilder stRor = new StringBuilder();
        for (Integer[] row : fleet.getGrids()) {

            for (Integer point : row) {
                stRor.append(point == null ? 0 : point);
                stRor.append(" ");
            }
            stRor.append("<br>");
        }

        return new Greeting( HtmlUtils.htmlEscape(message.getName()) + "<br>Текущий расклад: <br>" + stRor.toString() + "!");
    }

}
