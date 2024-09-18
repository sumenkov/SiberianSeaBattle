package ru.sumenkov.SiberianSeaBattle.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ru.sumenkov.SiberianSeaBattle.model.Match;
import ru.sumenkov.SiberianSeaBattle.model.Player;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class MatchServiceTest {

    @Autowired
    private MatchService matchService;

    @Autowired
    private PlayerService playerService;

    @Test
    void createMatchTest() {
        Player player = playerService.createPlayer("p1" + UUID.randomUUID(), UUID.randomUUID());
        Match match = matchService.createMatch(player, 3);
        assertNotNull(match);
        assertNotNull(match.getId());
    }
}