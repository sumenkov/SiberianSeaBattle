package ru.sumenkov.SiberianSeaBattle.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ru.sumenkov.SiberianSeaBattle.model.Player;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class PlayerServiceTest {

    @Autowired
    private PlayerService playerService;

    @Test
    void createPlayerTest() {
        Player player = playerService.createPlayer("p1" + UUID.randomUUID(), UUID.randomUUID());
        assertNotNull(player);
        assertNotNull(player.getId());
    }

    @Test
    void updatePlayerTest() {
        Player oldPlayer = this.playerService.createPlayer("p1" + UUID.randomUUID(), UUID.randomUUID());

    }

}