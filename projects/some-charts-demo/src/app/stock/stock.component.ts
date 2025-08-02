import { Component, OnInit } from '@angular/core';
import {
    AxisTypes,
    BarsPlotOptions,
    Chart,
    DataSet,
    Margin,
    PlotKind,
    Skin,
    Sorting,
} from '../../../../some-charts-lib/src';
import { XY } from './model/x-y';
import { MathHelperService } from '../services/math-helper.service';

@Component({
    selector: 'stock-demo',
    templateUrl: './stock-demo.component.html',
})
export class StockAxisComponent implements OnInit {
    constructor(private mathHelperService: MathHelperService) { }

    ngOnInit(): void {
        let dataSet = new DataSet<XY, number | Date>(
            [
                {
                    x: new Date(2023, 0, 1),
                    y: [10, 15, 5, 12],
                },
                {
                    x: new Date(2023, 0, 2),
                    y: [20, 25, 15, 18],
                },
                {
                    x: new Date(2023, 0, 3),
                    y: [30, 35, 25, 28],
                },
                {
                    x: new Date(2023, 0, 4),
                    y: [15, 20, 10, 12],
                },
            ],
            {
                y: {
                    func: (item) => {
                        return item.y;
                    },
                    isArray: true,
                },
            },
            (item) => {
                return item.x;
            },
            undefined,
            Sorting.None,
        );

        // const updateDataSet = () => {
        //     dataSet.update([
        //         {
        //             x: new Date(2023, 0, 1),
        //             y1: this.mathHelperService.getRandomInt(8, 12),
        //             y2: this.mathHelperService.getRandomInt(15, 20),
        //         },
        //         {
        //             x: new Date(2023, 0, 2),
        //             y1: this.mathHelperService.getRandomInt(8, 12),
        //             y2: this.mathHelperService.getRandomInt(15, 20),
        //         },
        //         {
        //             x: new Date(2023, 0, 3),
        //             y1: this.mathHelperService.getRandomInt(8, 12),
        //             y2: this.mathHelperService.getRandomInt(15, 20),
        //         },
        //         {
        //             x: new Date(2023, 0, 4),
        //             y1: this.mathHelperService.getRandomInt(8, 12),
        //             y2: this.mathHelperService.getRandomInt(15, 20),
        //         },
        //     ]);
        //     setTimeout(updateDataSet, 4000);
        // };

        // setTimeout(updateDataSet, 4000);

        let chart = new Chart<XY, string>('#chart-element', dataSet, {
            skin: Skin.Light,
            navigation: {
                isFitToViewModeEnabled: true,
                relativePadding: new Margin(0, 0.1, 0, 0.1),
            },
            header: {
                text: 'Stock Plot',
            },
            plots: [
                {
                    kind: PlotKind.Bars,
                    metrics: [
                        {
                            id: 'y',
                            caption: 'Price',
                            color: '#D24E4D',
                        }
                    ],
                    animate: true,
                } as BarsPlotOptions,
            ],
            axes: {
                horizontal: {
                    axisType: AxisTypes.DateAxis,
                },
                vertical: {
                    axisType: AxisTypes.NumericAxis,
                },
            },
        });
    }
}
