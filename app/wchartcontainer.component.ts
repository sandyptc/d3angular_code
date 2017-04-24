import {Component, Input, Attribute, ElementRef, ViewChild, Inject, EventEmitter, Output, OnChanges, OnInit} from '@angular/core';
import { WSvgChartContainer } from './wsvgchartcontainer.component';
import { WLegendComponent } from './wlegend.component';
import {Meta, XAxis, YAxis} from './helpers/chartdtos';
import {DataService} from './service/data.service';
import {DataProcessor, ScaleUtil} from './helpers/chartutils';
import * as d3 from 'd3';
let jsPDF = require('jspdf');
declare var canvg: any;

@Component({
    selector: 'wchartcontainer',
    template: `
     <div class="btn-wrapper" #chartcontainer (window:resize)="onResize($event);">
   <a href="#" id="btn-modal-1" class="btn">
	<span class="icosetting ico"></span>
    <ul class="btn-menu">
    	<li id="btn-data" (click)="switchTabs($event, 'wrapper_chart')">Chart Setting</li>
    	<li id="btn-chart" (click)="switchTabs($event,'wrapper_data')">Data Setting</li>
        <li id="btn-axis" (click)="switchTabs($event, 'wrapper_axis', 'long')">Axis Setting</li>
        <li id="btn-series" (click)="switchTabs($event, 'wrapper_series', 'long')">Series Setting</li>
        <li id="btn-data" (click)="printpdf($event)">Download PDF</li>
        <li id="btn-data" (click)="switchTabs($event, 'wrapper_comm')">Add comments</li>
    </ul>
    
</a>

<div id="modal-1" #modaldialog class="modal" *ngIf="metadata">
    <div class="dialog">
        <div class="modal-header">Temp Title</div>
        <div class="modal-body">
        <section class="tab" id="wrapper_comm">
            <article>
                <label>Chart Comments</label>
                <textarea rows="4" cols="50" type="text" [(ngModel)]="metadata.comments"></textarea>
            </article>
        </section>
            <section class="tab" id="wrapper_chart">               
                <article>
                	<label for="ctitle">Chart Title</label>
                    <input id="ctitle" type="text" [(ngModel)]="metadata.graphtitle">
				</article>
            	<article>
                    <label for="ctype">Chart Type</label>
                    <select id="ctype" class="form-control" [(ngModel)]="metadata.graphType">
                        <option value="row">Bar Chart</option>
                        <option value="column">Column Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="area">Area Chart</option>                        
                        <option value="combo">Combo Chart</option>
                        <option value="pie">Pie Chart</option>
                        <option value="donutpie">Donut Chart</option>
                        <option value="scatter">Scatter Chart</option>
                    </select>
                </article>
                <article>
                    <label for="ctheme">Chart Color Theme</label>
                    <select id="ctheme" class="form-control"  [(ngModel)]="metadata.graphColor">
                        <option value="category10">Category-10</option>
                        <option value="category20">Category-20</option>
                        <option value="category20b">Category-20b</option>
                        <option value="category20c">Category-20c</option>
                    </select>
                </article>
                <article>
                	<label>Legend/Position</label>
                    <select class="form-control" [(ngModel)]="metadata.legendPos">
                        <option value="ds">Don't show</option>
                        <option value="top">Top</option>
                        <option value="btm">Bottom</option>
                        <option value="rgt">Right</option>
                        <option value="lft">Left</option>
                    </select>
                </article>                
                <article>
                	<label for="cpadding">Padding</label>
                    <input type="number" id="cpadding" value="2">
				</article>              
                <article>
                	<label for="cbarsize">Bar/Column Size</label>
                    <input type="number" id="cbarsize" value="25">
				</article>                
                <article>
                    <input type="checkbox" id="ctick">
                	<label for="ctick">Show Ticks</label>
				</article>                
                <article>
                    <input type="checkbox" [(ngModel)]="metadata.showTooltip">
                	<label for="ctooltip">Show Tooltip</label>
				</article>                
                <!--<article>
                    <input type="checkbox" id="cgridlines">
                	<label for="cgridlines">Show Gridlines</label>
				</article>                
                <article>
                    <input type="checkbox" id="cdataguide">
                	<label for="cdataguide">Show Data Guides</label>
				</article>   -->             
                <article>
                    <input type="checkbox" [(ngModel)]="metadata.animeReq">
                	<label for="canimation">Animation</label>
				</article>              
                <article>
                    <input type="color" [(ngModel)]="metadata.bgcolor">
                	<label >Background Color</label>
				</article>
			</section>
            <section class="tab" id="wrapper_data">            
                <article>
                	<label for="dsource">Data Source</label>
                    <input type="text" id="dsource"[(ngModel)]="metadata.dataurl" (change)="updJson($event)">
				</article>           
                <article>
                	<label for="dfilter">Data Filter</label>
                    <input type="text" id="dfilter" value="n/a">
				</article>           
                <article>
                	<label for="drefresh">Auto Refresh</label>
                    <select id="drefresh" class="form-control">
                        <option value="0">Never</option>
                      <option value="2">Every 1Min</option>
                        <option value="3">Every 5Mins</option>
                        <option value="4">Every 15Mins</option>
					</select>
				</article>
			</section>
            <section class="tab" id="wrapper_axis">               
               <article>
                	<label for="cxLabel">X Axis Label</label>
                    <input type="text" id="cxLabel">
                </article>
                <article>
                    <label for="cxorient">Orientation</label>
                    <select id="cxorient" [(ngModel)]="metadata.xaxis.orient">
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                    </select>
                </article>
                <article>
                    <label for="cxtick">Tick Count</label>
                    <input type="number" id="cxtick" [(ngModel)]="metadata.xaxis.tickscount">
                </article>
                <!--<article>
                    <label for="cxticksize">Minor Ticks</label>
                    <input type="number" id="cxticksize">
                </article>-->
                 <article>
                    <label for="cxtickreq">Minor Ticks</label>
                    <input type="checkbox" [(ngModel)]="metadata.xaxis.minticksreq">
                </article>              
                <article>
                	<label for="cxLabel">Y Axis Label</label>
                    <input type="text" id="cxLabel">
                </article>
                <article>
                    <label for="cyorient">Orientation</label>
                    <select id="cyorient" [(ngModel)]="metadata.yaxis.orient">
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                </article>
                <article>
                    <label for="cytick">Tick Count</label>
                    <input type="number" id="cytick" [(ngModel)]="metadata.yaxis.tickscount">
                </article>
               <!-- <article>
                    <label for="cyticksize">Tick Size</label>
                    <input type="number" id="cyticksize">
                </article>-->
                <article>
                    <label for="cytickreq">Minor Ticks</label>
                    <input type="checkbox" [(ngModel)]="metadata.yaxis.minticksreq">
                </article>
			</section>
            <section class="tab" style="display: block;" id="wrapper_series" >               
                <div *ngFor="let innerseries of metadata.dataSeriesList; let idx = index">
                <article>
                	<label for="cxcollabel">Column Label</label>
					<input type="text" id="cxcollabel" value={{innerseries.id}}>
                </article>              
                <article>
                    <label for="cxcolsource">Column Source</label>
                    <input type="text" value={{innerseries.id}}>
                    <!--<select id="cxcolsource">
                        <option value="source1" *ngFor="let series of metadata.dataSeriesList;">{{innerseries.id}}</option>
                        
                    </select>-->
                </article>              
                <article>
                    <label for="cxcolsource">Axis</label>
                    <select id="cxcolsource" [(ngModel)]="innerseries.axistype">
                        <option value="xaxis">X-Axis</option>
                        <option value="yaxis">Y-Axis</option>
                        
                    </select>
                </article>              
                <article>
                    <input type="color" [(ngModel)]="innerseries.color">
                    <label for="cxcolcolor">Column Color</label>
                </article>
                 <article class="rowSelect">
                    <input type="checkbox" [(ngModel)]="innerseries.showseries" >
                </article>
                </div>
			</section>
            </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="dialog-cancel" (click)="closeDialog($event)">Cancel</button>
            <button type="button" class="btn btn-primary" id="dialog-apply" (click)="applyDialog($event)">Apply</button> 
        </div>
	</div>
</div>
    </div>
    
    <wsvgchartcontainer   [width]=[width] [height]=[height] [metadata]="metadata" [updatechart]="updatechart"></wsvgchartcontainer>
     `,
    providers: [DataProcessor, WLegendComponent]
})
export class WChartContainerComponent {
    @ViewChild('chartcontainer') chartcontainer;
    @ViewChild('modaldialog') modaldialog;
    @Input("gid") gid: number;
    @Input("chartType") chartType;
    @ViewChild('chart') chart;
    @ViewChild('svgcontainer') svgcontainer;
    d3Element: d3.Selection<any>;
    //updatechart variable is Short cut to reload angular
    updatechart: number = 0;
    height: number;
    width: number;
    show: boolean;
    className: any;
    title = 'Graph Title1';
    metadata: Meta;
    datachg:boolean=false;

