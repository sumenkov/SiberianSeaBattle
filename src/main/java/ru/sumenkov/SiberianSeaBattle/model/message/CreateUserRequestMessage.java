package ru.sumenkov.SiberianSeaBattle.model.message;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Description: Запрос на создание игрока
 *
 * @author <a href="mailto:onixbed@gmail.com">amaksimov</a>
 * crested on 17.09.2024
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CreateUserRequestMessage extends BaseRequestMessage {
    /**
     * Логин игрока
     */
    private String username;
    /**
     * Пароль игрока
     */
    private String password;

    /**
     * Идентификатор канала
     */
    private String chanelId;
}
