package ru.sumenkov.SiberianSeaBattle.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.sumenkov.SiberianSeaBattle.dao.PlayerDao;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlayerRepository extends CrudRepository<PlayerDao, UUID> {

    List<PlayerDao> findAll();

}
