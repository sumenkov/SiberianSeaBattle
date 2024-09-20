package ru.sumenkov.SiberianSeaBattle.model.message;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

/**
 * Description: Ответ информация пользователя
 *
 * @author <a href="mailto:onixbed@gmail.com">amaksimov</a>
 * crested on 17.09.2024
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GetUserResponseMessage extends BaseResponseMessage {
    private String userId;
    private String chanelId;
}
