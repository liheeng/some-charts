import { GridOptions, GridOptionsDefaults } from './grid-options';
import { HeaderOptions, HeaderOptionsDefaults } from './header-options';
import { LegendOptions, LegendOptionsDefaults } from './legend-options';
import { RendererOptions, RendererOptionsDefaults } from './renderer-options';
import { AxesOptions, AxesOptionsDefaults } from './axes';
import { PlotOptions, PlotOptionsDefaults } from './plot';
import { NavigationOptions, NavigationOptionsDefaults } from './navigation';
import { cloneDeep } from 'lodash-es';
import { Skin } from './skin';
import { InteractiveOptions, InteractiveOptionsDefaults } from './interactive-options';

export interface ChartOptions {
    /**
     * Chart skin.
     */
    skin?: Skin;
    /**
     * Chart navigation options.
     */
    navigation?: NavigationOptions;
    /**
     *  Chart axes options
     */
    axes?: AxesOptions;
    /**
     *  Chart grid options
     */
    grid?: GridOptions;
    /**
     *  Chart header options
     */
    header?: HeaderOptions;
    /**
     *  Chart legend options
     */
    legend?: LegendOptions;
    /**
     *  Chart's plots options
     */
    plots?: Array<PlotOptions>;
    /**
     *  Chart renderer options
     */
    renderer?: RendererOptions;

    interactive?: InteractiveOptions;
}

export class ChartOptionsDefaults {
    public static extendWith(options: ChartOptions): ChartOptions {
        let skin = options.skin ?? Skin.Default;

        return {
            header: HeaderOptionsDefaults.Instance.extendWith(
                options.header,
                skin,
            ),
            navigation: {
                ...cloneDeep(NavigationOptionsDefaults.Instance),
                ...cloneDeep(options.navigation),
            },
            renderer: RendererOptionsDefaults.Instance.extendWith(
                options.renderer,
                skin,
            ),
            axes: AxesOptionsDefaults.extendWith(options.axes, skin),
            grid: GridOptionsDefaults.Instance.extendWith(options.grid, skin),
            legend: LegendOptionsDefaults.Instance.extendWith(
                options.legend,
                skin,
            ),
            plots:
                options.plots?.map((plotOptions) =>
                    PlotOptionsDefaults.extendWith(plotOptions, skin),
                ) ?? [],
            interactive: InteractiveOptionsDefaults.extendWith(options.interactive, skin),
        } as ChartOptions;
    }
}
