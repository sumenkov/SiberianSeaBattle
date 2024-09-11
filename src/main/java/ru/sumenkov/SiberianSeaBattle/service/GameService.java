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
package ru.sumenkov.SiberianSeaBattle.service;

import org.springframework.stereotype.Service;
import ru.sumenkov.SiberianSeaBattle.model.CustomFleet;
import ru.sumenkov.SiberianSeaBattle.model.Fleet;
import ru.sumenkov.SiberianSeaBattle.model.GridPoint;
import ru.sumenkov.SiberianSeaBattle.model.Point;
import ru.sumenkov.SiberianSeaBattle.model.Warship;
import ru.sumenkov.SiberianSeaBattle.model.WarshipDescription;

import java.util.List;
import java.util.Optional;
import java.util.Random;

/**
 * Description: Сервис по работе с логикой игры
 *
 * @author <a href="mailto:onixbed@gmail.com">amaksimov</a>
 * crested on 09.09.2024
 */
@Service
public class GameService {

    private final Random rand = new Random();
    List<WarshipDescription> warshipDescriptions = List.of(
            new WarshipDescription(1, 4),
            new WarshipDescription(2, 3),
            new WarshipDescription(3, 2),
            new WarshipDescription(4, 1)
    );

    /**
     * Метод геерации флота и карты
     * @param xSize размкер карты по OX
     * @param ySize размкер карты по OY
     * @return флот
     */
    public Fleet getFleet(int xSize, int ySize) {
        Fleet fleet = new Fleet();
        GridPoint[][] grids = new GridPoint[xSize][ySize];
        //Заполяем поля пустыми клетками
        for(GridPoint[] points: grids) {
            for(int ox=0; ox< points.length; ox++) {
                points[ox] = new GridPoint(Optional.empty(), false);
            }
        }

        for (WarshipDescription warshipDescription : warshipDescriptions) {
            for (int warshipCount = 0; warshipCount < warshipDescription.count(); warshipCount++) {
                Warship warship = getWarship(grids,
                        warshipDescription.size());
                fleet.addWarship(warship);
            }
        }
        fleet.setGrids(grids);
        return fleet;
    }

    /**
     * Метод проерки расстановки флота от Пользователя
     * @param grids поле с флотом
     * @return Возвращает структуру с информацией где кривые данные
     */
    public CustomFleet checkCustomFleet(Integer[][] grids) {
        //TODO можно не делать пока если проверка будет сделана на фронте
        //нужно отдавать статус и если статус кривой то еще и карту с отеткой что не так
        CustomFleet customFleet =  new CustomFleet();
        customFleet.setStatus(true);
        return customFleet;
    }

    /**
     * Проверить выстрел
     * Внимание структура флота будет включть выстрел (пройзойдет изминение во флоте)
     * @return true если выстрел попал, false - промах
     */
    public boolean checkShot(Fleet fleet, int x, int y) {
        GridPoint gridPoint = fleet.getGrids()[y][x];
        Optional<Warship> warshipOpt = gridPoint.getWarship();
        gridPoint.setExplored(true);
        if (warshipOpt.isEmpty()) {
            return false;
        }
        Warship warship = warshipOpt.get();
        boolean isKilled = warship.hit();
        if(isKilled) {
            kill(warship, fleet.getGrids());
        }
        return true;
    }

