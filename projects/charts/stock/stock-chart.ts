
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
                color: '#D24E4D',
            },
            fill: '#D24E4D',
            animate: false,
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

    protected interactiveLayer?: Konva.Layer;

    constructor(containerID: string, dataSet: DataSet<XY, string>, options: ChartOptions= StockChartOptions) {
        super(containerID, dataSet, options);  
        this.init(options);
    }
    
    protected init(options: ChartOptions): void {
        this.interactiveLayer = this.createInteractiveLayer(options);  
        this.initTooltip(options.interactive);
    }

    protected createInteractiveLayer(options: ChartOptions) : Konva.Layer | undefined {
        return this.createLayer({ id: INTERACTIVE_LAYER_ID, className: INTERACTIVE_LAYER_CLASSNAME});
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
    }
}