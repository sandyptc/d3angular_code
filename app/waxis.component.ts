import {Component,Input,Output,Injectable,Inject,EventEmitter,ElementRef,OnChanges,ViewChild,OnInit,AfterViewInit,Directive} from '@angular/core';
import {Meta,XAxis,YAxis,Axis} from './helpers/chartdtos';
import {DataService} from './service/data.service';
import {ScaleUtil,DataProcessor} from './helpers/chartutils';

import * as d3 from 'd3';

@Component({
    selector: 'g.waxis',
    template:'',
    providers:[ScaleUtil]
})
@Injectable()
export class WAxisComponent implements OnChanges{ 
    @Input("height") height;
    @Input("width") width;
    @Input("metadata") metadata:Meta;
    @Input("scale") scale:any;
    @Input("updatechart") updatechart:number;
    @Output("scaleevent") scaleevent = new EventEmitter();    
    d3Element: d3.Selection<any>;
    
    constructor(public elementRef:ElementRef,public scaleUtil:ScaleUtil,public dataProcessor:DataProcessor){
        console.log("Initalizing constructor WAxisComponent");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    ngOnChanges(){
        if(!this.metadata) return;
        console.log("ngOnChanges WAxisComponent"+this.metadata);
        
        this.d3Element.selectAll("*").remove();
        if(this.metadata.graphType!=='pie' && this.metadata.graphType!=='donutpie'){
            this.scale.scalex=this.createAxis(this.metadata.xaxis);
            this.scale.scaley=this.createAxis(this.metadata.yaxis);
        }
    }
    createAxis(metaaxis:Axis){
        var wdth=this.width;
        switch(this.elementRef.nativeElement.closest('.cols').classList[1]){
            case "small":wdth=parseInt(this.width)-40;break;
            case "medium":wdth=parseInt(this.width)-10;break;
            case "large":wdth=parseInt(this.width)+30;break;
            case "full":wdth=parseInt(this.width)+60;break;
        }
        var scale=this.scaleUtil.createScale(this.metadata,metaaxis,parseInt(wdth),parseInt(this.height));
        var axis = d3.svg.axis().scale(scale).orient(metaaxis.orient);
        if(metaaxis.minticksreq){
            if(metaaxis.axistype==='xaxis'){
                if(metaaxis.orient==='bottom'){
                    axis.tickSize(-this.height);
                }else{
                    axis.tickSize(this.height);
                }
            }else{
                if(metaaxis.orient==='left'){
                    axis.tickSize(-this.width);
                }else{
                    axis.tickSize(this.width);
                }
            }
        }
        this.d3Element
            .append("g")
            .attr("class", metaaxis.axistyleclass.join(" "))
            .attr("transform", this.replace(metaaxis.transform,{"first":0,"second":this.height}))    
            .call(axis).style({"fill":"none","stroke":"black","shape-rendering":"crispEdges"});
       return scale;
    } 
    
   //TODO:Change this to better logic
    replace(replacestr:string,data:any):string{
        if(!replacestr) return "";
        for (var key in data) {
           if (data.hasOwnProperty(key)) {
               var rex = new RegExp("\\$"+key+"\\$"); 
               var element = data[key];
               replacestr=replacestr.replace(rex, element);
           }
       }    
        return replacestr;
    } 

    
} 


