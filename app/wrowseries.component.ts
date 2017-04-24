import {Component,Input,Injectable,ElementRef,OnChanges,Output,EventEmitter} from '@angular/core';
import {Meta,DataSeries} from './helpers/chartdtos';
import {ScaleUtil} from './helpers/chartutils';
import {DataService} from './service/data.service';

import * as d3 from 'd3';

@Component({
    selector: 'g.wrowseries',
    template:'',
    providers:[ScaleUtil]
})
@Injectable()
export class WRowSeriesComponent implements OnChanges{ 
    @Input("metadata") metadata:Meta;
    @Input("metaseries") metaseries:DataSeries[];
    d3Element: d3.Selection<any>;
    @Input("scale") scale:any;
    @Input("height") height;
    @Input("width") width;
    @Output("tooltipevent") tooltipevent = new EventEmitter();
    @Output("axismovementevent") axismovementevent = new EventEmitter();    
    
    
    constructor(public elementRef:ElementRef,public scaleUtil:ScaleUtil,public dataService:DataService){
        console.log("Initalizing constructor WRowSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    
  ngOnChanges(){  
      if(!this.metadata) return;
        this.d3Element.selectAll("*").remove();
        if(this.metaseries.length <1) return;
        if(this.scale){
                var scale2 = this.createInnerScale();
            for (var index = 0; index < this.metaseries.length; index++) {
                var element = this.metaseries[index];
                 if(element.datatype=='string') continue;
                this.drawseries(element,scale2);   
            }
        }
     } 
     
      createInnerScale(){
        var scale2=this.scale.scaley.copy();
        scale2.domain(this.metaseries
                    .filter((series:DataSeries)=>{ return series.axistype=='xaxis'})
                    .map((series:DataSeries)=>{return series.id}));
        if(this.metadata.yaxis.datatype=='string')                    
        {
            scale2.rangeRoundBands([this.scale.scaley.rangeBand(),0]);
        }
        else{
            scale2.range([this.scale.scaley.rangeBand(),0]);
        }
    return scale2;
    }
    
    drawseries(series:DataSeries,scale2:any) {
        var d3Element:any = d3.select(this.elementRef.nativeElement);
        var scalex=this.scale.scalex;
        var scaley=this.scale.scaley;
        var xaxisname=this.metadata.xaxis.id;
        var yaxisname=this.metadata.yaxis.id;
        var xy=this.d3Element.selectAll(".bar")
            .data(this.dataService.data)
            .enter().append("g")
            .attr("class","rect")
            .append("rect")
            .attr({"transform":(d)=> {return "translate(0," + scaley(d[yaxisname]) + ")"; },"height":scale2.rangeBand(),"y":scale2(series.id)})
            .style("fill", (d) => { return series.color; })
            if(this.metadata.showTooltip){
                xy.on("mouseover",(d)=>{this.tooltipevent.emit({value:{"func":"mouseover","text":d[series.id],"y":scaley(d[yaxisname])+scale2(series.id),"x": scalex(d[series.id])}})})
                .on("mouseout",(d)=>{this.tooltipevent.emit({value:{"func":"mouseout"}})})
            }
            
            var xx:boolean=true,x=series.id;
            for(var i=0;i <this.dataService.data.length;i++){
                var ele=this.dataService.data[i];
                if(ele[x] <0){
                    xx=false;
                    this.axismovementevent.emit({value:{"axisType":this.metadata.yaxis.axistype,"scaleValue":this.scale.scalex(0)}});
                }
            }
            if(this.metadata.animeReq){
                xy.attr({"x":(d)=>{if(xx){return 0;}else{return scalex(0)}},"width":(d)=>{return 0;}})
                  .transition()
			      .duration(3000)
                  .attr({"x":(d)=> {if(xx){return scale2(d[xaxisname]);}else{return Math.min(scalex(d[series.id]),scalex(0));}},
                        "width":(d)=> {if(xx){return scalex(d[series.id])>0?scalex(d[series.id]):0;}else{return Math.abs(scalex(d[series.id])-scalex(0));}}})
            }else{
                 xy.transition().delay(200)
                  .attr({"x":(d)=> {return scale2(d[xaxisname]);},"width":(d)=> {return scalex(d[series.id])>0?scalex(d[series.id]):0;}})
            }
         }
}    
           

         
      



