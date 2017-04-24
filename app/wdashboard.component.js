"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var chartdtos_1 = require("./helpers/chartdtos");
var chartutils_1 = require("./helpers/chartutils");
var chartutils_2 = require("./helpers/chartutils");
var WDashboardComponent = (function () {
    function WDashboardComponent(elementRef) {
        this.elementRef = elementRef;
        this.widgetlist = new Array();
        console.log(this);
    }
    WDashboardComponent.prototype.applyDialog = function (event) {
        this.currentwidget = new chartdtos_1.Widget();
        this.currentwidget.chartSize = this.chartSize.nativeElement.value;
        this.currentwidget.chartTitle = this.chartTitle.nativeElement.value;
        this.currentwidget.chartType = this.chartType.nativeElement.value;
        this.currentwidget.styleclass += this.currentwidget.chartSize + " cols";
        this.elementRef.nativeElement.ownerDocument.cls = this.currentwidget.chartSize;
        this.elementRef.nativeElement.ownerDocument.ctype = this.currentwidget.chartType;
        this.elementRef.nativeElement.ownerDocument.ctitle = this.currentwidget.chartTitle;
        this.widgetlist.push(this.currentwidget);
        this.closeDialog(event);
    };
    WDashboardComponent.prototype.addDialog = function (event) {
        this.widgetModal.nativeElement.className += " show";
    };
    WDashboardComponent.prototype.closeDialog = function (event) {
        this.widgetModal.nativeElement.className = "modal";
    };
    WDashboardComponent.prototype.deleteChart = function (event) {
        var c = confirm("Are you sure to delete this chart?");
        if (c == true) {
            this.widgetlist.splice(event.currentTarget.id, 1);
        }
    };
    return WDashboardComponent;
}());
__decorate([
    core_1.ViewChild('dashboard'),
    __metadata("design:type", Object)
], WDashboardComponent.prototype, "dashboard", void 0);
__decorate([
    core_1.ViewChild('widgetModal'),
    __metadata("design:type", Object)
], WDashboardComponent.prototype, "widgetModal", void 0);
__decorate([
    core_1.ViewChild('addWidget'),
    __metadata("design:type", Object)
], WDashboardComponent.prototype, "addWidget", void 0);
__decorate([
    core_1.ViewChild('chartSize'),
    __metadata("design:type", Object)
], WDashboardComponent.prototype, "chartSize", void 0);
__decorate([
    core_1.ViewChild('chartType'),
    __metadata("design:type", Object)
], WDashboardComponent.prototype, "chartType", void 0);
__decorate([
    core_1.ViewChild('chartTitle'),
    __metadata("design:type", Object)
], WDashboardComponent.prototype, "chartTitle", void 0);
__decorate([
    core_1.ViewChild('chart'),
    __metadata("design:type", Object)
], WDashboardComponent.prototype, "chart", void 0);
WDashboardComponent = __decorate([
    core_1.Component({
        selector: 'wdashboard',
        template: "\n    <section class=\"widgetWrapper\" id=\"widgetWrapper\" #dashboard>\n        <article *ngFor=\"let list of widgetlist;let idx = index\" class={{list.styleclass}}  >         \n\t\t\t<h1 class=\"title\">{{list.chartTitle}}</h1><div class=\"btn-wrapper-del\">\n\t\t\t<span id={{idx}} class=\"icodelete\" (click)=\"deleteChart($event)\"></span></div>\n\t\t\t<wchartcontainer #chart></wchartcontainer>\n\t\t</article>\n\t    <article id=\"addWidget\" #addWidget class=\"new empty widget-container\" (click)=\"addDialog($event)\">ADD NEW</article>\n    </section>\n    <div id=\"widgetModal\" class=\"modal\" #widgetModal>\n    <div class=\"dialog\">\n        <div class=\"modal-header\">Add Widget</div>\n        <div class=\"modal-body\">\n        <section class=\"tab\" id=\"wrapper_chart\">               \n                <article>\n                \t<label for=\"newChartTitle\" >Chart Title</label>\n                    <input type=\"text\" #chartTitle>\n\t\t\t\t</article>\n            \t<article>\n                    <label for=\"newChartType\">Chart Type</label>\n                    <select class=\"form-control\" #chartType>\n                        <option value=\"row\">Bar Chart</option>\n                        <option value=\"column\">Column Chart</option>\n                        <option value=\"line\">Line Chart</option>\n                        <option value=\"area\">Area Chart</option>\n                        <option value=\"combo\">Combo Chart</option>                       \n                        <option value=\"pie\">Pie Chart</option>\n                        <option value=\"donutpie\">Donut Chart</option>\n                        <option value=\"scatter\">Scatter Chart</option>\n                    </select>\n                </article>\n            \t<article>\n                    <label for=\"newWidgetSize\">Chart Size</label>\n                    <select class=\"chartSize\" #chartSize >\n                        <option value=\"full\">Full</option>\n                        <option value=\"large\">Large</option>\n                        <option value=\"medium\">Medium</option>\n                        <option value=\"small\">Small</option>\n                    </select>\n                </article>\n\t\t</section>\n        </div>        \n        <div class=\"modal-footer\">\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"closeDialog($event)\">Cancel</button>\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"applyDialog($event)\">Apply</button> \n        </div>\n\t</div>\n</div>\n    ",
        providers: [chartutils_2.DataProcessor, chartutils_1.ScaleUtil, chartdtos_1.Widget]
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ElementRef])
], WDashboardComponent);
exports.WDashboardComponent = WDashboardComponent;
//# sourceMappingURL=wdashboard.component.js.map