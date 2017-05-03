"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var chartdtos_1 = require("./helpers/chartdtos");
var d3 = require("d3");
//import 'jspdf';
var WSvgChartContainer = (function () {
    function WSvgChartContainer(elementRef) {
        this.elementRef = elementRef;
        this.scale = {};
        this.columnseries = new Array();
        this.lineseries = new Array();
        this.areaseries = new Array();
        this.rowseries = new Array();
        this.pieseries = new Array();
        this.donutseries = new Array();
        this.comboseries = new Array();
        this.scatterseries = new Array();
        this.stackedseries = new Array();
        this.svgwidth = 800;
        this.svgheight = 400;
        this.svgwidth1 = 320;
        this.svgheight1 = 25;
        console.log("Initalizing constructor WSvgChartContainer");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    WSvgChartContainer.prototype.ngOnChanges = function () {
        if (!this.metadata)
            return;
        console.log("On change triggered in wsvgChartComponent:scale:" + this.scale);
        this.svgchart.nativeElement.style.backgroundColor = this.metadata.bgcolor;
        //this.svgwidth1=this.svgchart.nativeElement.width.animVal.value;
        //this.svgheight1=this.svgchart.nativeElement.height.animVal.value;
        if (this.width < 320) {
            var ar = this.width / this.svgwidth1;
            this.svgwidth1 = this.svgwidth1 * ar;
        }
        if (this.height < 25) {
            var ar = this.height / this.svgheight1;
            this.svgheight1 = this.svgheight1 * ar;
        }
        this.drawMargin();
        this.updateSeries();
    };
    WSvgChartContainer.prototype.updateSeries = function () {
        this.columnseries = this.metadata.dataSeriesList.filter(function (series) { return series.charttype == "column" && series.showseries; });
        this.lineseries = this.metadata.dataSeriesList.filter(function (series) { return series.charttype == "line" && series.showseries; });
        this.areaseries = this.metadata.dataSeriesList.filter(function (series) { return series.charttype == "area" && series.showseries; });
        this.rowseries = this.metadata.dataSeriesList.filter(function (series) { return series.charttype == "row" && series.showseries; });
        this.pieseries = this.metadata.dataSeriesList.filter(function (series) { return series.charttype == "pie" && series.showseries; });
        this.donutseries = this.metadata.dataSeriesList.filter(function (series) { return series.charttype == "donutpie" && series.showseries; });
        this.comboseries = this.metadata.dataSeriesList.filter(function (series) { return series.charttype == "combo" && series.showseries; });
        this.scatterseries = this.metadata.dataSeriesList.filter(function (series) { return series.charttype == "scatter" && series.showseries; });
        this.stackedseries = this.metadata.dataSeriesList.filter(function (series) { return series.charttype == "stacked" && series.showseries; });
    };
    WSvgChartContainer.prototype.tooltipUpdated = function (event) {
        if (event.value) {
            if (event.value.func === "mouseover") {
                this.d3Element.selectAll(".tooltip").style("display", "inline").text(event.value.text).style("top", event.value.y + 60 + "px").style("left", event.value.x + 60 + "px");
            }
            else {
                this.d3Element.selectAll(".tooltip").style("display", "none");
            }
        }
    };
    WSvgChartContainer.prototype.axisMovement = function (event) {
        if (event.value.axisType === "yaxis") {
            this.d3Element.selectAll(".y").filter(".axis").attr("transform", "translate(" + event.value.scaleValue + ",0)");
        }
        else if (event.value.axisType === "xaxis") {
            this.d3Element.selectAll(".x").filter(".axis").attr("transform", "translate(0," + event.value.scaleValue + ")");
        }
    };
    WSvgChartContainer.prototype.drawMargin = function () {
        var padding = { "left": 40, "right": 20, "top": 10, "bottom": 20 };
        this.transform = "translate(" + padding.left + "," + padding.top + ")";
        this.svgwidth = parseInt(this.width) + padding.left + padding.right;
        this.svgheight = parseInt(this.height) + padding.top + padding.bottom;
        console.log("this.svgheight:" + this.svgheight + ":" + "this.svgwidth:" + this.svgwidth);
    };
    WSvgChartContainer.prototype.legendClick = function (event) {
        console.log("On legend click triggered in wsvgChartComponent");
        this.updateSeries();
        this.updatechart = this.updatechart + 1;
    };
    return WSvgChartContainer;
}());
__decorate([
    core_1.Input("height"),
    __metadata("design:type", Object)
], WSvgChartContainer.prototype, "height", void 0);
__decorate([
    core_1.Input("width"),
    __metadata("design:type", Object)
], WSvgChartContainer.prototype, "width", void 0);
__decorate([
    core_1.Input("metadata"),
    __metadata("design:type", chartdtos_1.Meta)
], WSvgChartContainer.prototype, "metadata", void 0);
__decorate([
    core_1.Input("updatechart"),
    __metadata("design:type", Number)
], WSvgChartContainer.prototype, "updatechart", void 0);
__decorate([
    core_1.ViewChild('svgchart'),
    __metadata("design:type", Object)
], WSvgChartContainer.prototype, "svgchart", void 0);
WSvgChartContainer = __decorate([
    core_1.Component({
        selector: 'wsvgchartcontainer',
        template: "  <svg class=\"svgchart\" #svgchart [attr.height]=\"svgheight\">\n                <g class=\"wcontainer\" [attr.transform]=\"transform\">\n                    <g class=\"waxis\" [metadata]=\"metadata\" [scale]=\"scale\" [width]=\"width\" [height]=\"height\"  [updatechart]=\"updatechart\"></g>\n                    <g class=\"wseries\">\n                      <g class=\"wcolumnseries\"  (axismovementevent)=\"axisMovement($event);\"  (tooltipevent)=\"tooltipUpdated($event)\" [width]=\"width\" [height]=\"height\" [scale]=\"scale\" [metadata]=\"metadata\"  [metaseries]=\"columnseries\" ></g>\n                       <g class=\"wareaseries\" [width]=\"width\" [height]=\"height\" [scale]=\"scale\" [metadata]=\"metadata\"  [metaseries]=\"areaseries\" ></g>\n                       <g class=\"wrowseries\"  (axismovementevent)=\"axisMovement($event);\"  (tooltipevent)=\"tooltipUpdated($event)\"  [width]=\"width\" [height]=\"height\" [scale]=\"scale\" [metadata]=\"metadata\"  [metaseries]=\"rowseries\" ></g>\n                       <g class=\"wlineseries\"    (axismovementevent)=\"axisMovement($event);\"   [width]=\"width\" [height]=\"height\" [scale]=\"scale\" [metadata]=\"metadata\"  [metaseries]=\"lineseries\" ></g> \n                       <g class=\"wpieseries\" [metadata]=\"metadata\" [width]=\"width\" [height]=\"height\" [metaseries]=\"pieseries\" ></g>\n                       <g class=\"wpiedonutseries\" [metadata]=\"metadata\" [width]=\"width\" [height]=\"height\" [metaseries]=\"donutseries\" ></g>\n                       <g class=\"wcomboseries\"  (axismovementevent)=\"axisMovement($event);\"   (tooltipevent)=\"tooltipUpdated($event)\" [width]=\"width\" [height]=\"height\" [scale]=\"scale\" [metadata]=\"metadata\"  [metaseries]=\"comboseries\" ></g>\n                       <g class=\"wscatterseries\" (axismovementevent)=\"axisMovement($event);\" [width]=\"width\" [height]=\"height\" [scale]=\"scale\" [metadata]=\"metadata\"  [metaseries]=\"scatterseries\" ></g>\n                       <g class=\"wstackedcolumnseries\" [height]=\"height\" \n                            [scale]=\"scale\" [metadata]=\"metadata\"  \n                            [metaseries]=\"stackedseries\">\n                       </g>\n                    </g>\n                </g>\n              </svg>\n               <div class=\"tooltip\" style=\"display:none\"></div>\n             \n                <div width=\"300px\" class=\"comments\"></div>\n               <svg #svgchart1  [attr.width]=\"svgwidth\" [attr.height]=\"svgheight1\">\n                          <g class=\"wlegend\"  (legendclicktevent)= \"legendClick($event);\" [metadata]=\"metadata\" [updatechart]=\"updatechart\" [width]=\"svgwidth1\"> \n                          </g>\n                </svg> \n               "
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ElementRef])
], WSvgChartContainer);
exports.WSvgChartContainer = WSvgChartContainer;
//# sourceMappingURL=wsvgchartcontainer.component.js.map