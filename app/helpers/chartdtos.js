"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Meta = (function () {
    function Meta() {
        this.dataSeriesList = new Array();
        this.graphType = "column";
        this.graphColor = "category10";
        this.animeReq = true;
        this.showTooltip = true;
        this.dataurl = "data.json";
        this.comments = "";
        this.legendPos = "btm";
        this.bgcolor = "#fff";
    }
    return Meta;
}());
exports.Meta = Meta;
var DataSeries = (function () {
    function DataSeries() {
        //showseries:string="Y";
        this.showseries = true;
    }
    return DataSeries;
}());
exports.DataSeries = DataSeries;
var XAxis = (function () {
    function XAxis() {
        this.tickscount = 20;
        this.minticksreq = false;
        this.axistype = "xaxis";
        this.transform = "translate($first$,$second$)";
        this.datatype = "string"; //number
        this.orient = "bottom";
        this.axistyleclass = ["x axis"];
    }
    return XAxis;
}());
exports.XAxis = XAxis;
var YAxis = (function () {
    function YAxis() {
        this.tickscount = 10;
        this.minticksreq = false;
        this.orient = "left";
        this.axistyleclass = ["y axis"];
        this.axistype = "yaxis";
        this.transform = "";
        this.datatype = "string";
    }
    return YAxis;
}());
exports.YAxis = YAxis;
// import {Http} from '@angular/http'
// export class DataService{
//     meta:Meta;
//     data:any;
//     getData(){
//        return this.data;
//     }
// }
var Widget = (function () {
    function Widget() {
        this.chartTitle = "Bar Chart";
        this.chartType = "row";
        this.chartSize = "full";
        this.styleclass = "widget-container ";
        this.chartUrl = "data.json";
    }
    return Widget;
}());
exports.Widget = Widget;
//# sourceMappingURL=chartdtos.js.map