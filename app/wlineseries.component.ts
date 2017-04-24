import {Component,Input,Injectable,ElementRef,OnChanges,Output,EventEmitter} from '@angular/core';
import {DataSeries} from './helpers/chartdtos';
import {ScaleUtil} from './helpers/chartutils';
import {DataService} from './service/data.service';

import * as d3 from 'd3';

@Component({
    selector: 'g.wlineseries',
    template:'',
    providers:[ScaleUtil]
})
@Injectable()
export class WLineSeriesComponent implements OnChanges{ 
    @Input("metaseries") metaseries:DataSeries[];
    d3Element: d3.Selection<any>;
    @Input("scale") scale:any;
    @Input("metadata")metadata:any;
    @Input ("width")width:any;
    @Input ("height")height:any;

    @Output("tooltipevent") tooltipevent = new EventEmitter();
     @Output("axismovementevent") axismovementevent = new EventEmitter();    

    
    constructor(public elementRef:ElementRef,public scaleUtil:ScaleUtil,public dataService:DataService){
        console.log("Initalizing constructor WLineSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    
    ngOnChanges(){  
        if(!this.metadata) return;
        this.d3Element.selectAll("*").remove();
        if(this.metaseries.length <1) return;
        if(this.scale){
           for (var index = 0; index < this.metaseries.length; index++) {
           var element = this.metaseries[index];
            if(element.datatype=='string') continue;
               this.drawseries(element);    
           }
        }
    } 
    
    drawseries(series:DataSeries) {
        var scalex=this.scale.scalex;
        var scaley=this.scale.scaley;
        var xaxisname=this.metadata.xaxis.id;
        var yaxisname= this.metadata.yaxis.id;
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", "none");
        var line = d3.svg.line();
            if(this.metadata.xaxis.datatype==="string"){
                line.x((d) => { return scalex(d[this.metadata.xaxis.id])+scalex.rangeBand()/2; })
                    .y((d) =>{ return scaley(d[series.id]); });             
            }else{

                line.x((d)=>{return scalex(d[series.id]);})
                    .y((d)=>{return scaley(d[yaxisname])+scaley.rangeBand()/2; });
            }
      
        var path=this.d3Element.append("path")
                .datum(this.dataService.data)
        var xx:boolean=true,x=series.id;
            for(var i=0;i <this.dataService.data.length;i++){
                var ele=this.dataService.data[i];
                if(ele[x] <0){
                    xx=false;
                    if(this.metadata.xaxis.datatype==='string'){
                        this.axismovementevent.emit({value:{"axisType":this.metadata.xaxis.axistype,"scaleValue":this.scale.scaley(0)}});
                    }else{
                        this.axismovementevent.emit({value:{"axisType":this.metadata.yaxis.axistype,"scaleValue":this.scale.scalex(0)}});
                    }
                }
          }
          if(this.metadata.animeReq){
            path.attr({"class":"line","fill":"none", "stroke":series.color,"d": line});
            var totalLength = 0;
            path.each(function(d) {
                d.totalLength = this.getTotalLength();
                totalLength =d.totalLength;
            });
        
            var ln=path.attr({"stroke-dasharray": totalLength + " " + totalLength,"stroke-dashoffset": totalLength});
            ln.transition().duration(2000).ease("linear").attr("stroke-dashoffset", 0);
          }else{
                 path.attr({"class":"line","fill":"none","stroke":series.color,"d": line}).transition().delay(200);
          }

                 
            // Add the scatterplot
            var dots=this.d3Element.selectAll(".dot")
                .data(this.dataService.data)
                .enter().append("circle")
                .attr("r", 4.5)
                .style({"stroke":series.color,"fill":series.color});
                
            if(this.metadata.xaxis.datatype==="string"){
                dots.attr("cx", (d)=> { return scalex(d[this.metadata.xaxis.id])+scalex.rangeBand()/2; })
                .attr("cy", (d)=> { return scaley(d[series.id]); });         
            }else{
                dots.attr("cx", (d)=> { return scalex(d[series.id]);})
                .attr("cy", (d)=> { return scaley(d[yaxisname])+scaley.rangeBand()/2;});
            }
        dots.on("mouseover",(d)=>{if(this.metadata.showTooltip){this.tooltipevent.emit({value:{"func":"mouseover","text":scalex.invert(dots.attr("cx"))+","+dots.attr("cy")}})}})
          .on("mouseout",(d)=>{this.tooltipevent.emit({value:{"func":"mouseout"}})})
        //}
    }
} 