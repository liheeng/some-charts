import { PlotOptions } from '../plot-options';
import { PlotKind } from '../plot-kind';
import { Palette } from '../../../chart/plots';
import { MetricOptions } from '../metric-options';
import { Skin } from '../../skin';
import { cloneDeep } from 'lodash-es';
import { AnimationOptions } from '../../common';
import {
    MajorOptions,
    OptionsDefaults,
    SkinOptions,
} from '../../options-defaults';
import { Color } from '../../../color';
import * as ColorObj from 'color';
import { Range } from '../../../geometry';

/**
 * Stock plot options
 * */
export interface CandlestickPlotOptions extends CandlestickPlotMajorOptions, CandlestickPlotSkin {}

export interface CandlestickPlotMajorOptions extends PlotOptions, MajorOptions {
    /*
     * Stock plot metric with its color.
     * */
    metric: MetricOptions<Color | Palette>;
}

export interface CandlestickPlotSkin extends SkinOptions {
    /**
     * Width of plot lines in pixels.
     **/
    lineWidth?: number;

    /**
     * Color of plot stroke lines.
     **/
    stroke?: Color;

    /**
     * Fill color of the candles.
     **/
    fill?: Color | Range<Color>;
}

export class CandlestickPlotOptionsDefaults extends OptionsDefaults<
    CandlestickPlotSkin,
    CandlestickPlotMajorOptions,
    CandlestickPlotOptions
> {
    private constructor() {
        super();
    }

    protected readonly skins: { [key: string]: CandlestickPlotSkin } = {
        [Skin.Default]: {
            lineWidth: 1,
            stroke: new ColorObj(this.defaultSkinConsts.foregroundColor)
                .darken(1.5)
                .hex() as Color,
            fill: new ColorObj(this.defaultSkinConsts.foregroundColor)
                .darken(1.5)
                .hex() as Color
        },
        [Skin.Dark]: {
            lineWidth: 2,
            stroke: this.darkSkinConsts.foregroundColor,
            fill: this.darkSkinConsts.foregroundColor,
        },
    };

    protected readonly majorOptions: CandlestickPlotMajorOptions = {
        kind: PlotKind.Box,
        metric: {
            id: '',
            caption: '',
            color: '#CF2734',
        },
        animate: AnimationOptions.animate,
        animationDuration: AnimationOptions.animationDuration,
    };

    public static readonly Instance = new CandlestickPlotOptionsDefaults();
}
