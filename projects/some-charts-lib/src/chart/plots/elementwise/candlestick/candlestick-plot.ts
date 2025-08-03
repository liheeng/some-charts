import merge from 'lodash-es/merge';
import {
    CandlestickPlotOptions,
    CandlestickPlotOptionsClass,
    CandlestickPlotOptionsDefaults,
    PlotOptionsClassFactory,
} from '../../../../options';
import { DataSet, DimensionValue } from '../../../../data';
import { DataTransformation, NumericPoint } from '../../../../geometry';
import { PlotDrawableElement } from '../plot-drawable-element';
import { Candlestick } from './candlestick';
import { cloneDeep, uniq } from 'lodash-es';
import { ElementwisePlot } from '../elementwise-plot';
import { PlotErrorBuilder } from '../../plot-error-builder';

export class CandlestickPlot<
    TItemType,
    XDimensionType extends number | Date,
    YDimensionType extends number | undefined = undefined,
> extends ElementwisePlot<
    CandlestickPlotOptions,
    CandlestickPlotOptionsClass,
    TItemType,
    XDimensionType,
    YDimensionType
> {
    private candlestickWidth: number = 0;

    constructor(
        dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
        dataTransformation: DataTransformation,
        options: CandlestickPlotOptions,
        protected plotErrorBuilder: PlotErrorBuilder = PlotErrorBuilder.Instance,
    ) {
        super(dataSet, dataTransformation, options);

        this.plotOptions = PlotOptionsClassFactory.buildPlotOptionsClass(
            merge(cloneDeep(CandlestickPlotOptionsDefaults.Instance), options),
        ) as CandlestickPlotOptionsClass;
    }

    override reinitOnDataSetUpdate() {
        let avgXDelta = this.getAvgXDelta(this.plotOptions.metric.id) ?? 0;
        this.candlestickWidth = avgXDelta / 2.5;
    }

    protected add1DPlotElements(
        xDimVal: DimensionValue<XDimensionType>,
    ): [PlotDrawableElement] {
        let metricId = this.plotOptions.metric.id;

        // let boxColor = this.getColor(this.plotOptions.metric.color, xDimVal);
        let metricValue = this.dataSet.getArrayMetricValue(
            metricId,
            xDimVal.value,
        )!;

        let points = metricValue.map(
            (y) => new NumericPoint(xDimVal.toNumericValue(), y),
        );
        return [
            new Candlestick(
                metricId,
                points,
                this.plotOptions.stroke,
                this.plotOptions.lineWidth,
                this.plotOptions.fill,
                this.candlestickWidth,
            ),
        ];
    }

    protected add2DPlotElements(
        xDimVal: DimensionValue<XDimensionType>,
        yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>,
    ): [PlotDrawableElement] {
        throw this.plotErrorBuilder.buildPlotDoesntSupport2DRendering(
            this.plotOptions.kind,
        );
    }

    protected update1DPlotElement(
        plotElt: PlotDrawableElement,
        xDimVal: DimensionValue<XDimensionType>,
    ) {
        let metricId = this.plotOptions.metric.id;

        // let boxColor = this.getColor(this.plotOptions.metric.color, xDimVal);
        let metricValue = this.dataSet.getArrayMetricValue(
            metricId,
            xDimVal.value,
        );
        let points = metricValue?.map(
            (y) => new NumericPoint(xDimVal.toNumericValue(), y),
        );

        let candlestick = plotElt as Candlestick;
        if (candlestick && points) {
            candlestick.setDataPoints(
                points,
                this.plotOptions.animate,
                this.plotOptions.animationDuration,
            );
        }
    }

    protected update2DPlotElement(
        plotElt: PlotDrawableElement,
        xDimVal: DimensionValue<XDimensionType>,
        yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>,
    ) {
        throw this.plotErrorBuilder.buildPlotDoesntSupport2DRendering(
            this.plotOptions.kind,
        );
    }

    protected getAvgXDelta(metricId: string): number | undefined {
        let allXValues = uniq(
            this.getArrayMetricPoints1D(metricId)
                ?.flatMap((p) => p.map((pI) => pI.x))
                .sort((l, r) => l - r),
        );

        if (allXValues) {
            let sumXDelta = 0;
            for (let i = 0; i < allXValues.length - 1; i++) {
                sumXDelta += allXValues[i + 1] - allXValues[i];
            }

            return sumXDelta / (allXValues.length - 1);
        } else return undefined;
    }
}
