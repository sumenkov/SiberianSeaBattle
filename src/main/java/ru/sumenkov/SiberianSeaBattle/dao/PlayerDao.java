package ru.sumenkov.SiberianSeaBattle.dao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.sumenkov.SiberianSeaBattle.model.Player;

import java.util.UUID;

@Entity
@Table(name = "players", schema = "siberian_sea_battle")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlayerDao extends AbstractDao {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "name")
    private String name;

}