    constructor(public elementRef: ElementRef, public dataService: DataService, public dataProcessor: DataProcessor, public legend: WLegendComponent) {
        console.log("ngOnInit in chart:" + this.dataService.data);
        dataService.getChartData(this.elementRef.nativeElement.ownerDocument.url).then((data)=>{this.initializeData(data,true)});
        console.log(this.dataService.data);
        
    }
    initializeData(data,urlChange) {
        var charttype = this.elementRef.nativeElement.getAttribute("charttype");
        this.setHtWdt();
        var metadata = this.dataProcessor.createAxisData(this.dataService);
        if(this.elementRef.nativeElement.ownerDocument.url && urlChange){
            metadata.dataurl=this.elementRef.nativeElement.ownerDocument.url;
        }
        if(this.elementRef.nativeElement.ownerDocument.ctype){
            charttype=this.elementRef.nativeElement.ownerDocument.ctype;
             metadata.graphType=charttype?charttype:metadata.graphType;
             if(charttype==='row'){ this.setRowData(metadata);}
        }else{
             metadata.graphType=charttype?charttype:metadata.graphType;
             if(this.elementRef.nativeElement.id==='c2'){ this.setRowData(metadata);}
        }
       this.metadata = this.dataProcessor.createSeries(this.dataService, metadata);
       this.updateSeries();
       this.updatechart=this.updatechart+1;
    }
    
