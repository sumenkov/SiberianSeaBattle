package ru.sumenkov.SiberianSeaBattle.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sumenkov.SiberianSeaBattle.dao.MatchDao;
import ru.sumenkov.SiberianSeaBattle.dao.PlayerDao;
import ru.sumenkov.SiberianSeaBattle.model.Match;
import ru.sumenkov.SiberianSeaBattle.model.Player;
import ru.sumenkov.SiberianSeaBattle.repository.MatchRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MatchService {

    private final MatchRepository matchRepository;

    private final ModelMapper modelMapper;

    public MatchService(MatchRepository matchRepository, ModelMapper modelMapper) {
        this.matchRepository = matchRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public Match createMatch(Player owner) {
        PlayerDao ownerDao = this.modelMapper.map(owner, PlayerDao.class);
        MatchDao matchDao = MatchDao.builder()
                .owner(ownerDao)
                .build();
        this.matchRepository.save(matchDao);
        return this.modelMapper.map(matchDao, Match.class);
    }

    public Optional<Match> getMatchById(String id) {
        return getMatchById(UUID.fromString(id));
    }

    @Transactional
    public Optional<Match> getMatchById(UUID id) {
        return this.matchRepository.findById(id)
                .map(matchDao -> this.modelMapper.map(matchDao, Match.class));
    }

    @Transactional
    public List<Match> getAllMatches() {
        return this.matchRepository.findAll()
                .stream()
                .map(matchDao -> this.modelMapper.map(matchDao, Match.class))
                .toList();
    }


    @Transactional
    public void updateMatch(Match match) {
        MatchDao matchDao = this.modelMapper.map(match, MatchDao.class);
        this.matchRepository.save(matchDao);
    }

}
