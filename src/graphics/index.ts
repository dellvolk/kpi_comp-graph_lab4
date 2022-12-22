import {stage} from './stage'
import Grid from './grid'
import Circle from './circle'
import {ICore, IFigurePoint, IPoint} from "./types";
import {LinePoint} from "./line";

const point = (x: number, y: number): IPoint => ({x, y})

type IActiveStatePoint = {
    figure: IFigurePoint // point a clicked
    // next: IFigurePoint // next b
    prev: IFigurePoint // prev b
} | undefined

type IMovementPoints = {
    distance: number
    p: IFigurePoint
    q: IFigurePoint
} | undefined

export default function (): ICore {

    const canvas = document.getElementById('stage') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.beginPath();

    // let is_mouse_down = false
    let activeStatePoint: IActiveStatePoint
    let movementPoints: IMovementPoints

    // let activePoint: IFigurePoint | undefined; // which move
    // let activePointOpposite: IFigurePoint | undefined; // which should move
    // let d_opposite: number | undefined

    const getMousePoint = (e: MouseEvent): IPoint => point((e.offsetX - stage.padding) / stage.px_per_sm, (stage.height - e.offsetY - stage.padding) / stage.px_per_sm)
    const distance = (a: IPoint, b: IPoint): number => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

    canvas.addEventListener('mousedown', e => {
        const figure_points = stage.figure_points
        if (!figure_points || figure_points?.length < 2) return void 0;

        const mouse = getMousePoint(e)

        // find state point (A)
        const figure_idx = figure_points.findIndex(({ax, ay, bx, by}) => distance(mouse, point(ax, ay)) < .2)

        if (figure_idx !== -1) {
            const prev = figure_idx === 0 ? figure_points[figure_points.length - 1] : figure_points[figure_idx - 1]
            activeStatePoint = {
                figure: figure_points[figure_idx],
                prev,
            }
            draw()
            return void 0;
        }

        if (!activeStatePoint) return void 0;

        const {prev, figure} = activeStatePoint

        const prev_b = point(prev.bx, prev.by)
        const next_b = point(figure.bx, figure.by)

        if (distance(mouse, prev_b) < .2) {
            movementPoints = {
                p: prev,
                q: figure,
                distance: distance(point(figure.bx, figure.by), point(figure.ax, figure.ay))
            }
        } else if (distance(mouse, next_b) < .2) {
            movementPoints = {
                p: figure,
                q: prev,
                distance: distance(point(prev.bx, prev.by), point(figure.ax, figure.ay))
            }
        }

        draw()
    })
    canvas.addEventListener('mouseup', e => {
        movementPoints = undefined
    })

    canvas.addEventListener('mousemove', e => {
        const mouse = getMousePoint(e)

        if (movementPoints && activeStatePoint) {
            const { p, q, distance: d} = movementPoints
            const { figure } = activeStatePoint
            const a = point(figure.ax, figure.ay)
            p.bx = mouse.x
            p.by = mouse.y

            console.log({d})

            const c = distance(point(mouse.x, mouse.y), point(figure.ax, figure.ay))

            q.by = ((d * (a.y - mouse.y)) / c) + a.y
            q.bx = ((d * (a.x - mouse.x)) / c) + a.x

            console.log({bx: q.bx, by: q.by})
            // q.bx = a.x - ((d * (a.x - mouse.x)) / c)

            requestAnimationFrame(draw)
        }

    })

    stage.ctx = ctx;

    const {height: HEIGHT, width: WIDTH} = stage

    canvas.width = WIDTH
    canvas.height = HEIGHT

    const grid = Grid(ctx)

    // @ts-ignore
    window.ctx = ctx

    stage.setTransformMatrix([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ])

    function drawPoints() {
        ctx.strokeStyle = 'blue' // pivot point
        Circle(stage.rotation.x, stage.rotation.y, .1)

        // ctx.strokeStyle = 'green' // active point
        // const {activePointIndex, figure: {a}} = stage;
        // const x = 2 * a * Math.cos(activePointIndex) * (1 + Math.cos(activePointIndex)),
        //     y = 2 * a * Math.sin(activePointIndex) * (1 + Math.cos(activePointIndex));
        // Circle(x, y, .1)

        ctx.strokeStyle = 'black'
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        grid.draw()

        ctx.beginPath()

        figure()

        ctx.closePath()

        stage.init = false;
    }

    const calculateArcPoint = (a: IPoint, b: IPoint, c: IPoint, wa: number, wb: number, wc: number, u: number): IPoint => {
        const divider = wa * Math.pow(1 - u, 2) + 2 * wb * u * (1 - u) + wc * Math.pow(u, 2)
        return point(
            (a.x * wa * Math.pow(1 - u, 2) + 2 * b.x * wb * u * (1 - u) + c.x * wc * Math.pow(u, 2)) / divider,
            (a.y * wa * Math.pow(1 - u, 2) + 2 * b.y * wb * u * (1 - u) + c.y * wc * Math.pow(u, 2)) / divider,
        )
    }

    function figure() {
        const figure_points = stage.figure_points

        if (!figure_points || figure_points?.length === 0) return void 0;

        // console.log('figure', stage.figure_points)
        // console.log(JSON.stringify(stage.figure_points))

        const f = .4
        const wa = 1;
        const wc = 1;

        // console.log({figure_points})

        figure_points?.forEach(({ax, ay, bx, by}, idx) => {
            const a = point(ax, ay)
            const b = point(bx, by)

            let c;
            if (idx + 1 === figure_points.length) {
                c = point(figure_points[0].ax, figure_points[0].ay)
                // return void 0;
            } else {
                c = point(figure_points[idx + 1].ax, figure_points[idx + 1].ay)
            }

            if (stage.showPoints) {

                // if (idx === 0) {
                //     ctx.strokeStyle = 'blue'
                //     Circle(ax, ay, .1)
                // }
                ctx.strokeStyle = activeStatePoint?.figure === figure_points[idx] ? 'red' : 'blue'
                Circle(ax, ay, .1)
                ctx.strokeStyle = 'green'
                Circle(bx, by, .1)
                // ctx.strokeStyle = 'blue'
                // Circle(c.x, c.y, .1)
                ctx.strokeStyle = 'black'
                LinePoint(a, b, 1)
                LinePoint(b, c, 1)
            }


            let wb = f / (1 - f)

            let prevPoint: IPoint | undefined;
            for (let u = 0; u <= 1.01; u += .05) {
                let p = calculateArcPoint(a, b, c, wa, wb, wc, u)
                if (prevPoint) {
                    LinePoint(prevPoint, p)
                }
                prevPoint = p;
            }
        })
    }

    function set(changed: string, value: number) {
        const [type, key] = changed.split('.')
        if (!key) {
            // @ts-ignore
            stage[changed] = value
            // draw()
            // return void 0;
        } else {
            // @ts-ignore
            stage[type][key] = value
        }

        // if (type === 'affine') {
        //
        //     let {xx, xy, yx, yy, ox, oy} = stage.affine
        //
        //     // xx /= stage.px_per_sm
        //     // xy /= stage.px_per_sm
        //     // yx /= stage.px_per_sm
        //     // yy /= stage.px_per_sm
        //     // ox *= stage.px_per_sm
        //     // oy *= stage.px_per_sm
        //
        //     // console.log([
        //     //     [xx, xy, 0],
        //     //     [yx, yy, 0],
        //     //     [ox, oy, 1],
        //     // ])
        //
        //     stage.setTransformMatrix([
        //         [xx, xy, 0],
        //         [yx, yy, 0],
        //         [ox, oy, 1],
        //     ])
        // } else if (type === 'projective') {
        //     let {xx, xy, yx, yy, ox, oy, wx, wy, wo} = stage.projective
        //
        //     // xx /= stage.px_per_sm
        //     // xy /= stage.px_per_sm
        //     // yx /= stage.px_per_sm
        //     // yy /= stage.px_per_sm
        //     // wx /= stage.px_per_sm * 100
        //     // wy /= stage.px_per_sm * 100
        //     // wo /= stage.px_per_sm
        //     // ox *= stage.px_per_sm
        //     // oy *= stage.px_per_sm
        //
        //     xx *= stage.px_per_sm
        //     xy *= stage.px_per_sm
        //     yx *= stage.px_per_sm
        //     yy *= stage.px_per_sm
        //
        //     ox *= stage.px_per_sm
        //     oy *= stage.px_per_sm
        //     // xx *= stage.px_per_sm
        //
        //     // console.log([
        //     //     [xx, xy, wx],
        //     //     [yx, yy, wy],
        //     //     [ox, oy, wo],
        //     // ])
        //
        //     stage.setTransformMatrix([
        //         [xx * wx, xy * wx, wx],
        //         [yx * wy, yy * wy, wy],
        //         [ox * wo, oy * wo, wo],
        //     ])
        // }

        // switch (type) {
        //     case 'shift':
        //
        //
        //         break;
        //     default:
        //         break;
        // }

        draw()

    }

    // draw()

    return {
        draw,
        set,
    }
}


