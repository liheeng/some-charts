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

export class Stock extends PlotDrawableElement<Konva.Group> {
    private readonly OHCLBarShape: Konva.Shape;
    private readonly fill: Color | Range<Color>;
    private readonly stroke: Color;
    private readonly lineWidth: number;
    private readonly stockDataWidth: number;

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
                fill: Color | Range<Color>,
                stroke: Color,
                lineWidth: number,
        stockDataWidth: number
    ) {
        let root = new Konva.Group();
        let boxCenter = Stock.calculateStockCenter(dataPoints);
        super(metricId, boxCenter, root);

        this.fill = fill;
        this.stroke = stroke;
        this.lineWidth = lineWidth
        this.stockDataWidth = stockDataWidth;


        this.relativeOpenY = new AnimatedProperty<number>(dataPoints[0].y - boxCenter.y);
        this.relativeCloseY = new AnimatedProperty<number>(dataPoints[3].y - boxCenter.y);
        this.relativeMinY = new AnimatedProperty<number>(Math.min(...dataPoints.map(p => p.y)) - boxCenter.y);
        this.relativeMaxY = new AnimatedProperty<number>(Math.max(...dataPoints.map(p => p.y)) - boxCenter.y);

        this.OHCLBarShape = new Konva.Shape({
            relativeOpenY: undefined,
            relativeCloseY: undefined,
            relativeHighY: undefined,
            relativeLowY: undefined,
            barWidth: undefined,
            sceneFunc: (context: Konva.Context, shape: Konva.Shape) => {
                context.save();

                context.setAttr('strokeStyle', this.stroke.toString());
                context.setAttr('lineWidth', this.lineWidth);
                context.setAttr('fillStyle', this.fill.toString());

                let barWidth = shape.getAttr('barWidth');
                let x = - barWidth / 2; // X position of the bar
                let open = shape.getAttr('relativeOpenY');
                let close = shape.getAttr('relativeCloseY');
                let max = shape.getAttr('relativeHighY');
                let min = shape.getAttr('relativeLowY');

                // Draw filled body (rectangle)
                context.beginPath();
                context.rect(x, close, barWidth, close - open); // y = top, height = difference
                context.fill();
                context.stroke(); // optional border around the bar

                // Draw wick lines (top and bottom)
                context.beginPath();
                if (max > Math.max(close, open)) {
                    context.moveTo(x, Math.max(close, open));  // high wick
                    context.lineTo(x, max); // to top of body
                }
                if (min < Math.min(close, open)) {
                    context.moveTo(x, Math.min(close, open));  // from bottom of body
                    context.lineTo(x, min);   // to low
                }
                context.stroke(); // draw both lines with strokeStyle

                context.restore();
            },
        });

        root.add(this.OHCLBarShape);
    }

    public setDataPoints(
        dataPoints: Array<NumericPoint>,
        animate: boolean = false,
        animationDuration: number = 0,
    ) {
        let boxCenter = Stock.calculateStockCenter(dataPoints)
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
            dataPoint.x - this.stockDataWidth / 2,
            visible,
            screen,
        );
        let stockWidthXMax = dataTransformation.getRelativeXValueLocationOnScreen(
            dataPoint,
            dataPoint.x + this.stockDataWidth / 2,
            visible,
            screen,
        );
        let barWidthOnScreen = stockWidthXMax - stockWidthXMin;

        this.OHCLBarShape.setAttrs({
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
        let minX = boxOrigin.x - this.stockDataWidth / 2;
        let maxX = boxOrigin.x + this.stockDataWidth / 2;
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
