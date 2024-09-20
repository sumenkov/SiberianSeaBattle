package ru.sumenkov.SiberianSeaBattle.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Player {

    private UUID id;
    private UUID chanelId;
    private String name;
    private String password;

}
