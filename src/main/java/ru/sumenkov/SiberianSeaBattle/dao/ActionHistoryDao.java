package ru.sumenkov.SiberianSeaBattle.dao;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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



}
