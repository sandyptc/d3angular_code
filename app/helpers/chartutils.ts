import 'rxjs/Rx';
import * as d3 from 'd3';
import {Meta,XAxis,YAxis,DataSeries,Axis} from './chartdtos'

export class ScaleUtil{
    scaletypes:any ={
        column:{
            xaxis:"ordinal",
            yaxis:"auto"
        },
        row:{
            xaxis:"auto",
            yaxis:"ordinal"
        },
        line:{
            xaxis:"auto",
            yaxis:"auto"
        },
        area:{
            xaxis:"auto",
            yaxis:"auto"
        },
        combo:{
            xaxis:"ordinal",
            yaxis:"auto"
        },
        scatter:{
            xaxis:"auto",
            yaxis:"auto"
        },
        stacked:{
            xaxis:"ordinal",
            yaxis:"auto"            
        }
    };
    
    createScale(metadata:Meta,axis:Axis,width:number,height:number){
        var scaletype=this.getScaleType(axis,metadata.graphType);
        var scale =this.getScale(scaletype);
        this.updateAxisExtent(metadata,axis,scaletype);
        scale.domain(axis.extent);
        var start=(axis.axistype=='xaxis') ? 0:height;
        var end=(axis.axistype=='xaxis') ? width:0;
        if(scale.rangeBand){
            scale=scale.rangeRoundBands([start,end],.1);
        }else{
            scale=scale.range([start,end]);
        }
        return scale;
    }
    
    getScaleType(axis:Axis,charttype:string):string{
        var scaletype=this.scaletypes[charttype][axis.axistype];
        if(scaletype==="auto"){
            scaletype=(axis.datatype=='string') ? "ordinal":"linear";
        }
        return scaletype;
    }
    getScale(scaletype:string):any{
        var scale=(scaletype=='ordinal') ? d3.scale.ordinal():d3.scale.linear();
        return scale;
    }
    
    updateAxisExtent(metadata:Meta,axis:Axis,scaletype:string){
        var serieslist=metadata.dataSeriesList;
        var seriesFiltered = serieslist.filter((series)=>{ return series.datatype==axis.datatype});
        if(scaletype=='ordinal'){
            //Select the Series based on in coming axis id
            axis.extent = seriesFiltered.length>0 ?seriesFiltered[0].extent : null;
        }else{
            console.log(seriesFiltered.length);
            var allseriesextent= seriesFiltered
                                .map((series)=>{return series.extent})
                                .reduce((prev,cur)=>{ return prev.concat(cur)});
            axis.extent = d3.extent(allseriesextent);
        }
        return axis.extent;   
    }

}


/**
 * DataProcessor
 */
export class DataProcessor {
createAxisData(inputjson:any) :Meta{
    var rawdata=inputjson.data;
    var rawmetadata=inputjson.meta;
    var metadata:Meta=this.mergeData(rawmetadata,new Meta());
    metadata.xaxis=this.mergeData(metadata.xaxis,new XAxis());
    metadata.yaxis=this.mergeData(metadata.yaxis,new YAxis());
    if(rawdata.length>0){
        var dataobject=rawdata[0];
        
        var xaxisname=metadata.xaxis.id ?metadata.xaxis.id : Object.keys(dataobject)[0];
        metadata.xaxis.id=xaxisname;
        metadata.xaxis.datatype= typeof dataobject[xaxisname];
        
        var yaxisname=metadata.yaxis.id ?metadata.yaxis.id : Object.keys(dataobject)[1];
        metadata.yaxis.id=yaxisname;
        metadata.yaxis.datatype= typeof dataobject[yaxisname];
    }
    return metadata;
}

//TODO: Change to recursive object later so that inital call will copy all the values
mergeData(source:any,destination:any){
    for (var key in source) {
        var value=source[key];
        if(value){
            destination[key]=value;
        }
    }
    return destination;
}
createSeries(inputjson:any,metadata:Meta){
    if(inputjson){
        var rawmetadata=inputjson.meta;
        if(inputjson.data){
            var dataobject=inputjson.data[0];
            var colorscale = metadata.graphColor;
            
            for (var key in dataobject) {
                var val = dataobject[key];
                var series:DataSeries=new DataSeries();
                series.id=key;
                series.label=key;
                series.datatype= typeof val;
                if(metadata.graphType==='row'){
                    series.axistype = (key===metadata.yaxis.id) ?"yaxis":"xaxis";
                }else{
                    series.axistype = (key===metadata.xaxis.id) ?"xaxis":"yaxis";
                }
                series.charttype=metadata.graphType;
                series.color=this.colorscales(metadata.graphColor,metadata.dataSeriesList.length);
                metadata.dataSeriesList.push(series);
                series.extent = series.datatype=='string' ? inputjson.data.map((d)=>{return d[key]}) : d3.extent(inputjson.data.map((d)=>{return d[key]})) ;
            }
        }
    }
    return metadata;
}
//TODO: change later for better performance
colorscales(category,position){
var colormap={};
console.log("cata:"+category+":"+position)
var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];

colormap["category10"]=d3.scale.category10().range();
colormap["google10c"]=colores_g;
colormap["category20"]=d3.scale.category20().range();
colormap["category20b"]= d3.scale.category20b().range();
colormap["category20c"]=d3.scale.category20c().range();


if(!colormap[category]) category="category10";
console.log("cata:"+colormap[category][position])
return colormap[category][position];    
}





}