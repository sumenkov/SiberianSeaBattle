import { CELL_SIZE } from "../game/GameValues";
import { ShipPositionOnBoard } from "../game/Ship";

export default (grid: number[][]) => {

    const shipAmount: Record<string, { i: number; j: number }[]> = {
        '1_1': [],
        '1_2': [],
        2: [],
        3: []
    }

    const result = {
        oneSegmented: [] as ShipPositionOnBoard[],
        secondOneSegmenteed: [] as ShipPositionOnBoard[],
        twoSegmented: [] as ShipPositionOnBoard[],
        threeSegmented: [] as ShipPositionOnBoard[],
        isTwoSegmentHorizontal: false,
        isThreeSegmentHorizontal: false
    }

    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
            const cell = row[j];

            if (cell === 1) {
                if (!shipAmount['1_1'].length) shipAmount['1_1'].push({ i, j })
                else shipAmount['1_2'].push({ i, j })
            }
            else if (shipAmount[cell]) {
                shipAmount[cell].push({ i, j })
            }

        }
    }

    result.oneSegmented = [{
        x: shipAmount['1_1'][0].i,
        y: shipAmount['1_1'][0].j,
        cellOffeset: {
            left: shipAmount['1_1'][0].j * CELL_SIZE,
            right: (shipAmount['1_1'][0].j * CELL_SIZE) + CELL_SIZE,
            top: shipAmount['1_1'][0].i * CELL_SIZE,
            bottom: (shipAmount['1_1'][0].i * CELL_SIZE) + CELL_SIZE,
        }
    }];

    result.secondOneSegmenteed = [{
        x: shipAmount['1_2'][0].i,
        y: shipAmount['1_2'][0].j,
        cellOffeset: {
            left: shipAmount['1_2'][0].j * CELL_SIZE,
            right: (shipAmount['1_2'][0].j * CELL_SIZE) + CELL_SIZE,
            top: shipAmount['1_2'][0].i * CELL_SIZE,
            bottom: (shipAmount['1_2'][0].i * CELL_SIZE) + CELL_SIZE,
        }
    }];

    result.isTwoSegmentHorizontal =
        shipAmount['2'].every((el) => el.i === shipAmount['2'][0].i)


    result.twoSegmented = [
        {
            x: shipAmount['2'][0].i,
            y: shipAmount['2'][0].j,
            cellOffeset: {
                left: shipAmount['2'][0].j * CELL_SIZE,
                right: (shipAmount['2'][0].j * CELL_SIZE) + CELL_SIZE,
                top: shipAmount['2'][0].i * CELL_SIZE,
                bottom: (shipAmount['2'][0].i * CELL_SIZE) + CELL_SIZE,
            }
        },
        {
            x: shipAmount['2'][1].i,
            y: shipAmount['2'][1].j,
            cellOffeset: {
                left: shipAmount['2'][1].j * CELL_SIZE,
                right: (shipAmount['2'][1].j * CELL_SIZE) + CELL_SIZE,
                top: shipAmount['2'][1].i * CELL_SIZE,
                bottom: (shipAmount['2'][1].i * CELL_SIZE) + CELL_SIZE,
            }
        }
    ];

    result.threeSegmented = [
        {
            x: shipAmount['3'][0].i,
            y: shipAmount['3'][0].j,
            cellOffeset: {
                left: shipAmount['3'][0].j * CELL_SIZE,
                right: (shipAmount['3'][0].j * CELL_SIZE) + CELL_SIZE,
                top: shipAmount['3'][0].i * CELL_SIZE,
                bottom: (shipAmount['3'][0].i * CELL_SIZE) + CELL_SIZE,
            }
        },
        {
            x: shipAmount['3'][1].i,
            y: shipAmount['3'][1].j,
            cellOffeset: {
                left: shipAmount['3'][1].j * CELL_SIZE,
                right: (shipAmount['3'][1].j * CELL_SIZE) + CELL_SIZE,
                top: shipAmount['3'][1].i * CELL_SIZE,
                bottom: (shipAmount['3'][1].i * CELL_SIZE) + CELL_SIZE,
            }
        },
        {
            x: shipAmount['3'][2].i,
            y: shipAmount['3'][2].j,
            cellOffeset: {
                left: shipAmount['3'][2].j * CELL_SIZE,
                right: (shipAmount['3'][2].j * CELL_SIZE) + CELL_SIZE,
                top: shipAmount['3'][2].i * CELL_SIZE,
                bottom: (shipAmount['3'][2].i * CELL_SIZE) + CELL_SIZE,
            }
        }
    ];


    result.isThreeSegmentHorizontal =
        shipAmount['3'].every((el) => el.i === shipAmount['3'][0].i);

    return result;
}

