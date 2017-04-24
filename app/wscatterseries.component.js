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
var WScatterSeriesComponent = (function () {
    function WScatterSeriesComponent(elementRef, scaleUtil, dataService) {
        this.elementRef = elementRef;
        this.scaleUtil = scaleUtil;
        this.dataService = dataService;
        //@Output("tooltipevent") tooltipevent = new EventEmitter();
        this.axismovementevent = new core_1.EventEmitter();
        console.log("Initalizing constructor WScatterSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    WScatterSeriesComponent.prototype.ngOnChanges = function () {
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
    WScatterSeriesComponent.prototype.drawseries = function (series) {
        var _this = this;
        var scalex = this.scale.scalex;
        var scaley = this.scale.scaley;
        var xaxisname = this.metadata.xaxis.id;
        var yaxisname = this.metadata.yaxis.id;
        var dots = this.d3Element.selectAll(".dot")
            .data(this.dataService.data)
            .enter().append("circle")
            .attr("r", 4.5)
            .style({ "stroke": series.color, "fill": series.color });
        if (this.metadata.xaxis.datatype === "string") {
            dots.attr("cx", function (d) { return scalex(d[_this.metadata.xaxis.id]) + scalex.rangeBand() / 2; })
                .attr("cy", function (d) { return scaley(d[series.id]); });
        }
        else {
            dots.attr("cx", function (d) { return scalex(d[series.id]); })
                .attr("cy", function (d) { return scaley(d[yaxisname]) + scaley.rangeBand() / 2; });
        }
    };
    return WScatterSeriesComponent;
}());
__decorate([
    core_1.Input("metaseries"),
    __metadata("design:type", Array)
], WScatterSeriesComponent.prototype, "metaseries", void 0);
__decorate([
    core_1.Input("scale"),
    __metadata("design:type", Object)
], WScatterSeriesComponent.prototype, "scale", void 0);
__decorate([
    core_1.Input("metadata"),
    __metadata("design:type", Object)
], WScatterSeriesComponent.prototype, "metadata", void 0);
__decorate([
    core_1.Input("width"),
    __metadata("design:type", Object)
], WScatterSeriesComponent.prototype, "width", void 0);
__decorate([
    core_1.Input("height"),
    __metadata("design:type", Object)
], WScatterSeriesComponent.prototype, "height", void 0);
__decorate([
    core_1.Output("axismovementevent"),
    __metadata("design:type", Object)
], WScatterSeriesComponent.prototype, "axismovementevent", void 0);
WScatterSeriesComponent = __decorate([
    core_1.Component({
        selector: 'g.wscatterseries',
        template: '',
        providers: [chartutils_1.ScaleUtil]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ElementRef, chartutils_1.ScaleUtil, data_service_1.DataService])
], WScatterSeriesComponent);
exports.WScatterSeriesComponent = WScatterSeriesComponent;
//# sourceMappingURL=wscatterseries.component.js.map