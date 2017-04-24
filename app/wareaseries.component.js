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
var data_service_1 = require("./service/data.service");
var chartutils_1 = require("./helpers/chartutils");
var d3 = require("d3");
var WAreaSeriesComponent = (function () {
    function WAreaSeriesComponent(elementRef, scaleUtil, dataService) {
        this.elementRef = elementRef;
        this.scaleUtil = scaleUtil;
        this.dataService = dataService;
        this.axismovementevent = new core_1.EventEmitter();
        console.log("Initalizing constructor WAreaSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    WAreaSeriesComponent.prototype.ngOnChanges = function () {
        if (!this.metadata)
            return;
        this.d3Element.selectAll("*").remove();
        if (this.metaseries.length < 1)
            return;
        if (this.scale) {
            for (var index = 0; index < this.metaseries.length; index++) {
                var element = this.metaseries[index];
                if (element.datatype == 'string')
                    continue;
                this.drawseries(element);
            }
        }
    };
    WAreaSeriesComponent.prototype.drawseries = function (series) {
        var _this = this;
        var scalex = this.scale.scalex;
        var scaley = this.scale.scaley;
        var area = d3.svg.area();
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
        if (this.metadata.xaxis.datatype === "string") {
            area.x(function (d) { return scalex(d[_this.metadata.xaxis.id]) + scalex.rangeBand() / 2; })
                .y0(function (d) { if (xx) {
                return _this.height;
            }
            else {
                return scaley(0);
            } })
                .y1(function (d) { return scaley(d[series.id]); });
        }
        else {
            area.y(function (d) { return scaley(d[_this.metadata.yaxis.id]) + scaley.rangeBand() / 2; })
                .x0(function (d) { if (xx) {
                return 0;
            }
            else {
                return scalex(0);
            } })
                .x1(function (d) { return scalex(d[series.id]); });
        }
        this.d3Element.append("path")
            .datum(this.dataService.data)
            .attr({ "class": "area", "fill": series.color, "opacity": 0.3 })
            .transition().duration(3500).attr("d", area);
    };
    return WAreaSeriesComponent;
}());
__decorate([
    core_1.Input("metaseries"),
    __metadata("design:type", Array)
], WAreaSeriesComponent.prototype, "metaseries", void 0);
__decorate([
    core_1.Input("scale"),
    __metadata("design:type", Object)
], WAreaSeriesComponent.prototype, "scale", void 0);
__decorate([
    core_1.Input("metadata"),
    __metadata("design:type", Object)
], WAreaSeriesComponent.prototype, "metadata", void 0);
__decorate([
    core_1.Input("height"),
    __metadata("design:type", Object)
], WAreaSeriesComponent.prototype, "height", void 0);
__decorate([
    core_1.Input("width"),
    __metadata("design:type", Object)
], WAreaSeriesComponent.prototype, "width", void 0);
__decorate([
    core_1.Output("axismovementevent"),
    __metadata("design:type", Object)
], WAreaSeriesComponent.prototype, "axismovementevent", void 0);
WAreaSeriesComponent = __decorate([
    core_1.Component({
        selector: 'g.wareaseries',
        template: '',
        providers: [chartutils_1.ScaleUtil]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ElementRef, chartutils_1.ScaleUtil, data_service_1.DataService])
], WAreaSeriesComponent);
exports.WAreaSeriesComponent = WAreaSeriesComponent;
//# sourceMappingURL=wareaseries.component.js.map