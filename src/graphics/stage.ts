import {IAffine, IFigurePoint, IPoint, IProjective, IRotation, ITransformMatrix} from "./types"


interface IStage {
    width: number
    height: number
    padding: number
    px_per_sm: number
    ox: (x: number) => number
    oy: (x: number) => number
    pos: (x: number, y: number, grid?: boolean) => [number, number]
    grid_width: number
    setTransformMatrix: (matrix: ITransformMatrix) => void
    transform: (matrix: ITransformMatrix) => (x: number, y: number) => [number, number]
    ctx: CanvasRenderingContext2D
    shift: IPoint
    rotation: IRotation
    affine: IAffine
    projective: IProjective,
    showPoints: boolean,
    figure_points: IFigurePoint[],
    init: boolean
    activePointIndex: number,
    isInflectionPoints: boolean
}

const INITIAL_A_PARAM = 2
// @ts-ignore
export var stage: IStage = {
    init: true,
    width: 1500,
    height: window.outerHeight - 235,
    padding: 20,
    px_per_sm: 25,
    grid_width: 1200,
    showPoints: true,
    activePointIndex: 0,
    figure_points: [
        {"ax":8.3,"ay":15,"bx":3.6,"by":29.3},{"ax":11,"ay":16,"bx":19,"by":23},{"ax":18.6,"ay":20,"bx":17,"by":18},{"ax":16.6,"ay":14.3,"bx":18,"by":14},
        {"ax":17.9,"ay":14,"bx":20.6,"by":18},{"ax":20.9,"ay":15.7,"bx":20.2,"by":15},{"ax":19.9,"ay":12.9,"bx":22,"by":12},{"ax":22.2,"ay":12.3,"bx":27.5,"by":13},
        {"ax":29,"ay":18.7,"bx":29,"by":14},{"ax":26.4,"ay":11.7,"bx":23,"by":7},{"ax":28,"ay":5,"bx":28,"by":4},{"ax":26.3,"ay":5,"bx":23.5,"by":7},{"ax":22.8,"ay":10,"bx":21,"by":10},
        {"ax":20.3,"ay":9.3,"bx":21.5,"by":5.5},{"ax":19,"ay":9,"bx":17,"by":9},{"ax":15,"ay":8.4,"bx":19,"by":-7},{"ax":11.8,"ay":7.4,"bx":3,"by":7},{"ax":2.1,"ay":11.4,"bx":2,"by":15}
    ],
    shift: {
        x: 0,
        y: 0,
    },
    rotation: {
        x: 0,
        y: 0,
        angle: 0,
    },
    affine: {
        xx: 1,
        xy: 0,
        yx: 0,
        yy: 1,
        ox: 0,
        oy: 0,
    },
    projective: {
        xx: 35,
        xy: 0,
        yy: 35,
        yx: 0,
        ox: 0,
        oy: 0,
        wx: 0,
        wy: 0,
        wo: 35
    }
}

stage.ox = (x: number) => stage.padding + x;
stage.oy = (y: number) => (stage.height) - y - stage.padding;

stage.pos = (x: number, y: number) => [stage.padding + x, stage.height - y - stage.padding]

stage.setTransformMatrix = (m: ITransformMatrix) => {
    stage.pos = (x: number, y: number, grid = false) => {

        if (!grid) {

            const rtx = stage.rotation.x * stage.px_per_sm;
            const rty = stage.rotation.y * stage.px_per_sm;

            [x, y] = stage.transform([ // rotation
                [Math.cos(stage.rotation.angle), Math.sin(stage.rotation.angle), 0],
                [-Math.sin(stage.rotation.angle), Math.cos(stage.rotation.angle), 0],
                [
                    -rtx * (Math.cos(stage.rotation.angle) - 1) + rty * Math.sin(stage.rotation.angle),
                    -rtx * Math.sin(stage.rotation.angle) - rty * (Math.cos(stage.rotation.angle) - 1),
                    1],
            ])(x, y);

            [x, y] = stage.transform([ // translate
                [1, 0, 0],
                [0, 1, 0],
                [stage.shift.x * stage.px_per_sm, stage.shift.y * stage.px_per_sm, 1],
            ])(x, y);

            // console.log({x, y, m})
        }

        return [
            stage.ox((x * m[0][0] + y * m[1][0] + m[2][0]) / (x * m[0][2] + y * m[1][2] + m[2][2])),
            stage.oy((x * m[0][1] + y * m[1][1] + m[2][1]) / (x * m[0][2] + y * m[1][2] + m[2][2])),
        ]
    }
}

stage.transform = (m: ITransformMatrix) => (x: number, y: number) => [
    ((x * m[0][0] + y * m[1][0] + m[2][0]) / (x * m[0][2] + y * m[1][2] + m[2][2])),
    ((x * m[0][1] + y * m[1][1] + m[2][1]) / (x * m[0][2] + y * m[1][2] + m[2][2])),
]


console.log(stage)
