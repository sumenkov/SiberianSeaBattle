package ru.sumenkov.SiberianSeaBattle.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ru.sumenkov.SiberianSeaBattle.model.ActionHistory;
import ru.sumenkov.SiberianSeaBattle.model.Match;
import ru.sumenkov.SiberianSeaBattle.model.Player;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ActionHistoryServiceTest {

    @Autowired
    private ActionHistoryService actionHistoryService;

    @Autowired
    private MatchService matchService;

    @Autowired
    private PlayerService playerService;

    @Test
    void createActionHistoryTest() {
        Player player = this.playerService.createPlayer("p1" + UUID.randomUUID());
        Match match = this.matchService.createMatch(player, 5);
        ActionHistory actionHistory = this.actionHistoryService.createActionHistory(match, player, 1, 1);
        Assertions.assertNotNull(actionHistory);
    }

}