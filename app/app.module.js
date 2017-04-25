"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var wchartcontainer_component_1 = require("./wchartcontainer.component");
var wtablecontainer_component_1 = require("./wtablecontainer.component");
var wtable_component_1 = require("./wtable.component");
var wsvgchartcontainer_component_1 = require("./wsvgchartcontainer.component");
var waxis_component_1 = require("./waxis.component");
var wcolumnseries_component_1 = require("./wcolumnseries.component");
var wrowseries_component_1 = require("./wrowseries.component");
var wlineseries_component_1 = require("./wlineseries.component");
var wareaseries_component_1 = require("./wareaseries.component");
var wpieseries_component_1 = require("./wpieseries.component");
var wlegend_component_1 = require("./wlegend.component");
var wpiedonutseries_component_1 = require("./wpiedonutseries.component");
var wcomboseries_component_1 = require("./wcomboseries.component");
var wscatterseries_component_1 = require("./wscatterseries.component");
var data_service_1 = require("./service/data.service");
var wdashboard_component_1 = require("./wdashboard.component");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, http_1.HttpModule],
        declarations: [wdashboard_component_1.WDashboardComponent, wsvgchartcontainer_component_1.WSvgChartContainer, wchartcontainer_component_1.WChartContainerComponent, waxis_component_1.WAxisComponent,
            wcolumnseries_component_1.WColumnSeriesComponent, wrowseries_component_1.WRowSeriesComponent, wlineseries_component_1.WLineSeriesComponent,
            wareaseries_component_1.WAreaSeriesComponent, wpieseries_component_1.WPieSeriesComponent, wpiedonutseries_component_1.WPieDonutSeriesComponent, wlegend_component_1.WLegendComponent,
            wcomboseries_component_1.WComboSeriesComponent, wscatterseries_component_1.WScatterSeriesComponent, wtablecontainer_component_1.WTableContainerComponent, wtable_component_1.WTableComponent],
        providers: [data_service_1.DataService],
        bootstrap: [wdashboard_component_1.WDashboardComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map