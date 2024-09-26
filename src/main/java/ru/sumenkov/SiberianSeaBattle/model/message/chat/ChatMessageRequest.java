package ru.sumenkov.SiberianSeaBattle.model.message.chat;


import lombok.Data;

import java.util.UUID;

@Data
public class ChatMessageRequest {

    /**
     * Текст в чате
     */
    private String name;
    /**
     * Идентификатор для подписки (канала)
     */
    private UUID id;

}
