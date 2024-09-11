package ru.sumenkov.SiberianSeaBattle.service;

import org.springframework.stereotype.Service;
import ru.sumenkov.SiberianSeaBattle.dao.MatchDao;
import ru.sumenkov.SiberianSeaBattle.model.Match;
import ru.sumenkov.SiberianSeaBattle.repository.MatchRepository;

@Service
public class MatchService {

    private final MatchRepository matchRepository;

    public MatchService(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    public Match createMatch() {
        MatchDao matchDao = new MatchDao();
        matchRepository.save(matchDao);
        return Match.builder()
                .id(matchDao.getId())
                .build();
    }

}
