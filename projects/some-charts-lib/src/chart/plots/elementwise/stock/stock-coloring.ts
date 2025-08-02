import { Range } from '../../../../geometry';
import { Color } from '../../../../color';

export class StockStyle {
    readonly fillGradient: Range<Color>;
    readonly stroke: Color;
    readonly lineWidth: number;

    /**
     * Represents set of color, used for coloring bars.
     * @param {Range<Color>} fillGradient - Fill gradient range
     * @param {Color} stroke - Stroke color
     * */
    constructor(fillGradient: Range<Color>, stroke: Color, lineWidth?: number) {
        this.fillGradient = fillGradient;
        this.stroke = stroke;
        this.lineWidth = lineWidth ?? 1;
    }
}
