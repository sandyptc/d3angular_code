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
var chartutils_1 = require("./helpers/chartutils");
var data_service_1 = require("./service/data.service");
var d3 = require("d3");
var WLegendComponent = (function () {
    function WLegendComponent(elementRef, scaleUtil, dataService, dp) {
        this.elementRef = elementRef;
        this.scaleUtil = scaleUtil;
        this.dataService = dataService;
        this.dp = dp;
        this.legendclicktevent = new core_1.EventEmitter();
        console.log("Initalizing constructor WLegend Component");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    WLegendComponent.prototype.ngOnChanges = function () {
        if (!this.metadata)
            return;
        var pi = 0, di = 0;
        var x = [];
        for (var index = 0; index < this.metadata.dataSeriesList.length; index++) {
            var element = this.metadata.dataSeriesList[index];
            if (element.datatype == 'string') {
                for (var i = 0; i < element.extent.length; i++) {
                    x[i] = element.extent[i];
                }
                continue;
            }
            if (this.metadata.graphType === 'pie' || this.metadata.graphType === 'donutpie') {
                if (element.showseries) {
                    if (this.metadata.graphType === 'pie' && pi == 0) {
                        this.drawLegend(element, x);
                        pi++;
                    }
                    else if (this.metadata.graphType === 'donutpie' && di == 0) {
                        this.drawLegend(element, x);
                        di++;
                    }
                }
            }
            else {
                this.drawLegend(element, x);
            }
        }
    };
    WLegendComponent.prototype.drawLegend = function (series, x) {
        var _this = this;
        if (this.metadata.legendPos !== 'ds') {
            var aratio = 1;
            if (this.width < 290) {
                aratio = this.width / 290;
            }
            if (this.metadata.graphType === 'pie' || this.metadata.graphType === 'donutpie') {
                this.d3Element.selectAll(".legend").remove();
                console.log("Pie/Donut chart");
                var val = series.id;
                var color = this.colorscales(this.metadata.graphColor);
                var colorSeries = this.metadata.dataSeriesList.filter(function (s) { return s.datatype == series.datatype; });
                var pie = d3.layout.pie().sort(null).value(function (d) { return d[val]; });
                var aa = pie(this.dataService.data);
                var g = this.d3Element.selectAll(".arc")
                    .data(pie(this.dataService.data))
                    .enter().append("g").attr('class', 'legend');
                g.append("circle")
                    .attr({ "cy": 9, "cx": function (d, i) { return (i * 70) + 22; }, 'r': '0.5em', 'class': 'circle' })
                    .style({ "stroke": function (d, i) { return color(x[i]); }, "stroke-width": 2 })
                    .style('fill', function (d, i) { if (colorSeries[i].showseries) {
                    return color(x[i]);
                }
                else {
                    return "white";
                } })
                    .attr("id", function (d, i) { return colorSeries[i].id; });
                if (this.metadata.graphType === 'donutpie') {
                    g.append("circle")
                        .attr({ "cy": 9, "cx": function (d, i) { return (i * 70) + 22; }, 'r': '0.35em', 'class': 'circle' })
                        .style({ "stroke": function (d, i) { return color(x[i]); }, "stroke-width": 2 })
                        .style('fill', "white")
                        .attr("id", function (d, i) { return colorSeries[i].id; });
                }
                // g.append('rect')
                // .attr({'y':6,'x':(d, i)=>{return (i*60*aratio)+10;},'width': 10,'height': 10,'class':'rect'})
                // .style("stroke-width",3)
                // .style("stroke", (d, i)=> { return color(x[i]); })
                // .style("fill", (d, i)=>{ return color(x[i]); });
                g.append('text')
                    .attr({ 'y': 15, 'x': function (d, i) { return (i * 70 * aratio) + 30; } })
                    .text(function (d, i) { return x[i] + "(" + aa[i].value + ")"; });
                // .text((d:any,i)=>{if(this.metadata.graphType==='pie'){return x[i];} 
                // else if(this.metadata.graphType==='donutpie'){return aa[i].value;}} )
            }
            else {
                this.d3Element.selectAll(".legend").remove();
                var colorSeries = this.metadata.dataSeriesList.filter(function (s) { return s.datatype == series.datatype; });
                var legend = this.d3Element.selectAll("g").data(colorSeries).enter().append('g').attr('class', 'legend');
                var rect = legend.append('rect')
                    .attr({ 'y': 6, 'x': function (d, i) { return (i * 60 * aratio) + 10; }, 'width': 10, 'height': 10, 'class': 'rect' })
                    .style("stroke", function (d, i) { return colorSeries[i].color; })
                    .style("stroke-width", 2)
                    .style('fill', function (d, i) { if (colorSeries[i].showseries) {
                    return colorSeries[i].color;
                }
                else {
                    return "white";
                } })
                    .attr("id", function (d, i) { return colorSeries[i].id; })
                    .on("click", function (d, i) {
                    if (d.id == colorSeries[i].id) {
                        if (colorSeries[i].showseries) {
                            colorSeries[i].showseries = false;
                        }
                        else {
                            colorSeries[i].showseries = true;
                        }
                    }
                    console.log(colorSeries);
                    _this.updatechart = _this.updatechart + 1;
                    _this.legendclicktevent.emit({ value: { "id": series.id } });
                });
                legend.append('text')
                    .attr({ 'y': 15, 'x': function (d, i) { return (i * 60 * aratio) + 22; } })
                    .text(function (d, i) { return colorSeries[i].id; }).style({ "fill": "none", "stroke": "black", "shape-rendering": "crispEdges" })
                    .on("click", function (d, i) {
                    if (d.id == colorSeries[i].id) {
                        if (colorSeries[i].showseries) {
                            colorSeries[i].showseries = false;
                        }
                        else {
                            colorSeries[i].showseries = true;
                        }
                    }
                    console.log(colorSeries);
                    _this.updatechart = _this.updatechart + 1;
                    _this.legendclicktevent.emit({ value: { "id": series.id } });
                });
            }
        }
        else {
            this.d3Element.selectAll(".legend").remove();
        }
    };
    WLegendComponent.prototype.colorscales = function (category) {
        switch (category) {
            case "category10": return d3.scale.ordinal().range(d3.scale.category10().range());
            case "category20": return d3.scale.ordinal().range(d3.scale.category20().range());
            case "category20b": return d3.scale.ordinal().range(d3.scale.category20b().range());
            case "category20c": return d3.scale.ordinal().range(d3.scale.category20c().range());
        }
    };
    return WLegendComponent;
}());
__decorate([
    core_1.Input("width"),
    __metadata("design:type", Object)
], WLegendComponent.prototype, "width", void 0);
__decorate([
    core_1.Input("metadata"),
    __metadata("design:type", chartdtos_1.Meta)
], WLegendComponent.prototype, "metadata", void 0);
__decorate([
    core_1.Input("updatechart"),
    __metadata("design:type", Number)
], WLegendComponent.prototype, "updatechart", void 0);
__decorate([
    core_1.Output("legendclicktevent"),
    __metadata("design:type", Object)
], WLegendComponent.prototype, "legendclicktevent", void 0);
WLegendComponent = __decorate([
    core_1.Component({
        selector: 'g.wlegend',
        template: '',
        providers: [chartutils_1.ScaleUtil]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ElementRef, chartutils_1.ScaleUtil, data_service_1.DataService, chartutils_1.DataProcessor])
], WLegendComponent);
exports.WLegendComponent = WLegendComponent;
//# sourceMappingURL=wlegend.component.js.map