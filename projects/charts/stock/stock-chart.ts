
import { Skin } from "../../some-charts-lib/src/options/skin";
import { XY } from "../../some-charts-demo/src/app/candlestick-demo/model/x-y";
import { AxisTypes } from "../../some-charts-lib/src/chart/axis";
import { Chart } from "../../some-charts-lib/src/chart/chart";
import { DataSet } from "../../some-charts-lib/src/data/data-set";
import { ChartOptions } from "../../some-charts-lib/src/options/chart-options";
import { CandlestickPlotOptions } from "../../some-charts-lib/src/options/plot/candlestick/candlestick-plot-options";
import { Margin } from "../../some-charts-lib/src/geometry/margin";
import { PlotKind } from "../../some-charts-lib/src/options/plot/plot-kind";
import { TooltipOptions, TooltipOptionsDefaults } from "../../some-charts-lib/src/options/tooltip-options";
import { Tooltip } from "../../some-charts-lib/src/components/tooltip/tooltip";
import Konva from 'konva'
import { InteractiveOptions } from "projects/some-charts-lib/src/options/interactive-options";
import { CrossLine } from "projects/some-charts-lib/src/components/crossline/crossline";
import { CrosslineOptionsDefaults } from "projects/some-charts-lib/src/options/crossline-options";
import { NumericDataRect } from "projects/some-charts-lib/src";

export const StockChartOptions = {
    skin: Skin.Light,
    navigation: {
        isFitToViewModeEnabled: true,
        relativePadding: new Margin(0, 0.1, 0, 0.1),
    },
    header: {
        text: 'Candlestick Plot',
    },
    plots: [
        {
            kind: PlotKind.Candlestick,
            metric: {
                id: 'y',
                caption: 'Price',
                color: '#D24E4D'
            }
        } as CandlestickPlotOptions,
    ],
    axes: {
        horizontal: {
            axisType: AxisTypes.LabeledAxis,
        },
        vertical: {
            axisType: AxisTypes.NumericAxis,
        },
    },
};

export const INTERACTIVE_LAYER_ID = 'interactive-layer';
export const INTERACTIVE_LAYER_CLASSNAME = 'interactive-layer';
export class StockChart extends Chart<XY, string> {
    protected tooltip?: Tooltip;

    protected crossline?: CrossLine;

    protected interactiveLayer?: Konva.Layer;

    constructor(containerID: string, dataSet: DataSet<XY, string>, options: ChartOptions= StockChartOptions) {
        super(containerID, dataSet, options);  
        this.init(options);
    }
    
    protected init(options: ChartOptions): void {
        this.interactiveLayer = this.createInteractiveLayer(options);  
        this.initTooltip(options.interactive);
        this.initCrossline(options.interactive);
    }

    protected createInteractiveLayer(options: ChartOptions) : Konva.Layer | undefined {
        return this.createLayer({ id: INTERACTIVE_LAYER_ID, className: INTERACTIVE_LAYER_CLASSNAME});
    }

    protected initCrossline(interactiveOpts?: InteractiveOptions): void {
        // Override to customize crossline initialization if needed
        if (!interactiveOpts || interactiveOpts.enableCrossline !== true) {
            return;
        }

        const crossline = new CrossLine(interactiveOpts.crossline? interactiveOpts.crossline
            : CrosslineOptionsDefaults.Instance.extendWith(undefined)
        );
        this.crossline = crossline;
        this.interactiveLayer?.add(this.crossline);

        this.onEventCallback('mousemove', (evt) => {
                const mousePos = this.renderer.getStage().getPointerPosition();
                const gridRect = this.screenRect;
                if (mousePos && gridRect && 
                    mousePos.x > gridRect.minX && 
                    mousePos.y > gridRect.minY && 
                    mousePos.x < gridRect.maxX && 
                    mousePos.y < gridRect.maxY) {
                    this.crossline?.showAt(mousePos, gridRect);
                    return
                } else {
                    this.crossline?.hide();
                }
        });
        this.onEventCallback('mouseout', (evt) => {
            this.crossline?.hide();
        });
    }

    protected initTooltip(interactiveOpts?: InteractiveOptions): void {
        // Override to customize tooltip initialization if needed
        if (!interactiveOpts || interactiveOpts.enableTooltip !== true) {
            return;
        }
        
        const tooltip = new Tooltip(interactiveOpts.tooltip? interactiveOpts.tooltip 
                : TooltipOptionsDefaults.Instance.extendWith(undefined));
        this.tooltip = tooltip;
        this.interactiveLayer?.add(this.tooltip);

        this.onEventCallback('mousemove', (evt) => {
            const shape = evt.target;
            if (shape && shape.name() === 'candlestick-y') {  // only change opacity if it's a candlestick-y shape
                const mousePos = this.renderer.getStage().getPointerPosition();
                if (!mousePos) {
                    return;
                }
                const x = mousePos.x;
                const y = mousePos.y - 5;
                const dataPoints = shape.getAttr('dataPoints');
                const text = `open:  ${dataPoints[0].y}\nhigh:  ${dataPoints[1].y}\nlow:   ${dataPoints[2].y}\nclose: ${dataPoints[3].y}`;
                tooltip.showAt(x, y, text);
                
            } else {
                tooltip.hide();
            }
        });
        this.onEventCallback('mouseout', (evt) => {
            this.tooltip?.hide();
        });
    }
}