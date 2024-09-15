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
import ru.sumenkov.SiberianSeaBattle.model.game.CustomFleet;
import ru.sumenkov.SiberianSeaBattle.model.game.Fleet;
import ru.sumenkov.SiberianSeaBattle.model.game.GridPoint;
import ru.sumenkov.SiberianSeaBattle.model.game.Warship;
import ru.sumenkov.SiberianSeaBattle.service.GameService;

import java.util.Optional;

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
        Fleet fleet = gameService.getFleet(10,
                                           10);
        for (int countGame = 0; countGame < 10; countGame++) {
            log.info("fleat game " + countGame);
            for (Warship warship : fleet.getWarships()) {
                log.info(String.format("start (x=%s, y=%s) end (x=%s, y=%s) size %s live %s",
                                       warship.getStart().x() + 1,
                                       warship.getStart().y() + 1,
                                       warship.getEnd().x() + 1,
                                       warship.getEnd().y() + 1,
                                       warship.getSize(),
                                       warship.getLives()));
            }
            log.info("grids");
            GridPoint[][] grids = fleet.getGrids();
            for (int oy = 0; oy < grids.length; oy++) {
                if (oy == 0) {
                    log.info("    1,2,3,4,5,6,7,8,9,10");
                    log.info("   ---------------------");
                }
                String line = getOxLine(grids,
                                        oy);
                log.info(line);
            }
            int x = Math.toIntExact(Math.round(Math.random() * 9));
            int y = Math.toIntExact(Math.round(Math.random() * 9));
            boolean isHit = gameService.checkShot(fleet,
                                                  x,
                                                  y);
            log.info(String.format("is hit %s x %s y %s",
                                   isHit,
                                   x + 1,
                                   y + 1));

        }
        log.info("-------------------");
        log.info("start checkCustomFleet (проверка кастамной расстановки флота)");
        int[][] customGrids = new int[10][10];
            customGrids[3][4]=1;
            customGrids[5][5]=2;
            customGrids[5][6]=2;

            customGrids[5][7]=3;

        CustomFleet customFleet =  gameService.checkCustomFleet(customGrids);


            for (Warship warship : customFleet.getFleet().getWarships()) {
                log.info(String.format("start (x=%s, y=%s) end (x=%s, y=%s) size %s live %s",
                                       warship.getStart().x() + 1,
                                       warship.getStart().y() + 1,
                                       warship.getEnd().x() + 1,
                                       warship.getEnd().y() + 1,
                                       warship.getSize(),
                                       warship.getLives()));
            }
            log.info("grids");
            GridPoint[][] grids = customFleet.getFleet().getGrids();
            for (int oy = 0; oy < grids.length; oy++) {
                if (oy == 0) {
                    log.info("    1,2,3,4,5,6,7,8,9,10");
                    log.info("   ---------------------");
                }
                String line = getOxLine(grids,
                                        oy);
                log.info(line);
            }
            int x = Math.toIntExact(Math.round(Math.random() * 9));
            int y = Math.toIntExact(Math.round(Math.random() * 9));
            boolean isHit = gameService.checkShot(fleet,
                                                  x,
                                                  y);
            log.info(String.format("is hit %s x %s y %s",
                                   isHit,
                                   x + 1,
                                   y + 1));



    }

    private static String getOxLine(GridPoint[][] grids, int oy) {
        StringBuilder stRor = new StringBuilder();
        GridPoint[] pointsOx = grids[oy];
        for (int ox = 0; ox < pointsOx.length; ox++) {
            if (ox == 0) {
                if (oy < 9) {
                    stRor.append("0");
                }
                stRor.append((oy + 1));
                stRor.append(" |");
            }
            GridPoint point = pointsOx[ox];
            Optional<Warship> warship = point.getWarship();
            String pointX;
            pointX = warship.map(value -> value.getLives() == 0 ? "x" : "" + value.getSize())
                    .orElseGet(() -> point.isExplored() ? "x" : "*");
            stRor.append(pointX);
            stRor.append(" ");
        }
        return stRor.toString();
    }
}
