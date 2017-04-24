import {Component,Input,Injectable,ElementRef,OnChanges,OnInit,Output,EventEmitter} from '@angular/core';
import {Meta,XAxis,YAxis,Axis,DataSeries} from './helpers/chartdtos';
import {ScaleUtil,DataProcessor} from './helpers/chartutils';
import {DataService} from './service/data.service'
import * as d3 from 'd3';

@Component({
    selector: 'g.wroles',
    template:'',
    providers:[ScaleUtil]
})

@Injectable()
export class WRolesComponent implements OnChanges{
   @Input("width")width:any;
   @Input("metadata") metadata:Meta;
   d3Element: d3.Selection<any>; 
   @Input("updatechart") updatechart:number;
   @Output("rolesbased") rolesbased= new EventEmitter(); 
     
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
        //    if(this.metadata.graphType==='pie'||this.metadata.graphType==='donutpie'){
        //        if(element.showseries){
        //            if(this.metadata.graphType==='pie' && pi==0){
        //                this. drawLegend(element,x);
        //                pi++;
        //            }else if(this.metadata.graphType==='donutpie' && di==0){
        //                this. drawLegend(element,x);
        //                di++;
        //            }
        //        }
        //    }else{
               this. checkroles(element,x);
          // }
       } 
    }
        
    checkroles(series:DataSeries,x:any){
        
       var colorSeries=this.metadata.dataSeriesList.filter((s)=>{ return s.datatype==series.datatype});
        for(var i=0; i <= colorSeries.length; i++){}
       // if (colorSeries.=="user"){
            
      //  }
    }}
        //if(this.metadata.legendPos!=='ds'){
          //  var aratio=1;
           // if(this.width <290){
          //      aratio=this.width/290;
         //   }
           
//                 this.d3Element.selectAll(".legend").remove();
//                 var colorSeries=this.metadata.dataSeriesList.filter((s)=>{ return s.datatype==series.datatype});
//                 var legend = this.d3Element.selectAll("g").data(colorSeries).enter().append('g').attr('class', 'legend'); 
                                    
//                 var rect=legend.append('rect')
//                             .attr({'y':6,'x':(d, i)=>{return (i*60*aratio)+10;},'width': 10,'height': 10,'class':'rect'})
//                         //     .attr("",(d)=>{})
//                             .style("stroke",(d,i)=>{return colorSeries[i].color})
//                             .style("stroke-width",2)
//                             .style('fill',(d,i)=>{if(colorSeries[i].showseries){return colorSeries[i].color}else{return "white";}})             
//                          // .attr(this.metadata.roles,(d)=>{}) 
//                             .attr("id",(d,i)=>{return colorSeries[i].id;})
//                    //     .attr("roles",(d,i)=>{if(this.metadata.roles=="user"){if(colorSeries[i].id="value2"){return colorSeries[2].showseries=false;}else{return colorSeries[i].showseries=true;}}})
//                             // .attr("roles",(d,i)=>{return colorSeries[i].roles})
                             
                             
//                           //   .attr("roles",(d,i)=>{if(d.roles="user"){if(d.id="value2"){return colorSeries[2].showseries=false;}else{return colorSeries[i].showseries=true;}}})
                             
                             
                             
                             
// //                              .attr("roles",(d,i)=>
// //    {
// //         if(this.metadata.roles=="user")
// // 		{
// // 		 // if(colorSeries[i].id="value2")
// // 		   // { 
// //                return colorSeries[2].showseries==false && colorSeries[0].showseries == true && colorSeries[1].showseries == true && colorSeries[3].showseries==true ;}
// // 			//}
// // 	else{return colorSeries[i].showseries=true;}
		
// // 	}
	
// //   )
//                              .on("click",(d,i)=>{
//                             if(d.id==colorSeries[i].id){
//                                 if(colorSeries[i].showseries){
//                                         colorSeries[i].showseries=false;
//                                 }else{
//                                     colorSeries[i].showseries=true;
//                                 }
//                             }
//                 console.log(colorSeries)
//                 this.updatechart=this.updatechart+1;
//                 this.legendclicktevent.emit({value:{"id":series.id, "roles":this.metadata.roles}}); });
              
              
//                 legend.append('text')
//                       .attr({'y': 15,'x':(d, i)=>{ return (i*60*aratio) + 24;}})
//                         .text((d,i)=>{return colorSeries[i].id; }).style({"fill":"none","stroke":"black","shape-rendering":"crispEdges"})
//                         .on("click",(d,i)=>{
//                         if(d.id==colorSeries[i].id){
//                             if(colorSeries[i].showseries){
//                                 colorSeries[i].showseries=false;
//                             }else{
//                                 colorSeries[i].showseries=true;
//                             }
//                         }
//                 console.log(colorSeries)
//                 this.updatechart=this.updatechart+1;
//                 this.legendclicktevent.emit({value:{"id":series.id,"roles":this.metadata.roles}});
//                 });
//             }
//         }else{
//             this.d3Element.selectAll(".legend").remove();
//         }
//     }
        
    // colorscales(category){        
    //     switch(category){
    //         case "category10":return d3.scale.ordinal() .range(d3.scale.category10().range());
    //         case "category20":return d3.scale.ordinal() .range(d3.scale.category20().range());
    //         case "category20b":return d3.scale.ordinal() .range(d3.scale.category20b().range());
    //         case "category20c":return d3.scale.ordinal() .range(d3.scale.category20c().range());
    