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
var chartutils_1 = require("./helpers/chartutils");
var data_service_1 = require("./service/data.service");
var d3 = require("d3");
var WPieSeriesComponent = (function () {
    function WPieSeriesComponent(elementRef, scaleUtil, dataService) {
        this.elementRef = elementRef;
        this.scaleUtil = scaleUtil;
        this.dataService = dataService;
        console.log("Initalizing constructor WPieSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    WPieSeriesComponent.prototype.ngOnChanges = function () {
        if (!this.metadata)
            return;
        this.d3Element.selectAll("*").remove();
        var x = [];
        for (var i = 0; i < this.metadata.dataSeriesList.length; i++) {
            var ele = this.metadata.dataSeriesList[i];
            if (ele.datatype == 'string') {
                for (var i = 0; i < ele.extent.length; i++) {
                    x[i] = ele.extent[i];
                }
            }
        }
        for (var index = 0; index < this.metaseries.length; index++) {
            var element = this.metaseries[index];
            if (element.datatype == 'string') {
                continue;
            }
            this.drawseries(element, x);
        }
    };
    WPieSeriesComponent.prototype.drawseries = function (series, x) {
        var d3Element = d3.select(this.elementRef.nativeElement);
        var color = this.colorscales(this.metadata.graphColor);
        var val = series.id;
        var pie = d3.layout.pie().sort(null).value(function (d) { return d[val]; });
        var radius = Math.min(this.width, this.height) / 2;
        var labelArc = d3.svg.arc().outerRadius(radius).innerRadius(radius - 20);
        var arc = d3.svg.arc().outerRadius(radius + 10).innerRadius(0); /* for full pie chart*/
        var g = d3Element.selectAll(".arc")
            .data(pie(this.dataService.data))
            .enter().append("g")
            .attr({ "transform": "translate(" + this.width / 2 + "," + this.height / 2 + ")", "class": "arc" });
        if (this.metadata.animeReq) {
            g.append("path")
                .style("fill", function (d, i) { return color(x[i]); }).attr("stroke-width", 2)
                .transition()
                .delay(function (d, i) { return i * 200; }).duration(200)
                .attrTween('d', function (d) {
                var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                return function (T) {
                    d.endAngle = i(T);
                    return arc(d);
                };
            });
            g.append("text")
                .transition().delay(function (d, i) { return i * 200; }).duration(200)
                .attr({ "transform": function (d) { return "translate(" + labelArc.centroid(d) + ")"; }, "dy": ".35em" })
                .text(function (d, i) { return d.value; }).style({ "stroke": "black", "stroke-width": 0.5 });
        }
        else {
            g.append("path")
                .attr("d", arc)
                .style("fill", function (d, i) { return color(x[i]); });
            g.append("text")
                .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .text(function (d, i) { return d.value; }).style({ "stroke": "black", "stroke-width": 0.5 });
        }
    };
    WPieSeriesComponent.prototype.colorscales = function (category) {
        switch (category) {
            case "category10": return d3.scale.ordinal().range(d3.scale.category10().range());
            case "category20": return d3.scale.ordinal().range(d3.scale.category20().range());
            case "category20b": return d3.scale.ordinal().range(d3.scale.category20b().range());
            case "category20c": return d3.scale.ordinal().range(d3.scale.category20c().range());
        }
    };
    return WPieSeriesComponent;
}());
__decorate([
    core_1.Input("metaseries"),
    __metadata("design:type", Array)
], WPieSeriesComponent.prototype, "metaseries", void 0);
__decorate([
    core_1.Input("width"),
    __metadata("design:type", Object)
], WPieSeriesComponent.prototype, "width", void 0);
__decorate([
    core_1.Input("height"),
    __metadata("design:type", Object)
], WPieSeriesComponent.prototype, "height", void 0);
__decorate([
    core_1.Input("metadata"),
    __metadata("design:type", Object)
], WPieSeriesComponent.prototype, "metadata", void 0);
WPieSeriesComponent = __decorate([
    core_1.Component({
        selector: 'g.wpieseries',
        template: '',
        providers: [chartutils_1.ScaleUtil]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ElementRef, chartutils_1.ScaleUtil, data_service_1.DataService])
], WPieSeriesComponent);
exports.WPieSeriesComponent = WPieSeriesComponent;
//# sourceMappingURL=wpieseries.component.js.map