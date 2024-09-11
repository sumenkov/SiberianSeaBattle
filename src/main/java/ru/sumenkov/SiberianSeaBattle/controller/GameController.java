package ru.sumenkov.SiberianSeaBattle.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;
import ru.sumenkov.SiberianSeaBattle.model.response.Greeting;
import ru.sumenkov.SiberianSeaBattle.model.message.HelloMessage;

@Controller
public class GameController {
    @MessageMapping("/hello")
    @SendTo("/topic/game")
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }

}
