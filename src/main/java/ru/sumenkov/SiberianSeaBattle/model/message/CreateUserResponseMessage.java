package ru.sumenkov.SiberianSeaBattle.model.message;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Description: Нотификация о растановки короблей для соперника
 *
 * @author <a href="mailto:onixbed@gmail.com">amaksimov</a>
 * crested on 18.09.2024
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CreateUserResponseMessage extends  BaseResponseMessage {
    private String userId;
    private String chanelId;
}
