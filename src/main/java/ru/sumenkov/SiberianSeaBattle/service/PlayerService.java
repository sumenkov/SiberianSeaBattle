package ru.sumenkov.SiberianSeaBattle.service;

import org.springframework.stereotype.Service;
import ru.sumenkov.SiberianSeaBattle.dao.PlayerDao;
import ru.sumenkov.SiberianSeaBattle.model.Player;
import ru.sumenkov.SiberianSeaBattle.repository.PlayerRepository;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public Player createPlayer() {
        return createPlayer(null);
    }

    public Player createPlayer(String name) {
        PlayerDao playerDao = PlayerDao.builder()
                .name(name)
                .build();
        playerRepository.save(playerDao);
        return Player.builder()
                .id(playerDao.getId())
                .name(playerDao.getName())
                .build();
    }

}