    setRowData(metadata){
        metadata.graphType="row";
        metadata.xaxis.datatype="number";
        metadata.yaxis.datatype="string";
        var id=metadata.xaxis.id;
        metadata.xaxis.id=metadata.yaxis.id;
        metadata.yaxis.id=id;
    }

    closeDialog(event) {
        console.log(this.modaldialog);
        var curId = event.currentTarget.closest('.cols');
        console.log(curId.getElementsByClassName("modal")[0].className);
        var curModal = curId.getElementsByClassName("modal show");
        curModal[0].className = "modal";
        this.show = false;
        event.preventDefault();
        console.log("this.metadata " + this.metadata);
    }

    applyDialog(event) {
        var curId = this.chartcontainer.nativeElement.parentElement.parentElement.childNodes[1];
        curId.innerHTML=this.metadata.graphtitle;
        this.elementRef.nativeElement.ownerDocument.ctitle=this.metadata.graphtitle;
        this.legend.d3Element.selectAll(".comments").style("display","block").text(this.metadata.comments);
        console.log(this.metadata);
        if(this.datachg){
            this.elementRef.nativeElement.ownerDocument.url=this.metadata.dataurl;
            this.elementRef.nativeElement.ownerDocument.ctype=this.metadata.graphType;
            this.updateJson();
        }
        this.updateChart();
        this.updateSeries();
        this.closeDialog(event);
        this.updatechart = this.updatechart + 1;
    }

    updJson(event){
        this.datachg=true;
    }

    updateJson(){
        this.dataService.getChartData(this.metadata.dataurl).then((data)=>{this.initializeData(data,true)});
    }

    updateSeries() {
        for (var index = 0; index < this.metadata.dataSeriesList.length; index++) {
            var series = this.metadata.dataSeriesList[index];
            series.charttype = this.metadata.graphType;
            if (this.metadata.graphType === 'row') {
                series.axistype = (series.id === this.metadata.yaxis.id)? "yaxis" : "xaxis";
            } else {
                series.axistype = (series.id === this.metadata.xaxis.id) ? "xaxis" : "yaxis";
            }
            series.color = this.dataProcessor.colorscales(this.metadata.graphColor, index);
        }
    }
    
    updateChart(){
        if (((this.metadata.graphType === 'row'&& this.metadata.xaxis.datatype==='string')
                ||this.metadata.graphType === 'column'&&this.metadata.xaxis.datatype==='number')) {
         var id=this.metadata.yaxis.id;
                this.metadata.yaxis.id=this.metadata.xaxis.id;
                this.metadata.xaxis.id=id;
         var dtype=this.metadata.yaxis.datatype;
                 this.metadata.yaxis.datatype=this.metadata.xaxis.datatype;
                this.metadata.xaxis.datatype=dtype;
        }
    }

    switchTabs(event, wrapperId, customClass) {
        this.metadata.graphtitle=this.chartcontainer.nativeElement.parentElement.parentElement.childNodes[1].innerHTML;
        var curId = event.currentTarget.closest('.cols');
        var AddCustomClass = customClass || "";
        var curModal = curId.getElementsByClassName("modal");
        curModal[0].className += " show " + AddCustomClass;
        var tabObjNew = curId.getElementsByClassName("tab");
        for (var j = 0; j < tabObjNew.length; j++) {
            if (tabObjNew[j].id !== wrapperId) {
                tabObjNew[j].style.display = "none";
            } else {
                tabObjNew[j].style.display = "block";
            }
        }
        curId.getElementsByClassName("modal-header")[0].innerHTML = event.currentTarget.innerHTML;
        this.datachg=false;
    }

