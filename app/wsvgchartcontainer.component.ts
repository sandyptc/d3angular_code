import {Component,Input,Injectable,Inject,ElementRef,OnChanges,ViewChild,OnInit,AfterViewInit} from '@angular/core';
import { WAxisComponent } from './waxis.component';
import { WColumnSeriesComponent } from './wcolumnseries.component';
import {WRowSeriesComponent} from './wrowseries.component';
import {WLineSeriesComponent} from './wlineseries.component';
import {WAreaSeriesComponent} from './wareaseries.component'
import {WPieSeriesComponent} from './wpieseries.component';
import {WLegendComponent} from './wlegend.component';
import {WPieDonutSeriesComponent} from  './wpiedonutseries.component';
import {WComboSeriesComponent} from './wcomboseries.component';
import {WScatterSeriesComponent} from './wscatterseries.component';
import {WStackedColumnSeriesComponent} from './wstackedcolumnseries.component';
import { Axis,XAxis,YAxis,Meta,DataSeries} from './helpers/chartdtos';
import {DataService} from './service/data.service';
import * as d3 from 'd3';

//import 'jspdf';

@Component({
    selector: 'wsvgchartcontainer',
    template:`  <svg class="svgchart" #svgchart [attr.height]="svgheight">
                <g class="wcontainer" [attr.transform]="transform">
                    <g class="waxis" [metadata]="metadata" [scale]="scale" [width]="width" [height]="height"  [updatechart]="updatechart"></g>
                    <g class="wseries">
                      <g class="wcolumnseries"  (axismovementevent)="axisMovement($event);"  (tooltipevent)="tooltipUpdated($event)" [width]="width" [height]="height" [scale]="scale" [metadata]="metadata"  [metaseries]="columnseries" ></g>
                       <g class="wareaseries" [width]="width" [height]="height" [scale]="scale" [metadata]="metadata"  [metaseries]="areaseries" ></g>
                       <g class="wrowseries"  (axismovementevent)="axisMovement($event);"  (tooltipevent)="tooltipUpdated($event)"  [width]="width" [height]="height" [scale]="scale" [metadata]="metadata"  [metaseries]="rowseries" ></g>
                       <g class="wlineseries"    (axismovementevent)="axisMovement($event);"   [width]="width" [height]="height" [scale]="scale" [metadata]="metadata"  [metaseries]="lineseries" ></g> 
                       <g class="wpieseries" [metadata]="metadata" [width]="width" [height]="height" [metaseries]="pieseries" ></g>
                       <g class="wpiedonutseries" [metadata]="metadata" [width]="width" [height]="height" [metaseries]="donutseries" ></g>
                       <g class="wcomboseries"  (axismovementevent)="axisMovement($event);"   (tooltipevent)="tooltipUpdated($event)" [width]="width" [height]="height" [scale]="scale" [metadata]="metadata"  [metaseries]="comboseries" ></g>
                       <g class="wscatterseries" (axismovementevent)="axisMovement($event);" [width]="width" [height]="height" [scale]="scale" [metadata]="metadata"  [metaseries]="scatterseries" ></g>
                       <g class="wstackedcolumnseries" [height]="height" 
                            [scale]="scale" [metadata]="metadata"  
                            [metaseries]="stackedseries">
                       </g>
                    </g>
                </g>
              </svg>
               <div class="tooltip" style="display:none"></div>
             
                <div width="300px" class="comments"></div>
               <svg #svgchart1  [attr.width]="svgwidth" [attr.height]="svgheight1">
                          <g class="wlegend"  (legendclicktevent)= "legendClick($event);" [metadata]="metadata" [updatechart]="updatechart" [width]="svgwidth1"> 
                          </g>
                </svg> 
               `
}) 
@Injectable()
export class WSvgChartContainer implements OnChanges{
    
    
    @Input("height") height;
    @Input("width") width;
    @Input("metadata") metadata:Meta;
    @Input("updatechart") updatechart:number;
    scale:any={}; 
    @ViewChild('svgchart') svgchart;
    columnseries:DataSeries[]=new Array();
    lineseries:DataSeries[]=new Array();
    areaseries:DataSeries[]=new Array();
    rowseries:DataSeries[]=new Array();
    pieseries:DataSeries[]=new Array();
    donutseries:DataSeries[]=new Array();
    comboseries:DataSeries[]=new Array();
    scatterseries:DataSeries[]=new Array();
    stackedseries:DataSeries[]=new Array();
    svgwidth:number   =  800 ; svgheight:number  =  400;
    svgwidth1:number   =  320;svgheight1:number  = 25;
    transform:string;
    d3Element: d3.Selection<any>;
   
