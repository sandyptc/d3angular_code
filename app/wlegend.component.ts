import {Component,Input,Injectable,ElementRef,OnChanges,OnInit,Output,EventEmitter} from '@angular/core';
import {Meta,XAxis,YAxis,Axis,DataSeries} from './helpers/chartdtos';
import {ScaleUtil,DataProcessor} from './helpers/chartutils';
import {DataService} from './service/data.service'
import * as d3 from 'd3';

@Component({
    selector: 'g.wlegend',
    template:'',
    providers:[ScaleUtil]
})

@Injectable()
export class WLegendComponent implements OnChanges{
   @Input("width")width:any;
   @Input("metadata") metadata:Meta;
   d3Element: d3.Selection<any>; 
   @Input("updatechart") updatechart:number;
   @Output("legendclicktevent") legendclicktevent= new EventEmitter(); 
     
   constructor(public elementRef:ElementRef,public scaleUtil:ScaleUtil,public dataService:DataService,public dp:DataProcessor){
       console.log("Initalizing constructor WLegend Component");
       this.d3Element = d3.select(this.elementRef.nativeElement);
   }
    
    ngOnChanges(){ 
       if(!this.metadata) return;
       var pi=0,di=0;
       var x:any=[];
       for (var index = 0; index < this.metadata.dataSeriesList.length; index++) {
           var element = this.metadata.dataSeriesList[index];
           if(element.datatype=='string'){
               for(var i=0;i <element.extent.length;i++){
                   x[i]=element.extent[i];
               }
               continue;
           }
           if(this.metadata.graphType==='pie'||this.metadata.graphType==='donutpie'){
               if(element.showseries){
                   if(this.metadata.graphType==='pie' && pi==0){
                       this. drawLegend(element,x);
                       pi++;
                   }else if(this.metadata.graphType==='donutpie' && di==0){
                       this. drawLegend(element,x);
                       di++;
                   }
               }
           }else{
               this. drawLegend(element,x);
           }
       } 
    }
        
    drawLegend(series:DataSeries,x:any){
        if(this.metadata.legendPos!=='ds'){
            var aratio=1;
            if(this.width <290){
                aratio=this.width/290;
            }
            if(this.metadata.graphType==='pie'||this.metadata.graphType==='donutpie'){
                this.d3Element.selectAll(".legend").remove();
                console.log("Pie/Donut chart");
                var val=series.id;
                var color:any=this.colorscales(this.metadata.graphColor);
                var colorSeries=this.metadata.dataSeriesList.filter((s)=>{ return s.datatype==series.datatype});
                var pie :any= d3.layout.pie().sort(null).value((d:any)=> {return d[val]; });
                var aa=pie(this.dataService.data);
                var g= this.d3Element. selectAll(".arc")
                            .data(pie(this.dataService.data))
                            .enter().append("g").attr('class', 'legend');
                    g.append("circle")
                     .attr({"cy":9,"cx":(d,i)=> { return (i*70)+22;},'r':'0.5em','class':'circle'})
                     .style({"stroke":(d,i)=>{return color(x[i]);},"stroke-width":2})
                     .style('fill',(d,i)=>{if(colorSeries[i].showseries){return color(x[i]);}else{return "white";}})
                     .attr("id",(d,i)=>{return colorSeries[i].id;});
                     
                     if(this.metadata.graphType==='donutpie'){
                     g.append("circle")
                     .attr({"cy":9,"cx":(d,i)=> { return (i*70)+22;},'r':'0.35em','class':'circle'})
                     .style({"stroke":(d,i)=>{return color(x[i]);},"stroke-width":2})
                     .style('fill',"white")
                     .attr("id",(d,i)=>{return colorSeries[i].id;});
                     }
                    // g.append('rect')
                    // .attr({'y':6,'x':(d, i)=>{return (i*60*aratio)+10;},'width': 10,'height': 10,'class':'rect'})
                    // .style("stroke-width",3)
                    // .style("stroke", (d, i)=> { return color(x[i]); })
                    // .style("fill", (d, i)=>{ return color(x[i]); });
                    
                    g.append('text')
                    .attr({'y': 15,'x':(d, i)=>{ return (i*70*aratio) + 30;}})
                    .text((d:any,i)=>{return x[i]+"("+aa[i].value+")";})
                // .text((d:any,i)=>{if(this.metadata.graphType==='pie'){return x[i];} 
                        // else if(this.metadata.graphType==='donutpie'){return aa[i].value;}} )
                
            }else{
                this.d3Element.selectAll(".legend").remove();
                var colorSeries=this.metadata.dataSeriesList.filter((s)=>{ return s.datatype==series.datatype});
                var legend = this.d3Element.selectAll("g").data(colorSeries).enter().append('g').attr('class', 'legend'); 
                                    
                var rect=legend.append('rect')
                            .attr({'y':6,'x':(d, i)=>{return (i*60*aratio)+10;},'width': 10,'height': 10,'class':'rect'})
                            .style("stroke",(d,i)=>{return colorSeries[i].color})
                            .style("stroke-width",2)
                            .style('fill',(d,i)=>{if(colorSeries[i].showseries){return colorSeries[i].color}else{return "white";}})
                            .attr("id",(d,i)=>{return colorSeries[i].id;})
                            .on("click",(d,i)=>{
                            if(d.id==colorSeries[i].id){
                                if(colorSeries[i].showseries){
                                        colorSeries[i].showseries=false;
                                }else{
                                    colorSeries[i].showseries=true;
                                }
                            }
                console.log(colorSeries)
                this.updatechart=this.updatechart+1;
                this.legendclicktevent.emit({value:{"id":series.id}}); });
                legend.append('text')
                        .attr({'y': 15,'x':(d, i)=>{ return (i*60*aratio) + 22;}})
                        .text((d,i)=>{  return colorSeries[i].id; }).style({"fill":"none","stroke":"black","shape-rendering":"crispEdges"})
                        .on("click",(d,i)=>{
                        if(d.id==colorSeries[i].id){
                            if(colorSeries[i].showseries){
                                colorSeries[i].showseries=false;
                            }else{
                                colorSeries[i].showseries=true;
                            }
                        }
                console.log(colorSeries)
                this.updatechart=this.updatechart+1;
                this.legendclicktevent.emit({value:{"id":series.id}});
                });
            }
        }else{
            this.d3Element.selectAll(".legend").remove();
        }
    }
        
    colorscales(category){        
        switch(category){
            case "category10":return  d3.scale.ordinal() .range(d3.scale.category10().range());
            case "category20":return  d3.scale.ordinal() .range(d3.scale.category20().range());
            case "category20b":return d3.scale.ordinal() .range(d3.scale.category20b().range());
            case "category20c":return d3.scale.ordinal() .range(d3.scale.category20c().range());
        }
    }
}
    
    
    
