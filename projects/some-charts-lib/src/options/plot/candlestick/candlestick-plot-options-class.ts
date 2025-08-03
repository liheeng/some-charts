import { Palette } from '../../../chart';
import { PlotOptionsClass } from '../plot-options-class';
import { MetricOptions } from '../metric-options';
import { CandlestickPlotOptions as CandlestickPlotOptions, CandlestickPlotOptionsDefaults as CandlestickPlotOptionsDefaults } from './candlestick-plot-options';
import { Skin } from '../../skin';
import { Color } from '../../../color';

/**
 * Marker plot options class
 */
export class CandlestickPlotOptionsClass
    extends PlotOptionsClass
    implements CandlestickPlotOptions
{
    public metric: MetricOptions<Color | Palette>;
    public lineWidth: number;
    public stroke: Color;

    constructor(stockPlotOptions: CandlestickPlotOptions) {
        super(stockPlotOptions);

        let defaultSkin = CandlestickPlotOptionsDefaults.Instance.defaultSkin;

        this.metric = stockPlotOptions.metric;
        this.lineWidth = stockPlotOptions.lineWidth ?? defaultSkin.lineWidth!;
        this.stroke = stockPlotOptions.stroke ?? defaultSkin.stroke!;
    }

    get metricsOptions(): Array<MetricOptions<Color | Palette>> {
        return [this.metric];
    }
}
