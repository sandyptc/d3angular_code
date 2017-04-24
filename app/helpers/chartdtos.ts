
export class Meta{
    xaxis:Axis;
    yaxis:Axis;
    dataSeriesList:DataSeries []=new Array();
    graphtitle:string;
    graphType:string="column";
    graphColor:string="category10";
    xaxis_ticks:number;
    yaxis_ticks:number;
    graphChanged:boolean;
    animeReq:boolean=true;
    showTooltip:boolean=true;
    dataurl:any="data.json";
    comments:string="";
    legendPos:any="btm";
    bgcolor:any="#fff";
}


export class DataSeries{
    id:string;
    label:string;
    datatype:string;
    axistype:string;
    charttype:string;
    domain:any;   
    color:any;
    extent:any [];
    //showseries:string="Y";
    showseries:boolean=true;
}

export class XAxis implements Axis{
    id:string;
    label:string;
    tickscount:number=20;
    ticksformat:number;
    minticksreq:boolean=false;
    axistype:string="xaxis";
    transform:string="translate($first$,$second$)";
    datatype:string="string";//number
    orient:string="bottom";
    axistyleclass:string[]=["x axis"];

    extent:any [];

} 

export class YAxis implements Axis{
    id:string;
    label:string;
    tickscount:number=10;
    ticksformat:number;
     minticksreq:boolean=false;
    orient:string="left";
    axistyleclass:string[]=["y axis"];
    axistype:string="yaxis";
    transform:string="";
    datatype:string="string";
    extent:any [];
}


export interface Axis{
    id:string
    label:string;
    orient:string;
    axistyleclass:string[];
    tickscount:number;
    ticksformat:number;
    minticksreq:boolean;
    //calculated attributes
    axistype:string;
    transform:string;
    datatype:string;
    extent:any [];
}

// import {Http} from '@angular/http'

// export class DataService{
//     meta:Meta;
//     data:any;
//     getData(){
//        return this.data;
//     }
// }

export class Widget{
    chartTitle:any="Bar Chart";
    chartType:any="row";
    chartSize:any="full";
    styleclass="widget-container ";
    chartUrl:any="data.json";
}