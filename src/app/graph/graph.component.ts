import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

const Draggable = require("highcharts/modules/draggable-points.js");
Draggable(Highcharts);

const Exporting = require("highcharts/modules/exporting.js");
Exporting(Highcharts);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphComponent implements OnInit {
  Highcharts = Highcharts;
  chartOptions: any;
  updateFlag: boolean = false;

  timeData: any[] = [];
  seriesData: any[] = [];
  colors: any[] = [
    {
      label: 'Green',
      code: 'green',
      hexCode: '#008000',
    },
    {
      label: 'Red',
      code: 'red',
      hexCode: '#ff0000',
    },
    {
      label: 'Yellow',
      code: 'yellow',
      hexCode: '#FFFF00',
    }
  ]
  graphData: any[] = [
    { time: 0, green: 0, red: 50, yellow: 50, output: "#7fff00" },
    { time: 1, green: 20, red: 20, yellow: 60, output: "#3d4600" },
    { time: 2, green: 10, red: 10, yellow: 80, output: "#9c9d00" },
    { time: 3, green: 0, red: 0, yellow: 100, output: "#fffe00" },
    { time: 4, green: 50, red: 50, yellow: 0, output: "#408000" },
    { time: 5, green: 0, red: 46, yellow: 54, output: "#8a1300" },
    { time: 6, green: 0, red: 20, yellow: 80, output: "#cc9800" },
    { time: 7, green: 0, red: 100, yellow: 0, output: "#ff0000" },
    { time: 8, green: 0, red: 50, yellow: 50, output: "#7fff00" },
    { time: 9, green: 20, red: 20, yellow: 60, output: "#3d4600" },
    { time: 10, green: 10, red: 10, yellow: 80, output: "#9c9d00" },
    { time: 11, green: 0, red: 0, yellow: 100, output: "#fffe00" },
    { time: 12, green: 50, red: 50, yellow: 0, output: "#408000" },
    { time: 13, green: 0, red: 46, yellow: 54, output: "#8a1300" },
    { time: 14, green: 0, red: 20, yellow: 80, output: "#cc9800" },
    { time: 15, green: 0, red: 100, yellow: 0, output: "#ff0000" },
    { time: 16, green: 0, red: 50, yellow: 50, output: "#7fff00" },
    { time: 17, green: 20, red: 20, yellow: 60, output: "#3d4600" },
    { time: 18, green: 10, red: 10, yellow: 80, output: "#9c9d00" },
    { time: 19, green: 0, red: 0, yellow: 100, output: "#fffe00" },
    { time: 20, green: 50, red: 50, yellow: 0, output: "#408000" },
    { time: 21, green: 0, red: 46, yellow: 54, output: "#8a1300" },
    { time: 22, green: 0, red: 20, yellow: 80, output: "#cc9800" },
    { time: 23, green: 0, red: 100, yellow: 0, output: "#ff0000" },
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initialiseData();
  }

  // edit a table value
  editSeriesData(i: any, item: any) {
    const colorTotal: number = item.green + item.red + item.yellow
    if (colorTotal === 100) {
      const outputColor = this.generateOutputcolor(
        [0, 255, 0, item.green / 100], // green
        [255, 0, 0, item.red / 100], // red
        [255, 255, 0, item.yellow / 100]  // yellow
      );
      this.graphData[i].green = item.green;
      this.graphData[i].red = item.red;
      this.graphData[i].yellow = item.yellow;
      this.graphData[i].output = outputColor;

      this.initialiseData();
    } else {
      alert("Sum of all the three value must be equal to 100");
    }
  }

  /**
   * generate output color
   * @param green pass green color value
   * @param red  pass red color value
   * @param yellow pass yellow color value
   * @returns 
   */
  generateOutputcolor(green, red, yellow) {
    let outputColor: any = [];
    outputColor[3] = 1; // 1 - (1 - green[3]) * (1 - red[3]) * (1 - white[3]) // alpha
    outputColor[0] = Math.round((green[0] * green[3] / outputColor[3]) + (red[0] * red[3] * (1 - green[3]) / outputColor[3]) + (yellow[0] * yellow[3] * (2 - green[3]) / outputColor[3])); // red
    outputColor[1] = Math.round((green[1] * green[3] / outputColor[3]) + (red[1] * red[3] * (1 - green[3]) / outputColor[3]) + (yellow[1] * yellow[3] * (2 - green[3]) / outputColor[3])); // green
    outputColor[2] = Math.round((green[2] * green[3] / outputColor[3]) + (red[2] * red[3] * (1 - green[3]) / outputColor[3]) + (yellow[2] * yellow[3] * (2 - green[3]) / outputColor[3])); // blue
    let finalColor = this.rgbToHex(outputColor[0], outputColor[1], outputColor[2]);
    return finalColor;
  }

  rgbToHex(r: any, g: any, b: any) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  //delete value in array 
  delete(index: any) {
    this.graphData.splice(index, 1);
    this.initialiseData();
  }

  //graph value
  updateGraph() {
    this.updateFlag = false
    this.cdr.detectChanges();

    this.chartOptions = {
      chart: {
        animation: false
      },

      title: {
        text: "Color Opacity"
      },

      xAxis: {
        title: {
          text: 'Time (24 hours)'
        },
        categories: this.timeData
      },

      yAxis: {
        title: {
          text: 'Percentage (Opacity)'
        },
        min: 0,
        max: 100,
        endOnTick: false
      },

      plotOptions: {
        series: {
          stickyTracking: false,
          dragDrop: {
            draggableY: true
          },
          point: {
            events: {
              drop: (e: any) => {
                if (e['newPoints']) {
                  let updatedVal: number = 0;
                  let seriesName: string = '';
                  let index: number = 0;
                  for (const [key, value] of Object.entries(e['newPoints'])) {
                    updatedVal = parseInt(value['point']['y']);
                    updatedVal = updatedVal >= 100 ? 100 : updatedVal;
                    seriesName = value['point']['series']['name'];
                  }
                  for (const [key, value] of Object.entries(e['origin']['points'])) {
                    index = value['x']
                  }
                  let oldVal = this.graphData[index][seriesName.toLocaleLowerCase()]
                  let diffVal = updatedVal - oldVal;
                  let operation = 'add';
                  if (diffVal > 0) {
                    operation = 'minus';
                  }

                  let finalVal = parseInt(Math.abs(diffVal / (this.colors.length - 1)).toString());
                  let selectedColorIndex = this.colors.findIndex(x => x.label === seriesName);
                  let indexToProcess: number = this.colors.length - 1;
                  if (selectedColorIndex == (this.colors.length - 1)) {
                    indexToProcess--;
                  }

                  let finalSum: number = 0;
                  this.graphData[index][seriesName.toLocaleLowerCase()] = Math.abs(parseInt(updatedVal.toString()));
                  this.colors.forEach((element: any) => {
                    if (element.label != seriesName) {
                      if (updatedVal >= 100) {
                        this.graphData[index][element.code] = 0;
                      } else {
                        let tmpValue: number = 0;
                        if (operation === 'add') {
                          tmpValue = Math.abs(this.graphData[index][element.code] + finalVal)
                        } else {
                          tmpValue = Math.abs(this.graphData[index][element.code] - finalVal)
                        }

                        if(tmpValue < 0){
                          tmpValue = 0;
                        } else if(tmpValue > 100){
                          tmpValue = 100
                        }
                        this.graphData[index][element.code] = parseInt(tmpValue.toString());
                        finalSum += this.graphData[index][element.code];
                      }
                    } else {
                      finalSum += this.graphData[index][element.code];
                    }
                  });

                  finalSum = finalSum - this.graphData[index][this.colors[indexToProcess].code];
                  let lastVal = parseInt((100 - finalSum).toString());
                  this.graphData[index][this.colors[indexToProcess].code] = (lastVal > 100) ? 100 : ((lastVal < 0) ? 0 : lastVal);
                  if(this.graphData[index]['green'] + this.graphData[index]['red'] + this.graphData[index]['yellow'] !== 100){
                    let newSum = this.graphData[index]['green'] + this.graphData[index]['red'] + this.graphData[index]['yellow'];
                    let extraVal = Math.abs(100 - newSum);
                    this.graphData[index][this.colors[indexToProcess-1].code] = this.graphData[index][this.colors[indexToProcess-1].code] - extraVal;
                  }

                  const outputColor = this.generateOutputcolor(
                    [0, 255, 0, this.graphData[index].green / 100], // green
                    [255, 0, 0, this.graphData[index].red / 100], // red
                    [255, 255, 0, this.graphData[index].yellow / 100]  // yellow
                  );
                  this.graphData[index].output = outputColor;
                }
                this.initialiseData()
              }
            }
          }
        },
        column: {
          stacking: "normal",
          minPointLength: 2
        },
        line: {
          cursor: "ns-resize"
        }
      },
      tooltip: {
        valueDecimals: 2
      },
      series: this.seriesData
    };

    this.updateFlag = true;
    this.cdr.detectChanges();
  }

  //store initialise data
  initialiseData() {
    this.updateFlag = false;
    this.timeData = [];
    this.seriesData = [];
    this.colors.forEach(element => {
      this.seriesData.push({
        type: 'line',
        name: element.label,
        data: [],
        color: element.hexCode,
      });
    });

    this.graphData.forEach((element: any, index: any) => {
      this.timeData.push(element.time);

      this.seriesData.forEach((seriesRow: any) => {
        seriesRow.data.push(element[seriesRow.name.toLowerCase()]);
      })
    });
    this.updateGraph()
  }
}