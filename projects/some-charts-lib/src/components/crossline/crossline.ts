import Konva from 'konva';
import { CrosslineOptions, CrosslineOptionsDefaults } from '../../options/crossline-options';
import { Point } from '../../geometry/point';
import { NumericDataRect } from '../../geometry';

export class CrossLine extends Konva.Group {

    protected verticalLine: Konva.Line;
    protected horizontalLine: Konva.Line;

    constructor(options: CrosslineOptions) {
        super({
            opacity: options.opacity,
            visible: options.visible,
            listening: false,
        });

        this.verticalLine = new Konva.Line({
            ...options,
            visible: options.enabledVertical,
        });

        this.horizontalLine = new Konva.Line({
            ...options,
            visible: options.enabledHorizontal,
        });

        this.add(this.verticalLine);
        this.add(this.horizontalLine);
    }

    public updateVerticalLine(x: number, y1: number, y2: number, visibleVertical: boolean=true) {
        this.verticalLine.points([x, y1, x, y2]);
        this.verticalLine.visible(visibleVertical);
    }

    public updateHorizontalLine(y: number, x1: number, x2: number, visibleHorizontal: boolean=true) {
        this.horizontalLine.points([x1, y, x2, y]);
        this.horizontalLine.visible(visibleHorizontal);
    }

    /**
     * Update the position of the crosshair lines.
     * @param {Point<number>}crossPoint The current position of the crosshair.
     * @param {NumericDataRect}dataRect The bounding box of the data area.
     */
    public updateLines(crossPoint: Point<number>, dataRect: NumericDataRect, visible: boolean=true) {
        const x = crossPoint.x;
        const y = crossPoint.y;

        this.updateVerticalLine(x, dataRect.minY, dataRect.maxY, visible);
        this.updateHorizontalLine(y, dataRect.minX, dataRect.maxX, visible);
    }

    public showAt(crossPoint: Point<number>, dataRect: NumericDataRect) {
        this.updateLines(crossPoint, dataRect);
        this.show();
    }

    public enableVerticalLine(enabled: boolean) {
        this.verticalLine.visible(enabled);
    }

    public enableHorizontalLine(enabled: boolean) {
        this.horizontalLine.visible(enabled);
    }
}