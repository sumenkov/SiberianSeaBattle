package ru.sumenkov.SiberianSeaBattle.dao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.sumenkov.SiberianSeaBattle.model.Player;

import java.util.UUID;

@Data
@Entity
@Table(name = "matches", schema = "siberian_sea_battle")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MatchDao extends AbstractDao {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "owner_id", referencedColumnName = "id", nullable = false)
    private PlayerDao owner;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "opponent_id", referencedColumnName = "id")
    private PlayerDao opponent;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "winner_id", referencedColumnName = "id")
    private PlayerDao winner;

}
