import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {WChartContainerComponent} from './wchartcontainer.component';
import {DataService} from './service/data.service';
import {WDashboardComponent} from './wdashboard.component';
// import {Http, HTTP_PROVIDERS} from '@angular/http';
 import {HttpModule} from '@angular/http';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
