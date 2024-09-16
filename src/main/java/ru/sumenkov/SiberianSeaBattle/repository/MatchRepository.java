package ru.sumenkov.SiberianSeaBattle.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.sumenkov.SiberianSeaBattle.dao.MatchDao;

import java.util.List;
import java.util.UUID;

@Repository
public interface MatchRepository extends CrudRepository<MatchDao, UUID> {

    List<MatchDao> findAll();

}
