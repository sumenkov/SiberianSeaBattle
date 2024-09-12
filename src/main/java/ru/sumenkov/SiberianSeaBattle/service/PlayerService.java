package ru.sumenkov.SiberianSeaBattle.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sumenkov.SiberianSeaBattle.dao.PlayerDao;
import ru.sumenkov.SiberianSeaBattle.model.Player;
import ru.sumenkov.SiberianSeaBattle.repository.PlayerRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    private final ModelMapper modelMapper;

    public PlayerService(PlayerRepository playerRepository, ModelMapper modelMapper) {
        this.playerRepository = playerRepository;
        this.modelMapper = modelMapper;
    }

    public Player createPlayer() {
        return createPlayer(null);
    }

    @Transactional
    public Player createPlayer(String name) {
        PlayerDao playerDao = PlayerDao.builder()
                .name(name)
                .build();
        this.playerRepository.save(playerDao);
        return this.modelMapper.map(playerDao, Player.class);
    }

    public Optional<Player> getPlayer(String id) {
        return getPlayer(UUID.fromString(id));
    }

    @Transactional
    public Optional<Player> getPlayer(UUID id) {
        return this.playerRepository.findById(id)
                .map(playerDao -> this.modelMapper.map(playerDao, Player.class));
    }

    @Transactional
    public List<Player> getAllPlayers() {
        return this.playerRepository.findAll()
                .stream()
                .map(playerDao -> this.modelMapper.map(playerDao, Player.class))
                .toList();
    }

    @Transactional
    public void updatePlayer(Player player) {
        PlayerDao playerDao = this.modelMapper.map(player, PlayerDao.class);
        this.playerRepository.save(playerDao);
    }

}
