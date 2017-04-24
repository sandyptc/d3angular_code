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
var d3 = require("d3");
var WAxisComponent = (function () {
    function WAxisComponent(elementRef, scaleUtil, dataProcessor) {
        this.elementRef = elementRef;
        this.scaleUtil = scaleUtil;
        this.dataProcessor = dataProcessor;
        this.scaleevent = new core_1.EventEmitter();
        console.log("Initalizing constructor WAxisComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    WAxisComponent.prototype.ngOnChanges = function () {
        if (!this.metadata)
            return;
        console.log("ngOnChanges WAxisComponent" + this.metadata);
        this.d3Element.selectAll("*").remove();
        if (this.metadata.graphType !== 'pie' && this.metadata.graphType !== 'donutpie') {
            this.scale.scalex = this.createAxis(this.metadata.xaxis);
            this.scale.scaley = this.createAxis(this.metadata.yaxis);
        }
    };
    WAxisComponent.prototype.createAxis = function (metaaxis) {
        var wdth = this.width;
        switch (this.elementRef.nativeElement.closest('.cols').classList[1]) {
            case "small":
                wdth = parseInt(this.width) - 40;
                break;
            case "medium":
                wdth = parseInt(this.width) - 10;
                break;
            case "large":
                wdth = parseInt(this.width) + 30;
                break;
            case "full":
                wdth = parseInt(this.width) + 60;
                break;
        }
        var scale = this.scaleUtil.createScale(this.metadata, metaaxis, parseInt(wdth), parseInt(this.height));
        var axis = d3.svg.axis().scale(scale).orient(metaaxis.orient);
        if (metaaxis.minticksreq) {
            if (metaaxis.axistype === 'xaxis') {
                if (metaaxis.orient === 'bottom') {
                    axis.tickSize(-this.height);
                }
                else {
                    axis.tickSize(this.height);
                }
            }
            else {
                if (metaaxis.orient === 'left') {
                    axis.tickSize(-this.width);
                }
                else {
                    axis.tickSize(this.width);
                }
            }
        }
        this.d3Element
            .append("g")
            .attr("class", metaaxis.axistyleclass.join(" "))
            .attr("transform", this.replace(metaaxis.transform, { "first": 0, "second": this.height }))
            .call(axis).style({ "fill": "none", "stroke": "black", "shape-rendering": "crispEdges" });
        return scale;
    };
    //TODO:Change this to better logic
    WAxisComponent.prototype.replace = function (replacestr, data) {
        if (!replacestr)
            return "";
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var rex = new RegExp("\\$" + key + "\\$");
                var element = data[key];
                replacestr = replacestr.replace(rex, element);
            }
        }
        return replacestr;
    };
    return WAxisComponent;
}());
__decorate([
    core_1.Input("height"),
    __metadata("design:type", Object)
], WAxisComponent.prototype, "height", void 0);
__decorate([
    core_1.Input("width"),
    __metadata("design:type", Object)
], WAxisComponent.prototype, "width", void 0);
__decorate([
    core_1.Input("metadata"),
    __metadata("design:type", chartdtos_1.Meta)
], WAxisComponent.prototype, "metadata", void 0);
__decorate([
    core_1.Input("scale"),
    __metadata("design:type", Object)
], WAxisComponent.prototype, "scale", void 0);
__decorate([
    core_1.Input("updatechart"),
    __metadata("design:type", Number)
], WAxisComponent.prototype, "updatechart", void 0);
__decorate([
    core_1.Output("scaleevent"),
    __metadata("design:type", Object)
], WAxisComponent.prototype, "scaleevent", void 0);
WAxisComponent = __decorate([
    core_1.Component({
        selector: 'g.waxis',
        template: '',
        providers: [chartutils_1.ScaleUtil]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ElementRef, chartutils_1.ScaleUtil, chartutils_1.DataProcessor])
], WAxisComponent);
exports.WAxisComponent = WAxisComponent;
//# sourceMappingURL=waxis.component.js.map