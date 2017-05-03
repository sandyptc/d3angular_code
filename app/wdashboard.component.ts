import {Component,Input,Injectable,Inject,ElementRef,OnChanges,ViewChild,OnInit,AfterViewInit,Directive} from '@angular/core';
import {Meta,XAxis,YAxis,Axis,DataSeries,Widget} from './helpers/chartdtos';
import {ScaleUtil} from './helpers/chartutils';
import {WChartContainerComponent} from './wchartcontainer.component';
import {WTableContainerComponent} from './wtablecontainer.component';
import {DataProcessor} from './helpers/chartutils';


import * as d3 from 'd3';

@Component({
    selector: 'wdashboard',
    template:`
    <section class="widgetWrapper" id="widgetWrapper" #dashboard>
        <article *ngFor="let list of widgetlist;let idx = index" class={{list.styleclass}}  >         
			<h1 class="title">{{list.chartTitle}}</h1><div class="btn-wrapper-del">
			<span id={{idx}} class="icodelete" (click)="deleteChart($event)"></span></div>
            <div *ngIf="list.chartType != 'table'">
                <wchartcontainer #wchart></wchartcontainer>
            </div>
            <div *ngIf="list.chartType == 'table'">
                <wtablecontainer #wchart></wtablecontainer>
            </div>
		</article>
	    <article id="addWidget" #addWidget class="new empty widget-container" (click)="addDialog($event)">ADD NEW</article>
    </section>
    <div id="widgetModal" class="modal" #widgetModal>
    <div class="dialog">
        <div class="modal-header">Add Widget</div>
        <div class="modal-body">
        <section class="tab" id="wrapper_chart">               
                <article>
                	<label for="newChartTitle" >Chart Title</label>
                    <input type="text" #chartTitle>
				</article>
            	<article>
                    <label for="newChartType">Chart Type</label>
                    <select class="form-control" #chartType>
                        <option value="row">Bar Chart</option>
                        <option value="column">Column Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="area">Area Chart</option>
                        <option value="combo">Combo Chart</option>                       
                        <option value="pie">Pie Chart</option>
                        <option value="donutpie">Donut Chart</option>
                        <option value="scatter">Scatter Chart</option>
                        <option value="table">Table</option>
                        <option value="stacked">Stacked Bar Chart</option>
                    </select>
                </article>
            	<article>
                    <label for="newWidgetSize">Chart Size</label>
                    <select class="chartSize" #chartSize >
                        <option value="full">Full</option>
                        <option value="large">Large</option>
                        <option value="medium">Medium</option>
                        <option value="small">Small</option>
                    </select>
                </article>
		</section>
        </div>        
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="closeDialog($event)">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="applyDialog($event)">Apply</button> 
        </div>
	</div>
</div>
    `,
    providers:[DataProcessor,ScaleUtil,Widget]

})
@Injectable()
export class WDashboardComponent{ 
    @ViewChild('dashboard') dashboard; 
    @ViewChild('widgetModal') widgetModal; 
    @ViewChild('addWidget') addWidget; 
    @ViewChild('chartSize') chartSize; 
    @ViewChild('chartType') chartType; 
    @ViewChild('chartTitle') chartTitle; 
    @ViewChild('chart') chart; 
    widgetlist:Widget[]=new Array();
    currentwidget:Widget;// =new Widget(); 
     constructor(public elementRef:ElementRef){
         console.log(this)
     }
     
    applyDialog(event){
       this.currentwidget=new Widget();
       this.currentwidget.chartSize=this.chartSize.nativeElement.value;
       this.currentwidget.chartTitle=this.chartTitle.nativeElement.value;
       this.currentwidget.chartType=this.chartType.nativeElement.value;
       this.currentwidget.styleclass+=this.currentwidget.chartSize+" cols";
       this.elementRef.nativeElement.ownerDocument.cls=this.currentwidget.chartSize;
       this.elementRef.nativeElement.ownerDocument.ctype=this.currentwidget.chartType;
       this.elementRef.nativeElement.ownerDocument.ctitle=this.currentwidget.chartTitle;
       this.widgetlist.push(this.currentwidget);
       this.closeDialog(event);
    }
    
    addDialog(event){
        this.widgetModal.nativeElement.className+=" show";
    }
    
    closeDialog(event){
        this.widgetModal.nativeElement.className="modal";
    }
    
    deleteChart(event){
        var c=confirm("Are you sure to delete this chart?");
        if(c==true){
            this.widgetlist.splice(event.currentTarget.id,1);
        }
    }
} 