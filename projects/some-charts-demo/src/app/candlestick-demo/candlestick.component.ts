import { Component, OnInit } from '@angular/core';
import {
    AxisTypes,
    CandlestickPlotOptions,
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
    selector: 'candlestick-demo',
    templateUrl: './candlestick-demo.component.html',
})
export class CandlestickAxisComponent implements OnInit {
    constructor(private mathHelperService: MathHelperService) { }

    ngOnInit(): void {
        let dataSet = new DataSet<XY, string>(
            [
                {
                    x: new Date(2023, 1, 2),
                    y: [10, 15, 5, 12], // open, high, low, close
                },
                {
                    x: new Date(2023, 1, 5),
                    y: [20, 25, 15, 18], // open, high, low, close
                },
                {
                    x: new Date(2023, 1, 8),
                    y: [30, 35, 25, 28],
                },
                {
                    x: new Date(2023, 1, 10),
                    y: [15, 20, 10, 12],
                },
                {
                    x: new Date(2024, 1, 2),
                    y: [10, 15, 5, 12], // open, high, low, close
                },
                {
                    x: new Date(2024, 1, 5),
                    y: [20, 25, 15, 18], // open, high, low, close
                },
                {
                    x: new Date(2025, 1, 8),
                    y: [30, 35, 25, 28],
                },
                {
                    x: new Date(2025, 1, 10),
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
                // Node.js (and JavaScript in general) does not have a built-in function for formatting dates as "YYYY-MM-DD".
                // You can use Intl.DateTimeFormat for some formats, but for "YYYY-MM-DD" you need to format manually or use a library.
                const date = new Date(item.x);
                const year = String(date.getFullYear()).substring(2, 4);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${day}/${month}/${year}`;
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
                text: 'Candlestick Plot',
            },
            plots: [
                {
                    kind: PlotKind.Candlestick,
                    metric: {
                        id: 'y',
                        caption: 'Price',
                        color: '#D24E4D',
                    },
                    fill: '#D24E4D',
                    animate: false,
                } as CandlestickPlotOptions,
            ],
            axes: {
                horizontal: {
                    axisType: AxisTypes.LabeledAxis,
                },
                vertical: {
                    axisType: AxisTypes.NumericAxis,
                },
            },
        });
    }
}
