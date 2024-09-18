package ru.sumenkov.SiberianSeaBattle.model.message;


import lombok.Data;

import java.util.UUID;

@Data
public class HelloMessage {


    private String name;
    private UUID id;

}
