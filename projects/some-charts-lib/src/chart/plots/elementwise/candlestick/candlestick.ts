import { PlotDrawableElement } from '../plot-drawable-element';
import Konva from 'konva';
import {
    NumericDataRect,
    DataTransformation,
    NumericPoint,
} from '../../../../geometry';
import { AnimatedProperty } from '../../animated-property';
import { Color } from '../../../../color';
import { Range } from '../../../../geometry';

export class Candlestick extends PlotDrawableElement<Konva.Group> {
    private readonly CandlestickShape: Konva.Shape;
    private readonly fill: Color | Range<Color>;
    private readonly stroke: Color;
    private readonly lineWidth: number;
    private readonly candleWidth: number;

    private readonly relativeMinY: AnimatedProperty<number>;
    private readonly relativeMaxY: AnimatedProperty<number>;

    private readonly relativeOpenY: AnimatedProperty<number> = new AnimatedProperty(0);
    private readonly relativeCloseY: AnimatedProperty<number> = new AnimatedProperty(0);

    override get animatedProperties(): Array<AnimatedProperty<any>> {
        return [...super.animatedProperties,
        this.relativeMinY,
        this.relativeMaxY,
        this.relativeOpenY,
        this.relativeCloseY];
    }

    constructor(
        metricId: string,
        dataPoints: Array<NumericPoint>,
        stroke: Color,
        lineWidth: number,
        fill: Color | Range<Color>,
        candleWidth: number
    ) {
        let root = new Konva.Group();
        let boxCenter = Candlestick.calculateStockCenter(dataPoints);
        super(metricId, boxCenter, root);

        this.fill = fill;
        this.stroke = stroke;
        this.lineWidth = lineWidth
        this.candleWidth = candleWidth;

        this.relativeOpenY = new AnimatedProperty<number>(dataPoints[0].y - boxCenter.y);
        this.relativeCloseY = new AnimatedProperty<number>(dataPoints[3].y - boxCenter.y);
        this.relativeMinY = new AnimatedProperty<number>(Math.min(...dataPoints.map(p => p.y)) - boxCenter.y);
        this.relativeMaxY = new AnimatedProperty<number>(Math.max(...dataPoints.map(p => p.y)) - boxCenter.y);

        this.CandlestickShape = new Konva.Shape({
            relativeOpenY: undefined,
            relativeCloseY: undefined,
            relativeHighY: undefined,
            relativeLowY: undefined,
            candleWidth: undefined,
            sceneFunc: (context: Konva.Context, shape: Konva.Shape) => {
                context.save();

                context.setAttr('strokeStyle', this.stroke.toString());
                context.setAttr('lineWidth', this.lineWidth);
                context.setAttr('fillStyle', this.fill.toString());

                // NOTE: the values of open, close, max, min may be negative, because
                // the coordinates in local shape are relative to left/bottom corner
                // so the negative coordinates is greater than positive coordinates.
                let barWidth = shape.getAttr('barWidth');
                let x = - barWidth / 2; // X position of the bar
                let openCoord = shape.getAttr('relativeOpenY');
                let closeCoord = shape.getAttr('relativeCloseY');
                let maxCoord = shape.getAttr('relativeHighY');
                let minCoord = shape.getAttr('relativeLowY');

                console.debug('open:', openCoord, 'close:', closeCoord, 'max:', maxCoord, 'min:', minCoord, 'barWidth:', barWidth);

                // Draw filled body (rectangle)
                context.beginPath();
                context.rect(x, openCoord, barWidth, closeCoord - openCoord); // y = top, height = difference
                context.fill();
                context.stroke(); // optional border around the bar

                // Draw wick lines (top and bottom)
                context.beginPath();
                // NOTE: since the coordinates in local shape are relative to left/bottom corner,
                // below if statements use oposite compare to check min/max
                // draw top wick
                if (maxCoord < Math.min(openCoord, closeCoord)) {
                    context.moveTo(0, maxCoord);
                    context.lineTo(0, Math.min(openCoord, closeCoord));
                }
                // draw bottom wick
                if (minCoord > Math.max(closeCoord, openCoord)) {
                    context.moveTo(0, minCoord);  
                    context.lineTo(0, Math.max(openCoord, closeCoord));  
                }
                context.stroke(); // draw both lines with strokeStyle

                context.restore();
            },
        });

        root.add(this.CandlestickShape);
    }

