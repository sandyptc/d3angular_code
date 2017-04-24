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
var W3DPieSeriesComponent = (function () {
    function W3DPieSeriesComponent(elementRef, dataService) {
        this.elementRef = elementRef;
        this.dataService = dataService;
        console.log("Initalizing constructor WPieSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    W3DPieSeriesComponent.prototype.ngOnChanges = function () {
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
    W3DPieSeriesComponent.prototype.drawseries = function (series, x) {
        //    var svg = d3.select("body").append("svg").attr("width",700).attr("height",300);
        //    svg.append("g").attr("id",series.id);
        //    Donut3D.draw(series.id, this.randomData(),this.dataService.data);
        // var svg=  this.d3Element. selectAll("body")
        //               .append("svg")
        //             .data(this.dataService.data)
        //             .enter().append("g")
        //             .attr("id","salesDonut")
        //             .attr("width",700).attr("height",300);
        //.attr({"transform":"translate(" + this.width / 2 + "," + this.height / 2 + ")","class":"arc"});
        var svg = d3.select("body").append("svg").attr("width", 500).attr("height", 300);
        svg.append("g").attr("id", "Donutpie");
        // svg.append("g").attr("id","quotesDonut");
        Donut3D.draw("Donutpie", this.randomData(series, x), 150, 150, 130, 100, 30, 0.4);
        // Donut3D.draw("quotesDonut",this.randomData(series,x), 450, 150, 130, 100, 30, 0);
        //  }
    };
    W3DPieSeriesComponent.prototype.randomData = function (series, x) {
        // var color:any=this.colorscales(this.metadata.graphColor);
        //  var val=series.id;
        //var pie = d3.layout.pie().sort(null).value((d:any)=> {return d[val]; });
        var color = this.colorscales(this.metadata.graphColor);
        return this.dataService.data.map(function (d, i) {
            return { value: d.value, color: color(x[i]) };
        });
        // function changeData(){
        // 	Donut3D.transition("salesDonut", randomData(), 130, 100, 30, 0.4);
        // 	Donut3D.transition("quotesDonut", randomData(), 130, 100, 30, 0);
        // }
        //  randomData(series:any){
        //       // var color:any=this.colorscales(this.metadata.graphColor);
        //     //  var val=series.id;
        //         //var pie = d3.layout.pie().sort(null).value((d:any)=> {return d[val]; });
        // 	return this.dataService.data.map(function(d){
        // 		return {value:d.value, color:d.id};});
        //  }
    };
    W3DPieSeriesComponent.prototype.colorscales = function (category) {
        switch (category) {
            case "category10": return d3.scale.ordinal().range(d3.scale.category10().range());
            case "category20": return d3.scale.ordinal().range(d3.scale.category20().range());
            case "category20b": return d3.scale.ordinal().range(d3.scale.category20b().range());
            case "category20c": return d3.scale.ordinal().range(d3.scale.category20c().range());
        }
    }; //  svg.append("g").attr("id","quotesDonut");
    return W3DPieSeriesComponent;
}());
__decorate([
    core_1.Input("metaseries"),
    __metadata("design:type", Array)
], W3DPieSeriesComponent.prototype, "metaseries", void 0);
__decorate([
    core_1.Input("width"),
    __metadata("design:type", Object)
], W3DPieSeriesComponent.prototype, "width", void 0);
__decorate([
    core_1.Input("height"),
    __metadata("design:type", Object)
], W3DPieSeriesComponent.prototype, "height", void 0);
__decorate([
    core_1.Input("metadata"),
    __metadata("design:type", Object)
], W3DPieSeriesComponent.prototype, "metadata", void 0);
W3DPieSeriesComponent = __decorate([
    core_1.Component({
        selector: 'g.3ddonutseries',
        template: '',
        providers: [chartutils_1.ScaleUtil]
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, data_service_1.DataService])
], W3DPieSeriesComponent);
exports.W3DPieSeriesComponent = W3DPieSeriesComponent;
//# sourceMappingURL=w3dpieseries.component.js.map