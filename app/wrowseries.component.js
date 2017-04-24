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
var WRowSeriesComponent = (function () {
    function WRowSeriesComponent(elementRef, scaleUtil, dataService) {
        this.elementRef = elementRef;
        this.scaleUtil = scaleUtil;
        this.dataService = dataService;
        this.tooltipevent = new core_1.EventEmitter();
        this.axismovementevent = new core_1.EventEmitter();
        console.log("Initalizing constructor WRowSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    WRowSeriesComponent.prototype.ngOnChanges = function () {
        if (!this.metadata)
            return;
        this.d3Element.selectAll("*").remove();
        if (this.metaseries.length < 1)
            return;
        if (this.scale) {
            var scale2 = this.createInnerScale();
            for (var index = 0; index < this.metaseries.length; index++) {
                var element = this.metaseries[index];
                if (element.datatype == 'string')
                    continue;
                this.drawseries(element, scale2);
            }
        }
    };
    WRowSeriesComponent.prototype.createInnerScale = function () {
        var scale2 = this.scale.scaley.copy();
        scale2.domain(this.metaseries
            .filter(function (series) { return series.axistype == 'xaxis'; })
            .map(function (series) { return series.id; }));
        if (this.metadata.yaxis.datatype == 'string') {
            scale2.rangeRoundBands([this.scale.scaley.rangeBand(), 0]);
        }
        else {
            scale2.range([this.scale.scaley.rangeBand(), 0]);
        }
        return scale2;
    };
    WRowSeriesComponent.prototype.drawseries = function (series, scale2) {
        var _this = this;
        var d3Element = d3.select(this.elementRef.nativeElement);
        var scalex = this.scale.scalex;
        var scaley = this.scale.scaley;
        var xaxisname = this.metadata.xaxis.id;
        var yaxisname = this.metadata.yaxis.id;
        var xy = this.d3Element.selectAll(".bar")
            .data(this.dataService.data)
            .enter().append("g")
            .attr("class", "rect")
            .append("rect")
            .attr({ "transform": function (d) { return "translate(0," + scaley(d[yaxisname]) + ")"; }, "height": scale2.rangeBand(), "y": scale2(series.id) })
            .style("fill", function (d) { return series.color; });
        if (this.metadata.showTooltip) {
            xy.on("mouseover", function (d) { _this.tooltipevent.emit({ value: { "func": "mouseover", "text": d[series.id], "y": scaley(d[yaxisname]) + scale2(series.id), "x": scalex(d[series.id]) } }); })
                .on("mouseout", function (d) { _this.tooltipevent.emit({ value: { "func": "mouseout" } }); });
        }
        var xx = true, x = series.id;
        for (var i = 0; i < this.dataService.data.length; i++) {
            var ele = this.dataService.data[i];
            if (ele[x] < 0) {
                xx = false;
                this.axismovementevent.emit({ value: { "axisType": this.metadata.yaxis.axistype, "scaleValue": this.scale.scalex(0) } });
            }
        }
        if (this.metadata.animeReq) {
            xy.attr({ "x": function (d) { if (xx) {
                    return 0;
                }
                else {
                    return scalex(0);
                } }, "width": function (d) { return 0; } })
                .transition()
                .duration(3000)
                .attr({ "x": function (d) { if (xx) {
                    return scale2(d[xaxisname]);
                }
                else {
                    return Math.min(scalex(d[series.id]), scalex(0));
                } },
                "width": function (d) { if (xx) {
                    return scalex(d[series.id]) > 0 ? scalex(d[series.id]) : 0;
                }
                else {
                    return Math.abs(scalex(d[series.id]) - scalex(0));
                } } });
        }
        else {
            xy.transition().delay(200)
                .attr({ "x": function (d) { return scale2(d[xaxisname]); }, "width": function (d) { return scalex(d[series.id]) > 0 ? scalex(d[series.id]) : 0; } });
        }
    };
    return WRowSeriesComponent;
}());
__decorate([
    core_1.Input("metadata"),
    __metadata("design:type", chartdtos_1.Meta)
], WRowSeriesComponent.prototype, "metadata", void 0);
__decorate([
    core_1.Input("metaseries"),
    __metadata("design:type", Array)
], WRowSeriesComponent.prototype, "metaseries", void 0);
__decorate([
    core_1.Input("scale"),
    __metadata("design:type", Object)
], WRowSeriesComponent.prototype, "scale", void 0);
__decorate([
    core_1.Input("height"),
    __metadata("design:type", Object)
], WRowSeriesComponent.prototype, "height", void 0);
__decorate([
    core_1.Input("width"),
    __metadata("design:type", Object)
], WRowSeriesComponent.prototype, "width", void 0);
__decorate([
    core_1.Output("tooltipevent"),
    __metadata("design:type", Object)
], WRowSeriesComponent.prototype, "tooltipevent", void 0);
__decorate([
    core_1.Output("axismovementevent"),
    __metadata("design:type", Object)
], WRowSeriesComponent.prototype, "axismovementevent", void 0);
WRowSeriesComponent = __decorate([
    core_1.Component({
        selector: 'g.wrowseries',
        template: '',
        providers: [chartutils_1.ScaleUtil]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ElementRef, chartutils_1.ScaleUtil, data_service_1.DataService])
], WRowSeriesComponent);
exports.WRowSeriesComponent = WRowSeriesComponent;
//# sourceMappingURL=wrowseries.component.js.map