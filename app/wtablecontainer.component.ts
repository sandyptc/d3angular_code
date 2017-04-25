import {Component, Input, Attribute, ElementRef, ViewChild, Inject, EventEmitter, Output, OnChanges, OnInit} from '@angular/core';
import {WTableComponent} from './wtable.component';
import {DataService} from './service/data.service';

@Component({
    selector: 'wtablecontainer',
    template: `
      <div class="btn-wrapper" #chartcontainer >
      </div>
      <app-table *ngIf="tableData" [data]="tableData" [columns]="columns" class="d3chart" #d3chart>
      </app-table>
    `
})
export class WTableContainerComponent {
  @ViewChild('chartcontainer') chartcontainer;
        // column definitions
  columns: Array<any>; 
  tableData: Array<any>;

  constructor(public elementRef: ElementRef, public dataService: DataService) {
        dataService.getChartData("rows.json").then((data)=>{this.initializeData(data,true)});
  }

  initializeData(data,urlChange) {
    // this.columns = ['date', 'close'];
    this.columns = ['Region',	'1990',	'2015',	'Difference'];
    this.tableData = data;
  }
}