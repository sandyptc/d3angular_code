import {Component,Input,Injectable,ElementRef,OnChanges} from '@angular/core';
import {DataSeries} from './helpers/chartdtos';
import {ScaleUtil} from './helpers/chartutils';
import {DataService} from './service/data.service';

import * as d3 from 'd3';
declare var Donut3D: any;

@Component({
    selector: 'g.3ddonutseries',
    template:'',
    providers:[ScaleUtil]
})

export class W3DPieSeriesComponent implements OnChanges{
       @Input("metaseries") metaseries:DataSeries[];
    d3Element: d3.Selection<any>;
    @Input ("width")width:any;
    @Input ("height")height:any;
    @Input("metadata")metadata:any;
      
    constructor(public elementRef:ElementRef,public dataService:DataService){
        console.log("Initalizing constructor WPieSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    
    ngOnChanges(){  
        if(!this.metadata) return;
        this.d3Element.selectAll("*").remove();
        var x:any=[];
        for(var i=0;i <this.metadata.dataSeriesList.length;i++){
           var ele=this.metadata.dataSeriesList[i];
           if(ele.datatype=='string'){
                for(var i=0;i <ele.extent.length;i++){
                    x[i]=ele.extent[i];
                }
           }
       }
       for (var index = 0; index < this.metaseries.length; index++) {
            var element = this.metaseries[index];
            if(element.datatype=='string'){
                continue;
            }
                this.drawseries(element,x);    
       }
   } 
   
           drawseries(series:DataSeries,x:any){ 
       
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
    
        var svg = d3.select("body").append("svg").attr("width",500).attr("height",300);
                  svg.append("g").attr("id","Donutpie");
                 // svg.append("g").attr("id","quotesDonut");

          Donut3D.draw("Donutpie",this.randomData(series,x), 150, 150, 130, 100, 30, 0.4);
         // Donut3D.draw("quotesDonut",this.randomData(series,x), 450, 150, 130, 100, 30, 0);
          
          
       
        
        
        
//  }
   }
   
   
     randomData(series:any,x:any){
      // var color:any=this.colorscales(this.metadata.graphColor);
    //  var val=series.id;
        //var pie = d3.layout.pie().sort(null).value((d:any)=> {return d[val]; });
        var color:any=this.colorscales(this.metadata.graphColor);
	       return this.dataService.data.map(function(d,i){
		   return {value:d.value, color:color(x[i])};});
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
   }
      
       colorscales(category){        
        switch(category){
            case "category10":return d3.scale.ordinal().range(d3.scale.category10().range());
            case "category20":return d3.scale.ordinal().range(d3.scale.category20().range());
            case "category20b":return d3.scale.ordinal().range(d3.scale.category20b().range());
            case "category20c":return d3.scale.ordinal().range(d3.scale.category20c().range());
        }
    } //  svg.append("g").attr("id","quotesDonut");
      // svg.append("g").attr("id","salesDonut");
        //svg.append("g").attr("id","quotesDonut");
        // var d3Element:any = d3.select(this.elementRef.nativeElement);
        // var color:any=this.colorscales(this.metadata.graphColor);
        // var val=series.id;
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
    
    
       
//     colorscales(category){        
//         switch(category){
//             case "category10":return d3.scale.ordinal() .range(d3.scale.category10().range());
//             case "category20":return d3.scale.ordinal() .range(d3.scale.category20().range());
//             case "category20b":return d3.scale.ordinal() .range(d3.scale.category20b().range());
//             case "category20c":return d3.scale.ordinal() .range(d3.scale.category20c().range());
//         }
//    }
}
