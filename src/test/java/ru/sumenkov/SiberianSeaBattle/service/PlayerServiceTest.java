package ru.sumenkov.SiberianSeaBattle.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ru.sumenkov.SiberianSeaBattle.model.Player;

import java.util.function.ObjLongConsumer;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PlayerServiceTest {

    @Autowired
    private PlayerService playerService;

    @Test
    void createPlayerTest() {
        Player player = playerService.createPlayer();
        assertNotNull(player);
        assertNotNull(player.getId());
    }

    @Test
    void updatePlayerTest() {
        Player oldPlayer = this.playerService.createPlayer();

    }

}