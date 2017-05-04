import { Component, Injectable, OnChanges, ElementRef, Input } from '@angular/core';
import { Meta, DataSeries } from './helpers/chartdtos';
import { DataService } from './service/data.service';
import {DataProcessor, ScaleUtil} from './helpers/chartutils';
import * as d3 from 'd3';

@Component({
    selector: 'g.wstackedcolumnseries',
    template: ``
})
@Injectable()
export class WStackedColumnSeriesComponent implements OnChanges {
    @Input("metadata") metadata:Meta;
    @Input("metaseries") metaseries:DataSeries[];
    d3Element: d3.Selection<any>;
    @Input("height") height;
    @Input("scale") scale:any;

    constructor(public elementRef:ElementRef, public dataProcessor:DataProcessor, public dataService:DataService) {
        this.d3Element = d3.select(this.elementRef.nativeElement);
    }

    ngOnChanges() {
        if(!this.metadata) return;
        this.d3Element.selectAll("*").remove();
        console.log(this.scale);
        if(this.metaseries.length <1) return;
        if(this.scale){
            var xData = [];
            for (var index = 1; index < this.metaseries.length; index++) {
                var element = this.metaseries[index];
                xData.push(element.id);
            }
            this.drawSeries(xData);
        }
    }
    /**
     * 
     */
    drawSeries(xData:Array<any>)  {
        var dataProcessor: DataProcessor = this.dataProcessor;
        var metadata: Meta = this.metadata;

        var d3Element:any = d3.select(this.elementRef.nativeElement);
        var scalex=this.scale.scalex;
        var scaley=this.scale.scaley;

        var dataIntermediate = xData.map(
			c => {
					return this.dataService.data.map(function (d) {
							return {x: d.name, y: d[c]};
						}
					);
			}
		);

        var dataStackLayout = d3.layout.stack()(dataIntermediate);

        scalex.domain(dataStackLayout[0].map(function (d) {
			return d.x as any;
		}));

        scaley.domain([0,
			d3.max(dataStackLayout[dataStackLayout.length - 1],
                function (d) { return d.y0 + d.y;})
			])
		.nice();

        var layer = d3Element.selectAll(".stack")
                        .data(dataStackLayout)
                        .enter().append("g")
                        .attr("class", "stack")
                        .style("fill", function (d, i) {
                    return dataProcessor.colorscales(metadata.graphColor,i + 1);
            });

        layer.selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return scalex((d as any).x);
            })
            .attr("y", function (d) {
                return scaley((d as any).y + (d as any).y0);
            })
            .attr("height", function (d) {
                return scaley((d as any).y0) - scaley((d as any).y + (d as any).y0);
            })
            .attr("width", scalex.rangeBand());

    }
}