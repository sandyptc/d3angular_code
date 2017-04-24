import {Component,Input,Injectable,Inject,ElementRef,OnChanges,ViewChild,OnInit,AfterViewInit,Directive,Output,EventEmitter} from '@angular/core';
import {Meta,XAxis,YAxis,Axis,DataSeries} from './helpers/chartdtos';
import {DataService} from './service/data.service';
import {ScaleUtil} from './helpers/chartutils';

import * as d3 from 'd3';

@Component({
    selector: 'g.wareaseries',
    template:'',
    providers:[ScaleUtil]
})
@Injectable()
export class WAreaSeriesComponent implements OnChanges{ 
    @Input("metaseries") metaseries:DataSeries[];
    d3Element: d3.Selection<any>;
    @Input("scale") scale:any;
    @Input("metadata") metadata;
    @Input("height") height;
    @Input("width") width;
    @Output("axismovementevent") axismovementevent = new EventEmitter();
     
    constructor(public elementRef:ElementRef,public scaleUtil:ScaleUtil,public dataService:DataService){
        console.log("Initalizing constructor WAreaSeriesComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
   
    ngOnChanges(){  
        if(!this.metadata) return;
        this.d3Element.selectAll("*").remove();
        if(this.metaseries.length<1) return;
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
        var area = d3.svg.area();
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
        if(this.metadata.xaxis.datatype==="string"){
            area.x((d)=> { return scalex(d[this.metadata.xaxis.id])+scalex.rangeBand()/2; })
            .y0((d)=>{if(xx){return this.height}else{return scaley(0);}})
            .y1((d)=> { return scaley(d[series.id]); });
        }else{
            area.y((d)=> { return scaley(d[this.metadata.yaxis.id])+scaley.rangeBand()/2; })
            .x0((d)=>{if(xx){return 0;}else{return scalex(0);}})
            .x1((d)=> { return scalex(d[series.id]); });
        }
         
        this.d3Element.append("path")
            .datum(this.dataService.data)
            .attr({"class":"area","fill":series.color,"opacity":0.3})
            .transition().duration(3500).attr("d", area);
    }   
} 