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
package ru.sumenkov.SiberianSeaBattle.controller;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RestController;
import ru.sumenkov.SiberianSeaBattle.model.Fleet;
import ru.sumenkov.SiberianSeaBattle.model.Warship;
import ru.sumenkov.SiberianSeaBattle.service.GameService;

/**
 * Description:
 *
 * @author <a href="mailto:onixbed@gmail.com">amaksimov</a>
 * crested on 09.09.2024
 */
@RequiredArgsConstructor
@RestController
@Slf4j
public class TestController {
    private final GameService gameService;

    @PostConstruct
    void initTest() {
        for (int countGame = 0; countGame < 10; countGame++) {

            Fleet fleet = gameService.getFleet(10,
                                               10);
            log.info("fleat game " + countGame);
            for (Warship warship : fleet.getWarships()) {
                log.info(String.format("start (x=%s, y=%s) end (x=%s, y=%s)",
                                       warship.start().x() + 1,
                                       warship.start().y() + 1,
                                       warship.end().x() + 1,
                                       warship.end().y() + 1));
            }
            log.info("grids");
            Integer[][] grids = fleet.getGrids();
            for (int oy = 0; oy < grids.length; oy++) {
                if (oy == 0) {
                    log.info("    1,2,3,4,5,6,7,8,9,10");
                    log.info("   ---------------------");
                }
                String line = getOxLine(grids, oy);
                log.info(line);
            }
        }
    }

    private static String getOxLine(Integer[][] grids, int oy) {
        StringBuilder stRor = new StringBuilder();
        Integer[] pointsOx = grids[oy];
        for (int ox = 0; ox < pointsOx.length; ox++) {
            if (ox == 0) {
                if (oy < 9) {
                    stRor.append("0");
                }
                stRor.append((oy + 1));
                stRor.append(" |");
            }
            Integer point = pointsOx[ox];
            stRor.append(point == null ? 0 : point);
            stRor.append(" ");
        }
        return stRor.toString();
    }
}