    constructor(public elementRef:ElementRef){
        console.log("Initalizing constructor WSvgChartContainer");
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }
    ngOnChanges(){
        if(!this.metadata) return;
        console.log("On change triggered in wsvgChartComponent:scale:"+this.scale);
        this.svgchart.nativeElement.style.backgroundColor=this.metadata.bgcolor;
        //this.svgwidth1=this.svgchart.nativeElement.width.animVal.value;
        //this.svgheight1=this.svgchart.nativeElement.height.animVal.value;
        if(this.width <320){
            var ar=this.width/this.svgwidth1;
            this.svgwidth1=this.svgwidth1*ar;
        }
        if(this.height <25){
            var ar=this.height/this.svgheight1;
            this.svgheight1=this.svgheight1*ar;
        }
        this.drawMargin();
        this.updateSeries();        
    }
    updateSeries(){
        this.columnseries = this.metadata.dataSeriesList.filter((series)=>{return series.charttype=="column" && series.showseries });   
        this.lineseries = this.metadata.dataSeriesList.filter((series)=>{return series.charttype=="line" && series.showseries  });
        this.areaseries = this.metadata.dataSeriesList.filter((series)=>{return series.charttype=="area" && series.showseries }); 
        this.rowseries = this.metadata.dataSeriesList.filter((series)=>{return series.charttype=="row" && series.showseries }); 
        this.pieseries = this.metadata.dataSeriesList.filter((series)=>{return series.charttype=="pie" && series.showseries });
        this.donutseries = this.metadata.dataSeriesList.filter((series)=>{return series.charttype=="donutpie" && series.showseries });
        this.comboseries = this.metadata.dataSeriesList.filter((series)=>{return series.charttype=="combo" && series.showseries});
        this.scatterseries = this.metadata.dataSeriesList.filter((series)=>{return series.charttype=="scatter" && series.showseries});
        this.stackedseries = this.metadata.dataSeriesList.filter((series)=>{return series.charttype=="stacked" && series.showseries});
    }
    
    
    tooltipUpdated(event){
        if(event.value){
            if(event.value.func==="mouseover"){
                this.d3Element.selectAll(".tooltip").style("display", "inline").text(event.value.text).style("top",event.value.y+60+"px").style("left",event.value.x+60+"px");
            }else{
                this.d3Element.selectAll(".tooltip").style("display", "none");
            }
        }
    }
    
     axisMovement(event){
       if(event.value.axisType==="yaxis"){
            this. d3Element.selectAll(".y").filter(".axis").attr("transform","translate(" + event.value.scaleValue+",0)");
      }
      
      else if(event.value.axisType==="xaxis"){
           this. d3Element.selectAll(".x").filter(".axis").attr("transform","translate(0," + event.value.scaleValue + ")");
      }
     }
     
    drawMargin(){
        var padding={"left":40,"right":20,"top":10,"bottom":20};
        this.transform = "translate(" + padding.left + "," + padding.top + ")";
        this.svgwidth=parseInt(this.width)+padding.left+padding.right;
        this.svgheight=parseInt(this.height)+padding.top+padding.bottom;
        console.log("this.svgheight:"+this.svgheight+":"+"this.svgwidth:"+this.svgwidth);
    }
    
    legendClick(event){
         console.log("On legend click triggered in wsvgChartComponent");
         this.updateSeries();
         this.updatechart=this.updatechart+1;
     }
}   