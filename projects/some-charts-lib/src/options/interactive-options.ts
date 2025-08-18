import {
    SkinOptions,
} from './options-defaults';

import { CrosslineOptions, CrosslineOptionsDefaults } from "./crossline-options";
import { TooltipOptions, TooltipOptionsDefaults } from "./tooltip-options";
import { Skin } from './skin';

export interface InteractiveOptions extends SkinOptions {
    enableCrossline: boolean;

    crossline?: CrosslineOptions;

    enableTooltip: boolean;
    /**
     * Tooltip options for the chart.
     */
    tooltip?: TooltipOptions;
}

export class InteractiveOptionsDefaults {
    public static extendWith(
        options: InteractiveOptions | undefined,
        skin: Skin = Skin.Default): InteractiveOptions {
        
        return {
            enableCrossline: options?.enableCrossline ?? false,
            crossline: CrosslineOptionsDefaults.Instance.extendWith(
                options?.crossline,
                skin,
            ),
            enableTooltip: options?.enableTooltip ?? false,
            tooltip: TooltipOptionsDefaults.Instance.extendWith(
                options?.tooltip,
                skin,
            )
        } as InteractiveOptions;
    }
}