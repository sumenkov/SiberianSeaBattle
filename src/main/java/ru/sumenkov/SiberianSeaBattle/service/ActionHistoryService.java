package ru.sumenkov.SiberianSeaBattle.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sumenkov.SiberianSeaBattle.dao.ActionHistoryDao;
import ru.sumenkov.SiberianSeaBattle.dao.MatchDao;
import ru.sumenkov.SiberianSeaBattle.dao.PlayerDao;
import ru.sumenkov.SiberianSeaBattle.model.ActionHistory;
import ru.sumenkov.SiberianSeaBattle.model.Match;
import ru.sumenkov.SiberianSeaBattle.model.Player;
import ru.sumenkov.SiberianSeaBattle.repository.ActionHistoryRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ActionHistoryService {

    private final ActionHistoryRepository actionHistoryRepository;

    private final ModelMapper modelMapper;

    public ActionHistoryService(ActionHistoryRepository actionHistoryRepository, ModelMapper modelMapper) {
        this.actionHistoryRepository = actionHistoryRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public ActionHistory createActionHistory(Match match, Player player, int x, int y) {
        MatchDao matchDao = this.modelMapper.map(match, MatchDao.class);
        PlayerDao playerDao = this.modelMapper.map(player, PlayerDao.class);
        ActionHistoryDao actionHistoryDao = new ActionHistoryDao();
        actionHistoryDao.setMatch(matchDao);
        actionHistoryDao.setPlayer(playerDao);
        actionHistoryDao.setX(x);
        actionHistoryDao.setY(y);

        this.actionHistoryRepository.save(actionHistoryDao);

        return this.modelMapper.map(actionHistoryDao, ActionHistory.class);
    }

    @Transactional
    public Optional<ActionHistory> findActionHistoryById(String id) {
        return findActionHistoryById(UUID.fromString(id));
    }

    @Transactional
    public Optional<ActionHistory> findActionHistoryById(UUID id) {
        return this.actionHistoryRepository.findById(id)
                .map(actionHistoryDao -> this.modelMapper.map(actionHistoryDao, ActionHistory.class));
    }

    @Transactional
    public List<ActionHistory> findAllByPlayerId(UUID playerId) {
        return this.actionHistoryRepository.findAllByPlayerId(playerId)
                .stream()
                .map(actionHistoryDao -> this.modelMapper.map(actionHistoryDao, ActionHistory.class))
                .toList();
    }

    @Transactional
    public List<ActionHistory> findAllByMatchId(UUID matchId) {
        return this.actionHistoryRepository.findAllByMatchId(matchId)
                .stream()
                .map(actionHistoryDao -> this.modelMapper.map(actionHistoryDao, ActionHistory.class))
                .toList();
    }

    @Transactional
    public void updateActionHistory(ActionHistory actionHistory) {
        ActionHistoryDao actionHistoryDao = this.modelMapper.map(actionHistory, ActionHistoryDao.class);
        this.actionHistoryRepository.save(actionHistoryDao);
    }

}
