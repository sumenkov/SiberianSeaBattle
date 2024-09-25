package ru.sumenkov.SiberianSeaBattle.service;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sumenkov.SiberianSeaBattle.dao.MatchDao;
import ru.sumenkov.SiberianSeaBattle.dao.PlayerDao;
import ru.sumenkov.SiberianSeaBattle.model.Match;
import ru.sumenkov.SiberianSeaBattle.model.Player;
import ru.sumenkov.SiberianSeaBattle.model.message.MatchStatus;
import ru.sumenkov.SiberianSeaBattle.repository.MatchRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;

    private final ModelMapper modelMapper;

    @Transactional
    public Match createMatch(Player owner, int sizeGrid) {
        PlayerDao ownerDao = modelMapper.map(owner, PlayerDao.class);
        MatchDao matchDao = new MatchDao();
        matchDao.setOwner(ownerDao);
        matchDao.setSizeGrid(sizeGrid);
        matchDao.setStatus(MatchStatus.WAIT);


        matchRepository.save(matchDao);

        return modelMapper.map(matchDao, Match.class);
    }

    @Transactional
    public Optional<Match> getMatchById(String id) {
        return getMatchById(UUID.fromString(id));
    }

    @Transactional
    public Optional<Match> getMatchById(UUID id) {
        return matchRepository.findById(id)
                .map(matchDao -> modelMapper.map(matchDao, Match.class));
    }

    @Transactional
    public List<Match> getAllMatches() {
        return matchRepository.findAll()
                .stream()
                .map(matchDao -> modelMapper.map(matchDao, Match.class))
                .toList();
    }

    @Transactional
    public void updateMatch(Match match) {
        MatchDao matchDao = this.modelMapper.map(match, MatchDao.class);
        this.matchRepository.save(matchDao);
    }

    @Transactional
    public List<Match> getAllMatchesByStatus(MatchStatus matchStatus) {
        List<MatchDao> matches;
        if(MatchStatus.ALL.equals(matchStatus)) {
            matches = matchRepository.findAll();
        } else {
            matches = matchRepository.findAllByStatus(matchStatus);
        }
        return matches.stream()
                .map(matchDao -> modelMapper.map(matchDao, Match.class))
                .toList();
     }

    public Optional<Match> getWaitMatchByPlayerId(UUID playerId) {
        var match = matchRepository.findByOwner_idAndStatusNot(playerId, MatchStatus.COMPLETED);
        if (match.isEmpty()) {
            match = matchRepository.findByOpponent_idAndStatusNot(playerId, MatchStatus.COMPLETED);
        }

        return match.map(m -> modelMapper.map(m, Match.class));
    }
}
