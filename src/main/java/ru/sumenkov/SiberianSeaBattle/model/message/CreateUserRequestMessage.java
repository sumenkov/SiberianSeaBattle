package ru.sumenkov.SiberianSeaBattle.model.message;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

/**
 * Description: Запрос на создание игрока
 *
 * @author <a href="mailto:onixbed@gmail.com">amaksimov</a>
 * crested on 17.09.2024
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CreateUserRequestMessage extends BaseRequestMessage {
    private String username;
    private String password;
    private UUID chanelId;
}
