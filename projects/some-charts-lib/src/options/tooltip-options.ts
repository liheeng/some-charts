import {
    MajorOptions,
    OptionsDefaults,
    SkinOptions,
} from './options-defaults';
import { Skin } from './skin';
import { TextOptions } from "./common/text-options";
import { FontUnits } from "../font/font-units";
import { Range } from '../geometry';
import { Color } from '../color';
export type DirectionType = 'up' | 'down' | 'left' | 'right';
export type LineJoin = 'round' | 'bevel' | 'miter';
// export type LineCap = 'butt' | 'round' | 'square';

export interface TooltipSkinOptions extends TextOptions, SkinOptions{
    opacity: number,
    fill: string | Range<Color>,
    stroke: string | Range<Color>,
    strokeWidth: 1,
    padding: number,

    pointerDirection: DirectionType,
    pointerWidth: number,
    pointerHeight: number,
    lineJoin: LineJoin,
    shadowColor: string,
    shadowBlur: number,
    shadowOffsetX: number,
    shadowOffsetY: number,
    shadowOpacity: number,
}

export interface TooltipMajorOptions extends MajorOptions {
    // Tooltip text to display.
    text: string,
    // Whether the tooltip is visible.
    visible: boolean,

    // Whether the tooltip is listening for mouse events.
    listening: boolean,
}

export interface TooltipOptions extends TooltipSkinOptions, TooltipMajorOptions {}

export class TooltipOptionsDefaults<
    TooltipOptionsType extends TooltipOptions,
> extends OptionsDefaults<
    TooltipSkinOptions,
    TooltipMajorOptions,
    TooltipOptionsType
> {
    protected constructor() {
        super();
    }

    majorOptions: TooltipMajorOptions = {
        text: '',
        visible: true,
        listening: false,
    } as TooltipMajorOptions;

    protected readonly skins: { [key: string]: TooltipSkinOptions } = {
        [Skin.Default]: {
            opacity: 1,
            fill: this.defaultSkinConsts.backgroundColor,
            stroke: this.defaultSkinConsts.outerBorderColor || this.defaultSkinConsts.foregroundColor,
            strokeWidth: 1,
            foregroundColor: this.defaultSkinConsts.foregroundColor,
            font: {
                size: 16,
                units: FontUnits.Points,
                family: this.defaultSkinConsts.fontFamily,
            },
            padding: 5,

            pointerDirection: 'down',
            pointerWidth: 10,
            pointerHeight: 10,
            lineJoin: 'round',
            shadowColor: this.defaultSkinConsts.backgroundColor,
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.5,
        } as TooltipSkinOptions,
        [Skin.Dark]: {
            opacity: 0.75,
            fill: this.darkSkinConsts.backgroundColor,
            stroke: this.darkSkinConsts.backgroundColor || this.defaultSkinConsts.foregroundColor,
            strokeWidth: 1,
            foregroundColor: this.darkSkinConsts.foregroundColor,
            font: {
                size: 16,
                units: FontUnits.Points,
                family: this.darkSkinConsts.fontFamily,
            },
            padding: 5,

            pointerDirection: 'down',
            pointerWidth: 10,
            pointerHeight: 10,
            lineJoin: 'round',
            shadowColor: this.darkSkinConsts.backgroundColor,
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.5,
        } as TooltipSkinOptions,
        [Skin.Light]: {
            opacity: 1,
            fill: this.defaultSkinConsts.backgroundColor,
            stroke: this.defaultSkinConsts.outerBorderColor || this.defaultSkinConsts.foregroundColor,
            strokeWidth: 1,
            foregroundColor: this.defaultSkinConsts.foregroundColor,
            font: {
                size: 16,
                units: FontUnits.Points,
                family: this.defaultSkinConsts.fontFamily,
            },
            padding: 5,

            pointerDirection: 'down',
            pointerWidth: 10,
            pointerHeight: 10,
            lineJoin: 'round',
            shadowColor: this.defaultSkinConsts.backgroundColor,
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.5,
        } as TooltipSkinOptions,
    };

    public static readonly Instance = new TooltipOptionsDefaults();

    public static extendWith(
        options: TooltipOptions | undefined,
        skin: Skin = Skin.Default): TooltipOptions {
    
        const opts = TooltipOptionsDefaults.Instance.extendWith(
                options,
                skin,
            ) as TooltipOptions;
        
        return opts? opts : {} as TooltipOptions;
    }
}
