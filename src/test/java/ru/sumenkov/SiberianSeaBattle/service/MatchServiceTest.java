package ru.sumenkov.SiberianSeaBattle.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ru.sumenkov.SiberianSeaBattle.model.Match;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MatchServiceTest {

    @Autowired
    private MatchService matchService;

    @Test
    void createMatchTest() {
        Match match = matchService.createMatch();
        assertNotNull(match);
        assertNotNull(match.getId());
    }
}