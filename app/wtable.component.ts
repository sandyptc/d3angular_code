import {Component,Input,ElementRef,OnChanges,ViewChild,OnInit,AfterViewInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-table',
    template: `
		`
})
export class WTableComponent implements OnInit  {
  @Input("columns") columns: Array<any>;
  @Input("data") data: Array<any>;

  constructor(public elementRef: ElementRef) { 
    console.log("WTableComponent constructor called:",this.data,this.columns);
  }

  ngOnInit() {
    console.log("WTableComponent onChanges called:",this.data,this.columns);
    this.createTable();
  }

  createTable() {
		let element = this.elementRef.nativeElement;
		var table = d3.select(element).append('table');
		var thead = table.append('thead')
		var	tbody = table.append('tbody');
		
		// append the header row
		thead.append('tr')
		  .selectAll('th')
		  .data(this.columns).enter()
		  .append('th')
		    .text(function (column) { return column; });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(this.data)
		  .enter()
		  .append('tr');

			// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data( row => {
				return this.columns.map(function (column) {
					return {column: column, value: row[column]};
				});
		   })
		  .enter()
		  .append('td')
		    .text(function (d) { return d.value; });	
  }

}
