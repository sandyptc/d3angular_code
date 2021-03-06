
import {Component,Input,Injectable,Inject,ElementRef,OnChanges,ViewChild,OnInit,AfterViewInit,Directive,Output,EventEmitter} from '@angular/core';
import {Meta,XAxis,YAxis,Axis,DataSeries} from './helpers/chartdtos';
import {DataService} from './service/data.service';
import {ScaleUtil} from './helpers/chartutils';

import * as d3 from 'd3';

@Component({
    selector: 'g.wcolumnseries',
    template:'',
    providers:[ScaleUtil]
})
@Injectable()
export class WColumnSeriesComponent implements OnChanges{ 
    @Input("metadata") metadata:Meta;
    @Input("metaseries") metaseries:DataSeries[];
    d3Element: d3.Selection<any>;
    @Input("scale") scale:any;
    @Input("height") height;
    @Input("width") width;
    @Output("tooltipevent") tooltipevent = new EventEmitter();
   @Output("axismovementevent") axismovementevent = new EventEmitter(); 

    constructor(public elementRef:ElementRef,public scaleUtil:ScaleUtil,public dataService:DataService){
        console.log("Initalizing constructor WColumnSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }

    ngOnChanges(){  
        if(!this.metadata) return;
        this.d3Element.selectAll("*").remove();
        console.log(this.scale);
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
        var scale2=this.scale.scalex.copy();
        scale2.domain(this.metaseries
                    .filter((series:DataSeries)=>{ return series.axistype=='yaxis'})
                    .map((series:DataSeries)=>{return series.id}));
        if(this.metadata.xaxis.datatype=='string')                    
        {
            scale2.rangeRoundBands([0,this.scale.scalex.rangeBand()]);
        }
        else{
            scale2.range([0,this.scale.scalex.rangeBand()]);
        }
    return scale2;
    }
    
    
    drawseries(series:DataSeries,scale2:any) {
        var d3Element:any = d3.select(this.elementRef.nativeElement);
        var scalex=this.scale.scalex;
        var scaley=this.scale.scaley;
        var xaxisname=this.metadata.xaxis.id
        var yaxisname=this.metadata.yaxis.id;
        var xy =  d3Element.selectAll(".bar")
            .data(this.dataService.data)
            .enter().append("g")
            .attr({"class":"rect","transform":(d)=> { return "translate(" + scalex(d[xaxisname]) + ",0)"; }})
            .append("rect")
            .attr({"x":scale2(series.id),"width":scale2.rangeBand()})
            .style("fill", (d) => { return series.color; })
            if(this.metadata.showTooltip){
                xy.on("mouseover",(d)=>{this.tooltipevent.emit({value:{"func":"mouseover","text":d[series.id],"x":scalex(d[xaxisname])+scale2(series.id),"y":this.scale.scaley(d[series.id])-20}})})
                .on("mouseout",(d)=>{this.tooltipevent.emit({value:{"func":"mouseout"}})})
            }
            var xx:boolean=true,x=series.id;
            for(var i=0;i <this.dataService.data.length;i++){
                var ele=this.dataService.data[i];
                if(ele[x] <0){
                    xx=false;
                    this.axismovementevent.emit({value:{"axisType":this.metadata.xaxis.axistype,"scaleValue":this.scale.scaley(0)}});
                }
            }
		 	if(this.metadata.animeReq){
                xy.attr({"y":(d)=>{if(xx){return this.height;}else{return scaley(0);}},"height":(d)=>{return 0;}})
                  .transition().duration(3000)
                  .attr({"y":(d,j)=> {if(xx){return this.scale.scaley(d[series.id]);}else{return Math.min(this.scale.scaley(d[series.id]),this.scale.scaley(0));}},
                        "height":(d,j)=> {if(xx){return this.height-this.scale.scaley(d[series.id]);}else{return Math.abs(this.scale.scaley(d[series.id])-this.scale.scaley(0));}}});
            }else{
                xy.transition().delay(200)
                  .attr({"y":(d,j)=> {return this.scale.scaley(d[series.id]);},"height":(d,j)=> {return this.height-this.scale.scaley(d[series.id]);}});
            }
    }
} 