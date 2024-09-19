package ru.sumenkov.SiberianSeaBattle.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import ru.sumenkov.SiberianSeaBattle.model.message.*;
import ru.sumenkov.SiberianSeaBattle.service.GameService;
import ru.sumenkov.SiberianSeaBattle.service.NotificationService;
import ru.sumenkov.SiberianSeaBattle.service.SeaBattleService;

@Controller
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;
    private final SeaBattleService seaBattleService;
    private final NotificationService notificationService;

    @MessageMapping("/see-battle/chat/request")
    public void greeting(HelloMessage message) throws Exception {
        notificationService.sendMessage(message.getId(), "/queue/messages", message);
    }

    @MessageMapping("/see-battle/create-game/request")
    public void createGame(CreateGameRequestMessage request) throws Exception {
        seaBattleService.createGame(request);
    }

    @MessageMapping("/see-battle/create-fleet/request")
      public void createFleet(CreateFleetRequestMessage request) throws Exception {
        seaBattleService.createFleet(request);
    }

    @MessageMapping("/see-battle/generate-fleet/request")
    public void generateFleet(GenerateFleetRequestMessage request) throws Exception {
        seaBattleService.generateFleet(request);
    }

    @MessageMapping("/see-battle/join-game/request")
    public void joinGame(JoinGameRequestMessage request) throws Exception {
        seaBattleService.joinGame(request);
    }

    @MessageMapping("/see-battle/shot-game/request")
    public void shotGame(ShotGameRequestMessage request) throws Exception {
        seaBattleService.shotGame(request);
    }

    @MessageMapping("/see-battle/matches/request")
    public void getMatches(MatchRequestMessage request) throws Exception {
        seaBattleService.getMatches(request);
    }

    @MessageMapping("/see-battle/match-history/request")
    public void getMatchHistory(MatchHistoryRequestMessage request) throws Exception {
        seaBattleService.getMatchHistory(request);
    }

}