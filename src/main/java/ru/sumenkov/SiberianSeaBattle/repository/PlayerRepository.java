package ru.sumenkov.SiberianSeaBattle.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import ru.sumenkov.SiberianSeaBattle.dao.PlayerDao;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlayerRepository extends CrudRepository<PlayerDao, UUID> {

    @NonNull
    List<PlayerDao> findAll();

    Optional<PlayerDao> findByName(String name);

}