    public setDataPoints(
        dataPoints: Array<NumericPoint>,
        animate: boolean = false,
        animationDuration: number = 0,
    ) {
        let boxCenter = Candlestick.calculateStockCenter(dataPoints)
        this.dataPoint.setValue(boxCenter, animate, animationDuration);
        this.relativeOpenY.setValue(dataPoints[0].y - boxCenter.y, animate, animationDuration);
        this.relativeCloseY.setValue(dataPoints[3].y - boxCenter.y, animate, animationDuration);
        this.relativeMinY.setValue(Math.min(...dataPoints.map(p => p.y)) - boxCenter.y, animate, animationDuration);
        this.relativeMaxY.setValue(Math.max(...dataPoints.map(p => p.y)) - boxCenter.y, animate, animationDuration);
    }

    override updateShapesForAnimationFrame(
        dataPoint: NumericPoint,
        dataTransformation: DataTransformation,
        visible: NumericDataRect,
        screen: NumericDataRect,
    ) {
        let relativeOpenY = this.relativeOpenY.displayedValue;
        let relativeCloseY = this.relativeCloseY.displayedValue;
        let relativeHighY = this.relativeMaxY.displayedValue;
        let relativeLowY = this.relativeMinY.displayedValue;

        let relativeOpenYOnScreen =
            dataTransformation.getRelativeYValueLocationOnScreen(
                dataPoint,
                relativeOpenY,
                visible,
                screen,
            );
        let relativeCloseYOnScreen =
            dataTransformation.getRelativeYValueLocationOnScreen(
                dataPoint,
                relativeCloseY,
                visible,
                screen,
            );
        let relativeHighYOnScreen =
            dataTransformation.getRelativeYValueLocationOnScreen(
                dataPoint,
                relativeHighY,
                visible,
                screen,
            );
        let relativeLowYOnScreen =
            dataTransformation.getRelativeYValueLocationOnScreen(
                dataPoint,
                relativeLowY,
                visible,
                screen,
            );

        let stockWidthXMin = dataTransformation.getRelativeXValueLocationOnScreen(
            dataPoint,
            dataPoint.x - this.candleWidth / 2,
            visible,
            screen,
        );
        let stockWidthXMax = dataTransformation.getRelativeXValueLocationOnScreen(
            dataPoint,
            dataPoint.x + this.candleWidth / 2,
            visible,
            screen,
        );
        let barWidthOnScreen = stockWidthXMax - stockWidthXMin;

        this.CandlestickShape.setAttrs({
            relativeOpenY: relativeOpenYOnScreen,
            relativeCloseY: relativeCloseYOnScreen,
            relativeHighY: relativeHighYOnScreen,
            relativeLowY: relativeLowYOnScreen,
            barWidth: barWidthOnScreen,
        });
    }

    override getBoundingRectangle(): NumericDataRect {
        let boxOrigin = this.dataPoint.displayedValue;

        let minY = this.relativeMinY.displayedValue + boxOrigin.y;
        let maxY = this.relativeMaxY.displayedValue + boxOrigin.y;
        let minX = boxOrigin.x - this.candleWidth / 2;
        let maxX = boxOrigin.x + this.candleWidth / 2;
        return new NumericDataRect(minX, maxX, minY, maxY);
    }

    private static calculateStockCenter(
        dataPoints: Array<NumericPoint>
    ): NumericPoint {
        let min = Math.min(...dataPoints.map(p => p.y));
        let max = Math.max(...dataPoints.map(p => p.y));
        let centerY = (max + min) / 2;
        let x = dataPoints[0].x;

        return new NumericPoint(x, centerY);
    }
}
