import {Component,Input,Injectable,ElementRef,OnChanges,Output,EventEmitter} from '@angular/core';
import {DataSeries} from './helpers/chartdtos';
import {ScaleUtil} from './helpers/chartutils';
import {DataService} from './service/data.service';

import * as d3 from 'd3';

@Component({
    selector: 'g.wscatterseries',
    template:'',
    providers:[ScaleUtil]
})
@Injectable()
export class WScatterSeriesComponent implements OnChanges{ 
    @Input("metaseries") metaseries:DataSeries[];
    d3Element: d3.Selection<any>;
    @Input("scale") scale:any;
    @Input("metadata")metadata:any;
    @Input ("width")width:any;
    @Input ("height")height:any;

    //@Output("tooltipevent") tooltipevent = new EventEmitter();
     @Output("axismovementevent") axismovementevent = new EventEmitter();    

    
    constructor(public elementRef:ElementRef,public scaleUtil:ScaleUtil,public dataService:DataService){
        console.log("Initalizing constructor WScatterSeriesComponent");
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
    }
} 