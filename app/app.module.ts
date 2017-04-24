import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {WChartContainerComponent} from './wchartcontainer.component';
import { WSvgChartContainer } from './wsvgchartcontainer.component';
import { WAxisComponent } from './waxis.component';
import { WColumnSeriesComponent } from './wcolumnseries.component';
import {WRowSeriesComponent} from './wrowseries.component';
import {WLineSeriesComponent} from './wlineseries.component';
import {WAreaSeriesComponent} from './wareaseries.component'
import {WPieSeriesComponent} from './wpieseries.component';
import {WLegendComponent} from './wlegend.component';
import {WPieDonutSeriesComponent} from  './wpiedonutseries.component';
import {WComboSeriesComponent} from './wcomboseries.component';
import {WScatterSeriesComponent} from './wscatterseries.component';
import {DataService} from './service/data.service';
import {WDashboardComponent} from './wdashboard.component';
import {HttpModule} from '@angular/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [ BrowserModule, FormsModule, HttpModule ],
  declarations: [ WDashboardComponent, WSvgChartContainer, WChartContainerComponent, WAxisComponent,
				  WColumnSeriesComponent, WRowSeriesComponent, WLineSeriesComponent, 
                  WAreaSeriesComponent, WPieSeriesComponent, WPieDonutSeriesComponent, WLegendComponent,
                  WComboSeriesComponent, WScatterSeriesComponent],
  providers: [ DataService ],
  bootstrap: [ WDashboardComponent ]
})
export class AppModule { }
