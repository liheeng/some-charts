import {
    SkinOptions,
} from './options-defaults';

import { TooltipOptions, TooltipOptionsDefaults } from "./tooltip-options";
import { Skin } from './skin';

export interface InteractiveOptions extends SkinOptions {
    // skin?: Skin;
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
            tooltip: TooltipOptionsDefaults.Instance.extendWith(
                options?.tooltip,
                skin,
            )
        } as InteractiveOptions;
    }
}