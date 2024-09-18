/*
 *  Copyright 2023 Contributors to the Sports-club.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package ru.sumenkov.SiberianSeaBattle.model.game;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Description: Структура для хранения прогреса матча
 *
 * @author <a href="mailto:onixbed@gmail.com">amaksimov</a>
 * crested on 17.09.2024
 */
public record MatchFleet(Map<UUID, Fleet> userIdToFleet) {

    /**
     * Находит флот соперника
     * @param userId идентификатор пользователя (не соперника)
     * @return флот соперника
     */
    public Fleet getOpponentFleet(UUID userId) {
       return findOpponentUserId(userId).map(userIdToFleet::get).orElseThrow(()-> new RuntimeException(String.format("Не смогли найти соперника для игрока %s", userId)));
    }

    public Optional<UUID> findOpponentUserId(UUID userId) {
        for (Map.Entry<UUID, Fleet> entry: userIdToFleet.entrySet()) {
            if(!entry.getKey().equals(userId)) {
                return Optional.of(entry.getKey());
            }
        }
       return Optional.empty();
    }

    /**
     * Проверяет расставил соперник флот
     * @param userId идентификатор пользователя (не соперника)
     * @return true -если соперник готов, false - не готов
     */
    public boolean checkOpponentDone(UUID userId) {
        return userIdToFleet.size() > 1;
    }
}
