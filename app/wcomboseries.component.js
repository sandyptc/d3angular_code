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
var data_service_1 = require("./service/data.service");
var chartutils_1 = require("./helpers/chartutils");
var d3 = require("d3");
var WComboSeriesComponent = (function () {
    function WComboSeriesComponent(elementRef, scaleUtil, dataService) {
        this.elementRef = elementRef;
        this.scaleUtil = scaleUtil;
        this.dataService = dataService;
        this.tooltipevent = new core_1.EventEmitter();
        this.axismovementevent = new core_1.EventEmitter();
        console.log("Initalizing constructor WComboSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    WComboSeriesComponent.prototype.ngOnChanges = function () {
        if (!this.metadata)
            return;
        this.d3Element.selectAll("*").remove();
        console.log(this.scale);
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
    WComboSeriesComponent.prototype.createInnerScale = function () {
        var scale2 = this.scale.scalex.copy();
        scale2.domain(this.metaseries
            .filter(function (series) { return series.axistype == 'yaxis'; })
            .map(function (series) { return series.id; }));
        if (this.metadata.xaxis.datatype == 'string') {
            scale2.rangeRoundBands([0, this.scale.scalex.rangeBand()]);
        }
        else {
            scale2.range([0, this.scale.scalex.rangeBand()]);
        }
        return scale2;
    };
    WComboSeriesComponent.prototype.drawseries = function (series, scale2) {
        var _this = this;
        var d3Element = d3.select(this.elementRef.nativeElement);
        var scalex = this.scale.scalex;
        var scaley = this.scale.scaley;
        var xaxisname = this.metadata.xaxis.id;
        var yaxisname = this.metadata.yaxis.id;
        var xy = d3Element.selectAll(".bar")
            .data(this.dataService.data)
            .enter().append("g")
            .attr({ "class": "rect", "transform": function (d) { return "translate(" + scalex(d[xaxisname]) + ",0)"; } })
            .append("rect")
            .attr({ "x": scale2(series.id), "width": scale2.rangeBand() })
            .style("fill", function (d) { return series.color; })
            .attr("opacity", 0.7);
        if (this.metadata.showTooltip) {
            xy.on("mouseover", function (d) { _this.tooltipevent.emit({ value: { "func": "mouseover", "text": d[series.id], "x": scalex(d[xaxisname]) + scale2(series.id), "y": _this.scale.scaley(d[series.id]) - 20 } }); })
                .on("mouseout", function (d) { _this.tooltipevent.emit({ value: { "func": "mouseout" } }); });
        }
        var xx = true, x = series.id;
        for (var i = 0; i < this.dataService.data.length; i++) {
            var ele = this.dataService.data[i];
            if (ele[x] < 0) {
                xx = false;
                this.axismovementevent.emit({ value: { "axisType": this.metadata.xaxis.axistype, "scaleValue": this.scale.scaley(0) } });
            }
        }
        if (this.metadata.animeReq) {
            xy.attr({ "y": function (d) { if (xx) {
                    return _this.height;
                }
                else {
                    return scaley(0);
                } }, "height": function (d) { return 0; } })
                .transition().duration(3000)
                .attr({ "y": function (d, j) { if (xx) {
                    return _this.scale.scaley(d[series.id]);
                }
                else {
                    return Math.min(_this.scale.scaley(d[series.id]), _this.scale.scaley(0));
                } },
                "height": function (d, j) { if (xx) {
                    return _this.height - _this.scale.scaley(d[series.id]);
                }
                else {
                    return Math.abs(_this.scale.scaley(d[series.id]) - _this.scale.scaley(0));
                } } });
        }
        else {
            xy.transition().delay(200)
                .attr({ "y": function (d, j) { return _this.scale.scaley(d[series.id]); }, "height": function (d, j) { return _this.height - _this.scale.scaley(d[series.id]); } });
        }
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", "none");
        var line = d3.svg.line();
        if (this.metadata.xaxis.datatype === "string") {
            line.x(function (d) { return scalex(d[_this.metadata.xaxis.id]) + scale2(series.id) + scale2.rangeBand() / 2; })
                .y(function (d) { return scaley(d[series.id]); });
        }
        else {
            line.x(function (d) { return scalex(d[series.id]); })
                .y(function (d) { return scaley(d[yaxisname]) + scaley.rangeBand() / 2; });
        }
        var path = this.d3Element.append("path")
            .datum(this.dataService.data);
        var xx = true, x = series.id;
        for (var i = 0; i < this.dataService.data.length; i++) {
            var ele = this.dataService.data[i];
            if (ele[x] < 0) {
                xx = false;
                if (this.metadata.xaxis.datatype === 'string') {
                    this.axismovementevent.emit({ value: { "axisType": this.metadata.xaxis.axistype, "scaleValue": this.scale.scaley(0) } });
                }
                else {
                    this.axismovementevent.emit({ value: { "axisType": this.metadata.yaxis.axistype, "scaleValue": this.scale.scalex(0) } });
                }
            }
        }
        if (this.metadata.animeReq) {
            path.attr({ "class": "line", "fill": "none", "stroke": series.color, "d": line });
            var totalLength = 0;
            path.each(function (d) {
                d.totalLength = this.getTotalLength();
                totalLength = d.totalLength;
            });
            var ln = path.attr({ "stroke-dasharray": totalLength + " " + totalLength, "stroke-dashoffset": totalLength });
            ln.transition().duration(2000).ease("linear").attr("stroke-dashoffset", 0);
        }
        else {
            path.attr({ "class": "line", "fill": "none", "stroke": series.color, "d": line }).transition().delay(200);
        }
        // Add the scatterplot
        var dots = this.d3Element.selectAll(".dot")
            .data(this.dataService.data)
            .enter().append("circle")
            .attr("r", 4.5)
            .style({ "stroke": series.color, "fill": series.color });
        if (this.metadata.xaxis.datatype === "string") {
            dots.attr("cx", function (d) { return scalex(d[_this.metadata.xaxis.id]) + scale2(series.id) + scale2.rangeBand() / 2; })
                .attr("cy", function (d) { return scaley(d[series.id]); });
        }
        else {
            dots.attr("cx", function (d) { return scalex(d[series.id]); })
                .attr("cy", function (d) { return scaley(d[yaxisname]) + scaley.rangeBand() / 2; });
        }
        dots.on("mouseover", function (d) { if (_this.metadata.showTooltip) {
            _this.tooltipevent.emit({ value: { "func": "mouseover", "text": scalex.invert(dots.attr("cx")) + "," + dots.attr("cy") } });
        } })
            .on("mouseout", function (d) { _this.tooltipevent.emit({ value: { "func": "mouseout" } }); });
    };
    return WComboSeriesComponent;
}());
__decorate([
    core_1.Input("metadata"),
    __metadata("design:type", chartdtos_1.Meta)
], WComboSeriesComponent.prototype, "metadata", void 0);
__decorate([
    core_1.Input("metaseries"),
    __metadata("design:type", Array)
], WComboSeriesComponent.prototype, "metaseries", void 0);
__decorate([
    core_1.Input("scale"),
    __metadata("design:type", Object)
], WComboSeriesComponent.prototype, "scale", void 0);
__decorate([
    core_1.Input("height"),
    __metadata("design:type", Object)
], WComboSeriesComponent.prototype, "height", void 0);
__decorate([
    core_1.Input("width"),
    __metadata("design:type", Object)
], WComboSeriesComponent.prototype, "width", void 0);
__decorate([
    core_1.Output("tooltipevent"),
    __metadata("design:type", Object)
], WComboSeriesComponent.prototype, "tooltipevent", void 0);
__decorate([
    core_1.Output("axismovementevent"),
    __metadata("design:type", Object)
], WComboSeriesComponent.prototype, "axismovementevent", void 0);
WComboSeriesComponent = __decorate([
    core_1.Component({
        selector: 'g.wcomboseries',
        template: '',
        providers: [chartutils_1.ScaleUtil]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ElementRef, chartutils_1.ScaleUtil, data_service_1.DataService])
], WComboSeriesComponent);
exports.WComboSeriesComponent = WComboSeriesComponent;
//# sourceMappingURL=wcomboseries.component.js.map