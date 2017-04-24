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
var d3 = require("d3");
var W3DDonutSeriesComponent = (function () {
    function W3DDonutSeriesComponent(elementRef, dataService) {
        this.elementRef = elementRef;
        this.dataService = dataService;
        console.log("Initalizing constructor WPieSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    W3DDonutSeriesComponent.prototype.ngOnChanges = function () {
        if (!this.metadata)
            return;
        this.d3Element.selectAll("*").remove();
        var x = [];
        var y, rx, ry, h, ir;
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
            this.drawseries(element, x, y, rx, ry, h, ir);
        }
    };
    W3DDonutSeriesComponent.prototype.drawseries = function (series, x, y, rx, ry, h, ir) {
        var d3Element = d3.select(this.elementRef.nativeElement);
        var color = this.colorscales(this.metadata.graphColor);
        var val = series.id;
        var _data = d3.layout.pie().sort(null).value(function (d) { return d.value; })(this.dataService.data);
        var slices = d3.select("#").append("g").attr("transform", "translate(" + x + "," + y + ")")
            .attr("class", "slices");
        slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
            .style("fill", function (d, i) { return color(x[i]).darker(0.7); })
            .attr("d", function (d) { return this.pieInner(d, rx + 0.5, ry + 0.5, h, ir); })
            .each(function (d) { this._current = d; });
        // var pie = d3.layout.pie().sort(null).value((d:any)=> {return d[val]; });
        // var  radius = Math.min(this.width, this.height) / 2;
        // var labelArc = d3.svg.arc().outerRadius(radius ).innerRadius(radius - 20);
        // var arc = d3.svg.arc().outerRadius(radius + 10) .innerRadius(60);
        // var g=  d3Element. selectAll(".arc")
        //     .data(pie(this.dataService.data))
        //     .enter().append("g")
        //     .attr({"transform":"translate(" + this.width / 2 + "," + this.height / 2 + ")","class":"arc"});
        //  if(this.metadata.animeReq){
        //      g.append("path") 
        //         .style("fill", function(d,i) {return color(x[i]); }).attr("stroke-width",2)
        //         .transition().delay(function(d, i) { return i * 200; }).duration(200)
        //         .attrTween('d', function(d) { 
        //         var i = d3.interpolate(d.startAngle+0.1, d.endAngle); 
        //         return function(T) { 
        //             d.endAngle = i(T); 
        //             return arc(d); 
        //         } 
        //     });
        //     g.append("text").transition().delay(function(d, i) { return i * 200; }).duration(200)
        //         .attr({"transform":(d)=> { return "translate(" + labelArc.centroid(d) + ")"; },"dy":".35em"})
        //         .text((d:any)=> {return d.value; }).style({"stroke":"black","stroke-width":0.5});
        //  }else{
        //       g.append("path")
        //        .attr("d", arc)
        //        .style("fill", (d,i)=> { return color(x[i]); });
        //       g.append("text")
        //          .attr("transform", (d)=> { return "translate(" + labelArc.centroid(d) + ")"; })
        //          .attr("dy", ".35em")
        //          .text((d)=> { return d.value; }).style({"stroke":"black","stroke-width":0.5});
        //  }
    };
    W3DDonutSeriesComponent.prototype.pieTop = function (d, rx, ry, ir) {
        if (d.endAngle - d.startAngle == 0)
            return "M 0 0";
        var sx = rx * Math.cos(d.startAngle), sy = ry * Math.sin(d.startAngle), ex = rx * Math.cos(d.endAngle), ey = ry * Math.sin(d.endAngle);
        var ret = [];
        ret.push("M", sx, sy, "A", rx, ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "1", ex, ey, "L", ir * ex, ir * ey);
        ret.push("A", ir * rx, ir * ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "0", ir * sx, ir * sy, "z");
        return ret.join(" ");
    };
    W3DDonutSeriesComponent.prototype.pieOuter = function (d, rx, ry, h) {
        var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);
        var sx = rx * Math.cos(startAngle), sy = ry * Math.sin(startAngle), ex = rx * Math.cos(endAngle), ey = ry * Math.sin(endAngle);
        var ret = [];
        ret.push("M", sx, h + sy, "A", rx, ry, "0 0 1", ex, h + ey, "L", ex, ey, "A", rx, ry, "0 0 0", sx, sy, "z");
        return ret.join(" ");
    };
    W3DDonutSeriesComponent.prototype.pieInner = function (d, rx, ry, h, ir) {
        var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);
        var sx = ir * rx * Math.cos(startAngle), sy = ir * ry * Math.sin(startAngle), ex = ir * rx * Math.cos(endAngle), ey = ir * ry * Math.sin(endAngle);
        var ret = [];
        ret.push("M", sx, sy, "A", ir * rx, ir * ry, "0 0 1", ex, ey, "L", ex, h + ey, "A", ir * rx, ir * ry, "0 0 0", sx, h + sy, "z");
        return ret.join(" ");
    };
    W3DDonutSeriesComponent.prototype.getPercent = function (d) {
        return (d.endAngle - d.startAngle > 0.2 ?
            Math.round(1000 * (d.endAngle - d.startAngle) / (Math.PI * 2)) / 10 + '%' : '');
    };
    W3DDonutSeriesComponent.prototype.colorscales = function (category) {
        switch (category) {
            case "category10": return d3.scale.ordinal().range(d3.scale.category10().range());
            case "category20": return d3.scale.ordinal().range(d3.scale.category20().range());
            case "category20b": return d3.scale.ordinal().range(d3.scale.category20b().range());
            case "category20c": return d3.scale.ordinal().range(d3.scale.category20c().range());
        }
    };
    return W3DDonutSeriesComponent;
}());
__decorate([
    core_1.Input("metaseries"),
    __metadata("design:type", Array)
], W3DDonutSeriesComponent.prototype, "metaseries", void 0);
__decorate([
    core_1.Input("width"),
    __metadata("design:type", Object)
], W3DDonutSeriesComponent.prototype, "width", void 0);
__decorate([
    core_1.Input("height"),
    __metadata("design:type", Object)
], W3DDonutSeriesComponent.prototype, "height", void 0);
__decorate([
    core_1.Input("metadata"),
    __metadata("design:type", Object)
], W3DDonutSeriesComponent.prototype, "metadata", void 0);
W3DDonutSeriesComponent = __decorate([
    core_1.Component({
        selector: 'g.w3donutseries',
        template: '',
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ElementRef, data_service_1.DataService])
], W3DDonutSeriesComponent);
exports.W3DDonutSeriesComponent = W3DDonutSeriesComponent;
//# sourceMappingURL=wdonut3dseries.component.js.map