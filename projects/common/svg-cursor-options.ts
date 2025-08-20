import {
    MajorOptions,
    OptionsDefaults,
    SkinOptions,
} from '../some-charts-lib/src/options/options-defaults';
import { Skin }from '../some-charts-lib/src/options/skin';

export interface SvgCursorSkinOptions extends  SkinOptions {
    width: number;
    height: number;
    hotspotX: number;
    hotspotY: number;
    stroke: string;
    strokeWidth: number;
    fill?: string;
}

export interface SvgCursorMajorOptions extends MajorOptions {}

export interface SvgCursorOptions extends SvgCursorSkinOptions, SvgCursorMajorOptions {}

export class SvgCursorOptionsDefaults<
    SvgCursorOptionsType extends SvgCursorOptions,
> extends OptionsDefaults<
    SvgCursorSkinOptions,
    SvgCursorMajorOptions,
    SvgCursorOptionsType
> {
    protected constructor() {
        super();
    }

    majorOptions: SvgCursorMajorOptions = {} as SvgCursorMajorOptions;

    protected readonly skins: { [key: string]: SvgCursorSkinOptions } = {
        [Skin.Default]: {
            width: 16,
            height: 16,
            hotspotX: 8,
            hotspotY: 8,
            stroke: 'black',
            strokeWidth: 1,
            fill: 'none',
        },
        [Skin.Dark]: {
            width: 16,
            height: 16,
            hotspotX: 8,
            hotspotY: 8,
            stroke: 'white',
            strokeWidth: 1,
            fill: 'none',
        },
        [Skin.Light]: {
            width: 16,
            height: 16,
            hotspotX: 8,
            hotspotY: 8,
            stroke: 'black',
            strokeWidth: 1,
            fill: 'none',
        }
    };

    public static readonly Instance = new SvgCursorOptionsDefaults();
    
    public static extendWith(
        options: SvgCursorOptions | undefined,
        skin: Skin = Skin.Default): SvgCursorOptions {
    
        const opts = SvgCursorOptionsDefaults.Instance.extendWith(
                options,
                skin,
            ) as SvgCursorOptions;
        
        return opts? opts : {} as SvgCursorOptions;
    }
}