    onResize(event) {
        this.setHtWdt();
        this.updatechart = this.updatechart + 1;
    }

   setHtWdt(){
      this.width = parseInt(window.getComputedStyle(this.elementRef.nativeElement.parentElement).width)*0.9;
      this.height = parseInt(window.getComputedStyle(this.elementRef.nativeElement.parentElement).height)*0.6; 
       
        // if(!this.height ||!this.width||this.height <1 || this.width < 0 ){
        //    switch(this.elementRef.nativeElement.ownerDocument.cls){
        //     case "full":this.width=1202;break;
        //     case "large":this.width=898;break;
        //     case "medium":this.width=595;break;
        //     case "small":this.width=291;break;
        //    }
        //     this.height=180; 
        // }
  }
  
  printpdf(event) {
    console.log("printing---------------------------------------------------");
    var doc = new jsPDF('p','pt','a4');
    var svgs =this.elementRef.nativeElement.getElementsByTagName('svg'),
        divs=this.elementRef.nativeElement.getElementsByTagName('div'),
        divToAdd:any,ypos:number=0,pagewidth = doc.internal.pageSize.width,
        pageheight = doc.internal.pageSize.height;      
    for(var i=0;i <divs.length;i++){
        if(divs[i].className=='comments'){
            divToAdd=divs[i];
        }
    }
    for (var index = 0; index < svgs.length; index++) {
        var canvas = document.createElement('canvas');
        var element = svgs[index];
        canvg(canvas, element.outerHTML,{ ignoreMouse: true, ignoreClear: true });
        var imgData = canvas.toDataURL('image/png');
        var bBox = element.getBBox();
        var dimen=this.getResizedDimension(pagewidth,pageheight,bBox.width, bBox.height);
        if(bBox.height <50 && bBox.width <250){
            dimen=this.getResizedDimension(pagewidth,pageheight,300, 20);
        }
        doc.addImage(imgData,'PNG',0,ypos, dimen.width, dimen.height);
        ypos=ypos+dimen.height;
    }
    doc.setFontSize(10);
    doc.setFont("Arial");
    doc.text(divToAdd.innerHTML,20,ypos+20);
    doc.save(event.currentTarget.closest('.cols').children[0].innerHTML+'.pdf');
    console.log("printing---------------------------------------------------"+this.svgcontainer);
}
  
//   printpdf() {
//     console.log("pringing---------------------------------------------------");
//         var doc = new jsPDF('p','pt','a4');
//         var pagewidth = doc.internal.pageSize.width;    
//         var pageheight = doc.internal.pageSize.height;
//         doc.internal.scaleFactor = 5;
//         var svgs =this.svgcontainer.elementRef.nativeElement.getElementsByTagName('svg');
//         var ypos:number=0;        
//         for (var index = 0; index < svgs.length; index++) {
//             var canvas = document.createElement('canvas');
//             var element = svgs[index];
//             // canvas.width = this.width*2;
//             // canvas.height = this.height*2;
//             var bBox = element.getBBox();
//             var dimen=this.getResizedDimension(pagewidth,pageheight,bBox.width, bBox.height);
//            // console.log(element.outerHTML);
//             canvg(canvas, element.outerHTML,{ ignoreMouse: true, ignoreClear: true });
//             // canvg(canvas, element.outerHTML);
//             ypos=ypos+bBox.y; 
//             var imgData = canvas.toDataURL('image/png');
//             // doc.addImage(imgData, 'PNG', bBox.x, ypos, bBox.width, bBox.height);
//             doc.addImage(imgData,'PNG',0,ypos, dimen.width, dimen.height);
//             ypos=ypos+dimen.height;
//             // this.svgcontainer.elementRef.nativeElement.appendChild(canvas);
//             document.body.appendChild(canvas);

//         } 
//        doc.save('Test.pdf');
//         console.log("pringing---------------------------------------------------"+this.svgcontainer);
//     }
    
     getResizedDimension(pagewidth,pageheight,imagewidth,imageheight){
        var aspectratio=1;
         if(imagewidth>pagewidth){
            aspectratio = pagewidth/imagewidth; 
         }
         if(imageheight>pageheight){
            aspectratio = pageheight/imageheight; 
         }
         imageheight=imageheight*aspectratio;
         imagewidth=imagewidth*aspectratio;
         return {height:imageheight,width:imagewidth};
    }
}