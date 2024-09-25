package ru.sumenkov.SiberianSeaBattle.model.message;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class MatchUI {

    private UUID id;

    private Integer sizeGrid;

    private String ownerName;


    private String opponentName;

    private String winnerName;

    /**
     * Статус игр
     */
    private MatchStatus matchStatus;
}
