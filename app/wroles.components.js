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
var WRolesComponent = (function () {
    function WRolesComponent(elementRef, scaleUtil, dataService, dp) {
        this.elementRef = elementRef;
        this.scaleUtil = scaleUtil;
        this.dataService = dataService;
        this.dp = dp;
        this.rolesbased = new core_1.EventEmitter();
        console.log("Initalizing constructor WLegend Component");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    WRolesComponent.prototype.ngOnChanges = function () {
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
            //    if(this.metadata.graphType==='pie'||this.metadata.graphType==='donutpie'){
            //        if(element.showseries){
            //            if(this.metadata.graphType==='pie' && pi==0){
            //                this. drawLegend(element,x);
            //                pi++;
            //            }else if(this.metadata.graphType==='donutpie' && di==0){
            //                this. drawLegend(element,x);
            //                di++;
            //            }
            //        }
            //    }else{
            this.checkroles(element, x);
            // }
        }
    };
    WRolesComponent.prototype.checkroles = function (series, x) {
        var colorSeries = this.metadata.dataSeriesList.filter(function (s) { return s.datatype == series.datatype; });
        for (var i = 0; i <= colorSeries.length; i++) { }
        // if (colorSeries.=="user"){
        //  }
    };
    return WRolesComponent;
}());
__decorate([
    core_1.Input("width"),
    __metadata("design:type", Object)
], WRolesComponent.prototype, "width", void 0);
__decorate([
    core_1.Input("metadata"),
    __metadata("design:type", chartdtos_1.Meta)
], WRolesComponent.prototype, "metadata", void 0);
__decorate([
    core_1.Input("updatechart"),
    __metadata("design:type", Number)
], WRolesComponent.prototype, "updatechart", void 0);
__decorate([
    core_1.Output("rolesbased"),
    __metadata("design:type", Object)
], WRolesComponent.prototype, "rolesbased", void 0);
WRolesComponent = __decorate([
    core_1.Component({
        selector: 'g.wroles',
        template: '',
        providers: [chartutils_1.ScaleUtil]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ElementRef, chartutils_1.ScaleUtil, data_service_1.DataService, chartutils_1.DataProcessor])
], WRolesComponent);
exports.WRolesComponent = WRolesComponent;
//if(this.metadata.legendPos!=='ds'){
//  var aratio=1;
// if(this.width <290){
//      aratio=this.width/290;
//   }
//                 this.d3Element.selectAll(".legend").remove();
//                 var colorSeries=this.metadata.dataSeriesList.filter((s)=>{ return s.datatype==series.datatype});
//                 var legend = this.d3Element.selectAll("g").data(colorSeries).enter().append('g').attr('class', 'legend'); 
//                 var rect=legend.append('rect')
//                             .attr({'y':6,'x':(d, i)=>{return (i*60*aratio)+10;},'width': 10,'height': 10,'class':'rect'})
//                         //     .attr("",(d)=>{})
//                             .style("stroke",(d,i)=>{return colorSeries[i].color})
//                             .style("stroke-width",2)
//                             .style('fill',(d,i)=>{if(colorSeries[i].showseries){return colorSeries[i].color}else{return "white";}})             
//                          // .attr(this.metadata.roles,(d)=>{}) 
//                             .attr("id",(d,i)=>{return colorSeries[i].id;})
//                    //     .attr("roles",(d,i)=>{if(this.metadata.roles=="user"){if(colorSeries[i].id="value2"){return colorSeries[2].showseries=false;}else{return colorSeries[i].showseries=true;}}})
//                             // .attr("roles",(d,i)=>{return colorSeries[i].roles})
//                           //   .attr("roles",(d,i)=>{if(d.roles="user"){if(d.id="value2"){return colorSeries[2].showseries=false;}else{return colorSeries[i].showseries=true;}}})
// //                              .attr("roles",(d,i)=>
// //    {
// //         if(this.metadata.roles=="user")
// // 		{
// // 		 // if(colorSeries[i].id="value2")
// // 		   // { 
// //                return colorSeries[2].showseries==false && colorSeries[0].showseries == true && colorSeries[1].showseries == true && colorSeries[3].showseries==true ;}
// // 			//}
// // 	else{return colorSeries[i].showseries=true;}
// // 	}
// //   )
//                              .on("click",(d,i)=>{
//                             if(d.id==colorSeries[i].id){
//                                 if(colorSeries[i].showseries){
//                                         colorSeries[i].showseries=false;
//                                 }else{
//                                     colorSeries[i].showseries=true;
//                                 }
//                             }
//                 console.log(colorSeries)
//                 this.updatechart=this.updatechart+1;
//                 this.legendclicktevent.emit({value:{"id":series.id, "roles":this.metadata.roles}}); });
//                 legend.append('text')
//                       .attr({'y': 15,'x':(d, i)=>{ return (i*60*aratio) + 24;}})
//                         .text((d,i)=>{return colorSeries[i].id; }).style({"fill":"none","stroke":"black","shape-rendering":"crispEdges"})
//                         .on("click",(d,i)=>{
//                         if(d.id==colorSeries[i].id){
//                             if(colorSeries[i].showseries){
//                                 colorSeries[i].showseries=false;
//                             }else{
//                                 colorSeries[i].showseries=true;
//                             }
//                         }
//                 console.log(colorSeries)
//                 this.updatechart=this.updatechart+1;
//                 this.legendclicktevent.emit({value:{"id":series.id,"roles":this.metadata.roles}});
//                 });
//             }
//         }else{
//             this.d3Element.selectAll(".legend").remove();
//         }
//     }
// colorscales(category){        
//     switch(category){
//         case "category10":return d3.scale.ordinal() .range(d3.scale.category10().range());
//         case "category20":return d3.scale.ordinal() .range(d3.scale.category20().range());
//         case "category20b":return d3.scale.ordinal() .range(d3.scale.category20b().range());
//         case "category20c":return d3.scale.ordinal() .range(d3.scale.category20c().range());
//# sourceMappingURL=wroles.components.js.map