    /**
     * Убить корабыль (вокруг корабля пометить все клетки)
     * @param warship корабыль
     * @param grids поле
     */
    private void kill(Warship warship, GridPoint[][] grids) {
        final int x1;
        final int x2;
        final int y1;
        final int y2;
        //Алгорит вычесляет x1 y1 самую левую и верхгюю точку (минимальные)
        final boolean directionOX;
        if(warship.getStart().x() == warship.getEnd().x()) {
            directionOX = true;
            if(warship.getStart().y() < warship.getEnd().y()) {
                x1 = warship.getStart().x();
                y1 = warship.getStart().y();

                x2 = warship.getEnd().x();
                y2 = warship.getEnd().y();
            } else {
                x1 = warship.getEnd().x();
                y1 = warship.getEnd().y();

                x2 = warship.getStart().x();
                y2 = warship.getStart().y();
            }

        } else {
            directionOX = false;
            if(warship.getStart().x() < warship.getEnd().x()) {
                x1 = warship.getStart().x();
                y1 = warship.getStart().y();

                x2 = warship.getEnd().x();
                y2 = warship.getEnd().y();
            } else {
                x1 = warship.getEnd().x();
                y1 = warship.getEnd().y();

                x2 = warship.getStart().x();
                y2 = warship.getStart().y();
            }
        }
        for(int oy = y1; oy <= y2; oy++) {
            for(int ox = x1; ox <= x2; ox++) {
                // первая клетка
                if(ox == x1 && oy== y1) {
                    if (directionOX) {
                        int checkY = oy-1;
                        int checkX = ox -1;
                        if(checkX >=0 && checkY>=0) {
                            grids[checkY][checkX].setExplored(true);
                        }
                        checkY = oy+1;
                        if(checkX >=0 && checkY < grids.length ) {
                            grids[checkY][checkX].setExplored(true);
                        }
                        if(checkX >=0 ) {
                            grids[oy][checkX].setExplored(true);
                        }
                    } else {
                        int checkX = ox-1;
                        int checkY = oy -1;
                        if(checkY >=0 && checkX>=0 ) {
                            grids[checkY][checkX].setExplored(true);
                        }
                        checkX = ox+1;
                        if(checkY >=0 && checkX < grids[0].length ) {
                            grids[checkY][checkX].setExplored(true);
                        }
                        if(checkY >=0 ) {
                            grids[checkY][ox].setExplored(true);
                        }
                    }
                }
                if (directionOX) {
                    //клетку ниже
                    int checkY = oy + 1;
                    if (checkY < grids.length) {
                        grids[checkY][ox].setExplored(true);
                    }
                    //клетку выше
                    checkY = oy - 1;
                    if (checkY >= 0) {
                        grids[checkY][ox].setExplored(true);
                    }
                } else {
                    //клетку правее
                    int checkX = ox + 1;
                    if (checkX < grids[0].length) {
                        grids[oy][checkX].setExplored(true);
                    }
                    //клетку левее
                    checkX = ox - 1;
                    if (checkX >= 0) {
                        grids[oy][checkX].setExplored(true);
                    }
                }

                //последняя клетка
                if(ox == x2 && oy == y2) {
                    if(directionOX) {
                        int checkY = oy-1;
                        int checkX = ox +1;
                        if(checkX < grids[0].length && checkY>=0 ) {
                          grids[checkY][checkX].setExplored(true);
                        }
                        checkY = oy+1;
                        if(checkX < grids[0].length && checkY < grids.length ) {
                           grids[checkY][checkX].setExplored(true);
                        }
                        if(checkX < grids[0].length) {
                             grids[oy][checkX].setExplored(true);
                        }
                    } else {
                        int checkX = ox-1;
                        int checkY = oy +1;
                        if(checkY < grids.length  && checkX >=0 ) {
                            grids[checkY][checkX].setExplored(true);
                        }
                        checkX = ox+1;
                        if(checkY < grids.length && checkX < grids[0].length ) {
                            grids[checkY][checkX].setExplored(true);
                        }
                        if(checkY < grids.length ) {
                            grids[checkY][ox].setExplored(true);
                        }
                    }

                }

            }
        }

        //TODO реализовать убийсво корабля
    }

    private Warship getWarship(GridPoint[][] grids, int size) {
        //TODO Нужно добавить разные алгоритмы растанновки
        int minX = 0;
        int minY = 0;
        Optional<Warship> warship;
        boolean directionOX;
        do {
            directionOX = rand.nextBoolean();
            int maxX = grids[0].length - (directionOX ? size : 1);
            int maxY = grids.length - (directionOX ? 1 : size);
            int x = getRandom(maxX, minX);
            int y = getRandom(maxY, minY);
            warship = getWarship(x, y, directionOX, grids, size);
        } while (warship.isEmpty());

        return warship.get();
    }

    private Optional<Warship> getWarship(int x, int y, boolean directionOX, GridPoint[][] grids, int size) {
        Optional<Warship> warship = getWarship(x, y, directionOX, grids, size, 1);
        if (warship.isPresent()) {
            return warship;
        }

        return getWarship(x, y, directionOX, grids, size, -1);
    }

