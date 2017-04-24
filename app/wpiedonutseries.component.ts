import {Component,Input,Injectable,ElementRef,OnChanges} from '@angular/core';
import {DataSeries} from './helpers/chartdtos';
import {DataService} from './service/data.service';

import * as d3 from 'd3';

@Component({
    selector: 'g.wpiedonutseries',
    template:'',
})

@Injectable()
export class WPieDonutSeriesComponent implements OnChanges{
    
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
        var d3Element:any = d3.select(this.elementRef.nativeElement);
        var color:any=this.colorscales(this.metadata.graphColor);
        var val=series.id;
        var pie = d3.layout.pie().sort(null).value((d:any)=> {return d[val]; });
        var  radius = Math.min(this.width, this.height) / 2;
        var labelArc = d3.svg.arc().outerRadius(radius ).innerRadius(radius - 20);
        var arc = d3.svg.arc().outerRadius(radius + 10) .innerRadius(60);
        var g=  d3Element. selectAll(".arc")
            .data(pie(this.dataService.data))
            .enter().append("g")
            .attr({"transform":"translate(" + this.width / 2 + "," + this.height / 2 + ")","class":"arc"});
         
         if(this.metadata.animeReq){
             g.append("path") 
                .style("fill", function(d,i) {return color(x[i]); }).attr("stroke-width",2)
                .transition().delay(function(d, i) { return i * 200; }).duration(200)
                .attrTween('d', function(d) { 
                var i = d3.interpolate(d.startAngle+0.1, d.endAngle); 
                return function(T) { 
                    d.endAngle = i(T); 
                    return arc(d); 
                } 
            });
        
            g.append("text").transition().delay(function(d, i) { return i * 200; }).duration(200)
                .attr({"transform":(d)=> { return "translate(" + labelArc.centroid(d) + ")"; },"dy":".35em"})
                .text((d:any)=> {return d.value; }).style({"stroke":"black","stroke-width":0.5});
         }else{
              g.append("path")
               .attr("d", arc)
               .style("fill", (d,i)=> { return color(x[i]); });
                 
              g.append("text")
                 .attr("transform", (d)=> { return "translate(" + labelArc.centroid(d) + ")"; })
                 .attr("dy", ".35em")
                 .text((d)=> { return d.value; }).style({"stroke":"black","stroke-width":0.5});
         }
    }
    colorscales(category){        
        switch(category){
            case "category10":return d3.scale.ordinal() .range(d3.scale.category10().range());
            case "category20":return d3.scale.ordinal() .range(d3.scale.category20().range());
            case "category20b":return d3.scale.ordinal() .range(d3.scale.category20b().range());
            case "category20c":return d3.scale.ordinal() .range(d3.scale.category20c().range());
        }
   }
}