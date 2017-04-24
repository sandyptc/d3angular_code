import {Injectable, Inject} from '@angular/core';
import {Http, Response} from '@angular/http';
import * as d3 from 'd3';
import {Meta, Axis, XAxis, YAxis} from '../helpers/chartdtos';
import 'rxjs/Rx';

@Injectable()
export class DataService {
  data: any = [];
  meta: Meta;

  constructor(public http: Http) {
  }

  getChartData(url) {
      var dataUrl="data.json";
      if(url){dataUrl=url;}
    let obj = this.http.get(dataUrl).toPromise()
                    .then((res: Response)=>{
                        this.data=res.json()
                        console.log("Json Output:"+ this.data);
                        for (var index = 0; index < this.data.length; index++) {
                            console.log("Output:"+ this.data[index]);
                        }
                        return this.data;
                     });
    
    obj.catch((error: any) => { console.log("Error:" + JSON.stringify(error)) });

    console.log("Got :" + this.data);
    return obj;
  }
}