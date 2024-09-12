package ru.sumenkov.SiberianSeaBattle.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.sumenkov.SiberianSeaBattle.dao.AbstractDao;

import javax.swing.*;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActionHistory extends AbstractDao {

    private UUID id;

    private UUID playerId;

    private UUID matchId;

    private Integer x;

    private Integer y;

}
