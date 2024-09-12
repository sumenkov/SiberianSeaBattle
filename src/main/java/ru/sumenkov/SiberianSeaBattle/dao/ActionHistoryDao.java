package ru.sumenkov.SiberianSeaBattle.dao;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.sumenkov.SiberianSeaBattle.model.Match;
import ru.sumenkov.SiberianSeaBattle.model.Player;

import java.util.UUID;

@Data
@Entity
@Table(name = "actions_history", schema = "siberian_sea_battle")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActionHistoryDao extends AbstractDao {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "match_id", referencedColumnName = "id", nullable = false)
    private MatchDao match;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "player_id", referencedColumnName = "id", nullable = false)
    private PlayerDao player;

    @Column(name = "x")
    private Integer x;

    @Column(name = "y")
    private Integer y;

}
