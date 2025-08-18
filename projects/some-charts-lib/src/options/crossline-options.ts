import {
    MajorOptions,
    OptionsDefaults,
    SkinOptions,
} from './options-defaults';
import { Skin } from './skin';
import { Range } from '../geometry';
import { Color } from '../color';
import { LineCap, LineJoin } from 'konva/lib/Shape';

export interface CrosslineSkinOptions extends SkinOptions{
    opacity: number;
    // Stroke color of the crossline
    stroke: Color;

    // Stroke width of the crossline
    strokeWidth: number;

    // Line cap style of the crossline
    lineCap: LineCap;

    // Line join style of the crossline
    lineJoin: LineJoin;

    // // Tension of the crossline
    // tension: number;

    // // Whether the crossline is a bezier curve
    // bezier: boolean;

    // Dash pattern of the crossline, two values, first value is length of dash in point, second value is length of gap in point.
    dash: number[];
}

export interface CrosslineMajorOptions extends MajorOptions {
    // Whether the crossline is visible
    visible: boolean;

    // Whether vertical crossline is enabled
    enabledVertical: boolean;

    // Whether horizontal crossline is enabled
    enabledHorizontal: boolean;
}

export interface CrosslineOptions extends CrosslineSkinOptions, CrosslineMajorOptions {}

export class CrosslineOptionsDefaults<
    CrosslineOptionsType extends CrosslineOptions,
> extends OptionsDefaults<
    CrosslineSkinOptions,
    CrosslineMajorOptions,
    CrosslineOptionsType
> {
    protected constructor() {
        super();
    }

    majorOptions: CrosslineMajorOptions = {
        visible: true,  
        enabledVertical: true,
        enabledHorizontal: true,
    } as CrosslineMajorOptions;

    protected readonly skins: { [key: string]: CrosslineSkinOptions } = {
        [Skin.Default]: {
            opacity: 0.75,
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'butt',
            lineJoin: 'miter',
            dash: [5, 5],
        } as CrosslineSkinOptions,  
        [Skin.Dark]: {
            opacity: 0.75,
            stroke: 'white',
            strokeWidth: 1,
            lineCap: 'butt',
            lineJoin: 'miter',
            dash: [5, 5],
        } as CrosslineSkinOptions,
        [Skin.Light]: {
            opacity: 0.75,
            stroke: 'black',
            strokeWidth: 1,
            lineCap: 'butt',
            lineJoin: 'miter',
            dash: [5, 5],
        } as CrosslineSkinOptions
    };

    public static readonly Instance = new CrosslineOptionsDefaults();

    public static extendWith(
        options: CrosslineOptions | undefined,
        skin: Skin = Skin.Default): CrosslineOptions {
    
        const opts = CrosslineOptionsDefaults.Instance.extendWith(
                options,
                skin,
            ) as CrosslineOptions;
        
        return opts? opts : {} as CrosslineOptions;
    }
}
