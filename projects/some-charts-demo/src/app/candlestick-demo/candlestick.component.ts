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
import Konva from 'konva';

(window as any).KonvaShapes = Konva.shapes

@Component({
    selector: 'candlestick-demo',
    templateUrl: './candlestick-demo.component.html',
})

export class CandlestickAxisComponent implements OnInit {
    constructor(private mathHelperService: MathHelperService) { }

    updateTooltip(tooltip: any, x: number, y: number, text: string) {
        tooltip.getText().text(text);
        tooltip.position({
            x: x,
            y: y,
        });
        tooltip.show();
    }
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

        // Add tooltip layer
        let plotTooltipLayer = chart.createLayer({ id: 'plot-tooltip', className: 'plot-tooltip-layer' });
        const tooltip = new Konva.Label({
            opacity: 0.75,
            visible: false,
            listening: false,
        });

        tooltip.add(
            new Konva.Tag({
                fill: 'black',
                pointerDirection: 'down',
                pointerWidth: 10,
                pointerHeight: 10,
                lineJoin: 'round',
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                shadowOpacity: 0.5,
            })
        );

        tooltip.add(
            new Konva.Text({
                text: '',
                fontFamily: 'Calibri',
                fontSize: 18,
                padding: 5,
                fill: 'white',
            })
        );
        plotTooltipLayer.add(tooltip);

        // chart.getLayer('chart')?.hide()
        // chart.getLayer('label')?.hide();
        const plotLayer = chart.getLayer('plot-layer-4');
        // plotLayer?.moveToTop();

        // chart.renderer.getStage()?.on('mouseover', (evt) => {
        //     const shape = evt.target;
        //     console.debug('mouseover: ', shape.name());
        //     if (shape && shape.name() === 'candlestick-y') {  // only change opacity if it's a candlestick-y shape
        //         shape.opacity(0.5);
        //     }
        //     const pos = chart.renderer.getStage().getPointerPosition();
        //     // console.debug('mousemove ---');
        //     // console.debug('mousemove - client X: ', evt.clientX, ', client Y: ', evt.clientY);
        //     // console.debug('mousemove - mousePos: ', pos);
        //     // const x = mousePos.x;
        //     // const y = mousePos.y - 5;
        //     // const x = evt.clientX;
        //     // const y = evt.clientY - 5;
        //     // const dataPoints = shape.getAttr('dataPoints');
        //     // const text = `open: ${dataPoints[0].y}\nhigh: ${dataPoints[1].y}\nlow: ${dataPoints[2].y}\nclose: ${dataPoints[3].y}`;
        //     if (pos) {
        //         this.updateTooltip(tooltip, pos.x, pos.y, `target: ${evt.target.name()}`);
        //     }
        //     // if (pos) {
        //     //     const hitCanvas = chart.getLayer('plot-layer-4')?.getHitCanvas()
        //     //     const p = hitCanvas?.context.getImageData(Math.round(pos.x * 1), Math.round(pos.y * 1), 1, 1).data;
        //     //     if (p) {
        //     //         const p3 = p[3];
        //     //         if (p3 === 255) {
        //     //             const colorKey = Konva.Util._rgbToHex(p[0], p[1], p[2]);
        //     //             const shape = Konva.shapes['#' + colorKey];
        //     //             console.debug('mousemove - colorKey: ', colorKey);
        //     //             console.debug('mousemove - shape: ', shape);
        //     //         } else {
        //     //             console.debug('mousemove - pixel: ', p);
        //     //         }
        //     //     }
        //     // }
        //     // console.debug('mousemove --- end');
        //     // console.debug('  ');
        // });

        // chart.onEventCallback('mouseout', (evt) => {
        //     const shape = evt.target;
        //     if (!shape || shape.name() !== 'candlestick-y') {  // only change opacity if it's a candlestick-y shape
        //         shape.opacity(0);
        //         tooltip.hide();
        //     }
        // });

        chart.onEventCallback('mousemove', (evt) => {
            const shape = evt.target;
            if (shape && shape.name() === 'candlestick-y') {  // only change opacity if it's a candlestick-y shape
                // const pos = chart.renderer.getStage().getPointerPosition();
                // console.debug('mousemove ---');
                // console.debug('mousemove - client X: ', evt.clientX, ', client Y: ', evt.clientY);
                // console.debug('mousemove - mousePos: ', pos);
                // const x = mousePos.x;
                // const y = mousePos.y - 5;
                const x = evt.evt.clientX;
                const y = evt.evt.clientY - 5;
                const dataPoints = shape.getAttr('dataPoints');
                const text = `open: ${dataPoints[0].y}\nhigh: ${dataPoints[1].y}\nlow: ${dataPoints[2].y}\nclose: ${dataPoints[3].y}`;
                chart.renderer.getStage().container().style.cursor = 'None';
                this.updateTooltip(tooltip, x, y, text);
                
            } else {
                tooltip.hide();
                chart.renderer.getStage().container().style.cursor = 'Default';
            }
        });

        chart.onEventCallback('click', function (e) {
            console.debug('target :' + e.target.name())
        });
    }

}