    private Optional<Warship> getWarship(int x, int y, boolean directionOX, GridPoint[][] grids, int size, int direction) {
        int maxX = x + (size * direction);
        if (directionOX && maxX > grids[0].length || maxX < -1) {
            return Optional.empty();
        }
        int maxY = y + (size * direction);
        if (!directionOX && maxY > grids.length || maxY < -1) {
            return Optional.empty();
        }

        for (int index = 0; index < size; index++) {
            if (directionOX) {
                int checkX = x + (index * direction);
                if (grids[y][checkX].getWarship().isPresent()) {
                    return Optional.empty();
                }
                if(isInvalidPositionAround(index == 0, index == size-1, directionOX, y, checkX, grids, direction)){
                    return Optional.empty();
                }
            } else {
                int checkY = y + (index * direction);
                if (grids[checkY][x].getWarship().isPresent()) {
                    return Optional.empty();
                }
                if(isInvalidPositionAround(index == 0, index == size-1, directionOX, checkY, x, grids, direction)){
                    return Optional.empty();
                }
            }
        }
        Point end;
        if (directionOX) {
            end = new Point(x + ((size - 1) * direction), y);
        } else {
            end = new Point(x, y + ((size - 1) * direction));
        }

        Warship warship = new Warship(new Point(x, y), end, size, size);
        GridPoint point = new GridPoint(Optional.of(warship), false);
        //После провкерки нужно пометить поле
        for (int index = 0; index < size; index++) {
            if (directionOX) {
                int checkX = x + (index * direction);
                grids[y][checkX] = point;
            } else {
                int checkY = y + (index * direction);
                grids[checkY][x] = point;
            }
        }
        return Optional.of(warship);


    }

    private boolean isInvalidPositionAround(boolean isFirst, boolean isLast, boolean directionOX, int y, int x,
                                            GridPoint[][] grids, int direction) {
        if(direction <0) {
            //Если навправление обратное то поменять местами признаки начала и конца
            boolean tmp = isFirst;
            isFirst = isLast;
            isLast = tmp;
        }
        if(directionOX) {
            //проверяем клетку ниже
            int checkY = y+1;
            if(checkY < grids.length && grids[checkY][x].getWarship().isPresent())  {
                return true;
            }
            //проверяем клетку выше
            checkY = y-1;
            if(checkY >=0 && grids[checkY][x].getWarship().isPresent()) {
                return true;
            }
            //если это первая клетка проверяем левее 3 клетки
            if(isFirst) {
                checkY = y-1;
                int checkX = x -1;
                if(checkX >=0 && checkY>=0 && grids[checkY][checkX].getWarship().isPresent()) {
                    return true;
                }
                checkY = y+1;
                if(checkX >=0 && checkY < grids.length && grids[checkY][checkX].getWarship().isPresent()) {
                    return true;
                }
                if(checkX >=0 && grids[y][checkX].getWarship().isPresent()) {
                    return true;
                }
            }
            //если это последняя клетка проверяем правые 3 клетки
            if(isLast) {
                checkY = y-1;
                int checkX = x +1;
                if(checkX < grids[0].length && checkY>=0 && grids[checkY][checkX].getWarship().isPresent()) {
                    return true;
                }
                checkY = y+1;
                if(checkX < grids[0].length && checkY < grids.length && grids[checkY][checkX].getWarship().isPresent()) {
                    return true;
                }
                if(checkX < grids[0].length && grids[y][checkX].getWarship().isPresent()) {
                    return true;
                }
            }

        } else {
            //проверяем клетку правее
            int checkX = x+1;
            if(checkX < grids[0].length && grids[y][checkX].getWarship().isPresent())  {
                return true;
            }
            //проверяем клетку левее
            checkX = x-1;
            if(checkX >=0 && grids[y][checkX].getWarship().isPresent()) {
                return true;
            }
            //если это первая клетка проверяем выше 3 клетки
            if(isFirst) {
                checkX = x-1;
                int checkY = y -1;
                if(checkY >=0 && checkX>=0 && grids[checkY][checkX].getWarship().isPresent()) {
                    return true;
                }
                checkX = x+1;
                if(checkY >=0 && checkX < grids[0].length && grids[checkY][checkX].getWarship().isPresent()) {
                    return true;
                }
                if(checkY >=0 && grids[checkY][x].getWarship().isPresent()) {
                    return true;
                }
            }
            //если это последняя клетка проверяем ниже 3 клетки
            if(isLast) {
                checkX = x-1;
                int checkY = y +1;
                if(checkY < grids.length  && checkX >=0 && grids[checkY][checkX].getWarship().isPresent()) {
                    return true;
                }
                checkX = x+1;
                if(checkY < grids.length && checkX < grids[0].length && grids[checkY][checkX].getWarship().isPresent()) {
                    return true;
                }
                if(checkY < grids.length && grids[checkY][x].getWarship().isPresent()) {
                    return true;
                }
            }
        }

        return false;
    }

    private int getRandom(int max, int min) {
        return rand.nextInt(max - min + 1) + min;
    }
}
