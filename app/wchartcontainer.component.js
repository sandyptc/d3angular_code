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
var wlegend_component_1 = require("./wlegend.component");
var data_service_1 = require("./service/data.service");
var chartutils_1 = require("./helpers/chartutils");
var jsPDF = require('jspdf');
var WChartContainerComponent = (function () {
    function WChartContainerComponent(elementRef, dataService, dataProcessor, legend) {
        var _this = this;
        this.elementRef = elementRef;
        this.dataService = dataService;
        this.dataProcessor = dataProcessor;
        this.legend = legend;
        //updatechart variable is Short cut to reload angular
        this.updatechart = 0;
        this.title = 'Graph Title1';
        this.datachg = false;
        console.log("ngOnInit in chart:" + this.dataService.data);
        dataService.getChartData(this.elementRef.nativeElement.ownerDocument.url).then(function (data) { _this.initializeData(data, true); });
        console.log(this.dataService.data);
    }
    WChartContainerComponent.prototype.initializeData = function (data, urlChange) {
        var charttype = this.elementRef.nativeElement.getAttribute("charttype");
        this.setHtWdt();
        var metadata = this.dataProcessor.createAxisData(this.dataService);
        if (this.elementRef.nativeElement.ownerDocument.url && urlChange) {
            metadata.dataurl = this.elementRef.nativeElement.ownerDocument.url;
        }
        if (this.elementRef.nativeElement.ownerDocument.ctype) {
            charttype = this.elementRef.nativeElement.ownerDocument.ctype;
            metadata.graphType = charttype ? charttype : metadata.graphType;
            if (charttype === 'row') {
                this.setRowData(metadata);
            }
        }
        else {
            metadata.graphType = charttype ? charttype : metadata.graphType;
            if (this.elementRef.nativeElement.id === 'c2') {
                this.setRowData(metadata);
            }
        }
        this.metadata = this.dataProcessor.createSeries(this.dataService, metadata);
        console.log("Metadata=", metadata);
        this.updateSeries();
        this.updatechart = this.updatechart + 1;
    };
    WChartContainerComponent.prototype.setRowData = function (metadata) {
        metadata.graphType = "row";
        metadata.xaxis.datatype = "number";
        metadata.yaxis.datatype = "string";
        var id = metadata.xaxis.id;
        metadata.xaxis.id = metadata.yaxis.id;
        metadata.yaxis.id = id;
    };
    WChartContainerComponent.prototype.closeDialog = function (event) {
        console.log(this.modaldialog);
        var curId = event.currentTarget.closest('.cols');
        console.log(curId.getElementsByClassName("modal")[0].className);
        var curModal = curId.getElementsByClassName("modal show");
        curModal[0].className = "modal";
        this.show = false;
        event.preventDefault();
        console.log("this.metadata " + this.metadata);
    };
    WChartContainerComponent.prototype.applyDialog = function (event) {
        var curId = this.chartcontainer.nativeElement.parentElement.parentElement.childNodes[1];
        curId.innerHTML = this.metadata.graphtitle;
        this.elementRef.nativeElement.ownerDocument.ctitle = this.metadata.graphtitle;
        this.legend.d3Element.selectAll(".comments").style("display", "block").text(this.metadata.comments);
        console.log(this.metadata);
        if (this.datachg) {
            this.elementRef.nativeElement.ownerDocument.url = this.metadata.dataurl;
            this.elementRef.nativeElement.ownerDocument.ctype = this.metadata.graphType;
            this.updateJson();
        }
        this.updateChart();
        this.updateSeries();
        this.closeDialog(event);
        this.updatechart = this.updatechart + 1;
    };
    WChartContainerComponent.prototype.updJson = function (event) {
        this.datachg = true;
    };
    WChartContainerComponent.prototype.updateJson = function () {
        var _this = this;
        this.dataService.getChartData(this.metadata.dataurl).then(function (data) { _this.initializeData(data, true); });
    };
    WChartContainerComponent.prototype.updateSeries = function () {
        for (var index = 0; index < this.metadata.dataSeriesList.length; index++) {
            var series = this.metadata.dataSeriesList[index];
            series.charttype = this.metadata.graphType;
            if (this.metadata.graphType === 'row') {
                series.axistype = (series.id === this.metadata.yaxis.id) ? "yaxis" : "xaxis";
            }
            else {
                series.axistype = (series.id === this.metadata.xaxis.id) ? "xaxis" : "yaxis";
            }
            series.color = this.dataProcessor.colorscales(this.metadata.graphColor, index);
        }
    };
    WChartContainerComponent.prototype.updateChart = function () {
        if (((this.metadata.graphType === 'row' && this.metadata.xaxis.datatype === 'string')
            || this.metadata.graphType === 'column' && this.metadata.xaxis.datatype === 'number')) {
            var id = this.metadata.yaxis.id;
            this.metadata.yaxis.id = this.metadata.xaxis.id;
            this.metadata.xaxis.id = id;
            var dtype = this.metadata.yaxis.datatype;
            this.metadata.yaxis.datatype = this.metadata.xaxis.datatype;
            this.metadata.xaxis.datatype = dtype;
        }
    };
    WChartContainerComponent.prototype.switchTabs = function (event, wrapperId, customClass) {
        this.metadata.graphtitle = this.chartcontainer.nativeElement.parentElement.parentElement.childNodes[1].innerHTML;
        var curId = event.currentTarget.closest('.cols');
        var AddCustomClass = customClass || "";
        var curModal = curId.getElementsByClassName("modal");
        curModal[0].className += " show " + AddCustomClass;
        var tabObjNew = curId.getElementsByClassName("tab");
        for (var j = 0; j < tabObjNew.length; j++) {
            if (tabObjNew[j].id !== wrapperId) {
                tabObjNew[j].style.display = "none";
            }
            else {
                tabObjNew[j].style.display = "block";
            }
        }
        curId.getElementsByClassName("modal-header")[0].innerHTML = event.currentTarget.innerHTML;
        this.datachg = false;
    };
    WChartContainerComponent.prototype.onResize = function (event) {
        this.setHtWdt();
        this.updatechart = this.updatechart + 1;
    };
    WChartContainerComponent.prototype.setHtWdt = function () {
        this.width = parseInt(window.getComputedStyle(this.elementRef.nativeElement.parentElement).width) * 0.9;
        this.height = parseInt(window.getComputedStyle(this.elementRef.nativeElement.parentElement).height) * 0.6;
        // if(!this.height ||!this.width||this.height <1 || this.width < 0 ){
        //    switch(this.elementRef.nativeElement.ownerDocument.cls){
        //     case "full":this.width=1202;break;
        //     case "large":this.width=898;break;
        //     case "medium":this.width=595;break;
        //     case "small":this.width=291;break;
        //    }
        //     this.height=180; 
        // }
    };
    WChartContainerComponent.prototype.printpdf = function (event) {
        console.log("printing---------------------------------------------------");
        var doc = new jsPDF('p', 'pt', 'a4');
        var svgs = this.elementRef.nativeElement.getElementsByTagName('svg'), divs = this.elementRef.nativeElement.getElementsByTagName('div'), divToAdd, ypos = 0, pagewidth = doc.internal.pageSize.width, pageheight = doc.internal.pageSize.height;
        for (var i = 0; i < divs.length; i++) {
            if (divs[i].className == 'comments') {
                divToAdd = divs[i];
            }
        }
        for (var index = 0; index < svgs.length; index++) {
            var canvas = document.createElement('canvas');
            var element = svgs[index];
            canvg(canvas, element.outerHTML, { ignoreMouse: true, ignoreClear: true });
            var imgData = canvas.toDataURL('image/png');
            var bBox = element.getBBox();
            var dimen = this.getResizedDimension(pagewidth, pageheight, bBox.width, bBox.height);
            if (bBox.height < 50 && bBox.width < 250) {
                dimen = this.getResizedDimension(pagewidth, pageheight, 300, 20);
            }
            doc.addImage(imgData, 'PNG', 0, ypos, dimen.width, dimen.height);
            ypos = ypos + dimen.height;
        }
        doc.setFontSize(10);
        doc.setFont("Arial");
        doc.text(divToAdd.innerHTML, 20, ypos + 20);
        doc.save(event.currentTarget.closest('.cols').children[0].innerHTML + '.pdf');
        console.log("printing---------------------------------------------------" + this.svgcontainer);
    };
    //   printpdf() {
    //     console.log("pringing---------------------------------------------------");
    //         var doc = new jsPDF('p','pt','a4');
    //         var pagewidth = doc.internal.pageSize.width;    
    //         var pageheight = doc.internal.pageSize.height;
    //         doc.internal.scaleFactor = 5;
    //         var svgs =this.svgcontainer.elementRef.nativeElement.getElementsByTagName('svg');
    //         var ypos:number=0;        
    //         for (var index = 0; index < svgs.length; index++) {
    //             var canvas = document.createElement('canvas');
    //             var element = svgs[index];
    //             // canvas.width = this.width*2;
    //             // canvas.height = this.height*2;
    //             var bBox = element.getBBox();
    //             var dimen=this.getResizedDimension(pagewidth,pageheight,bBox.width, bBox.height);
    //            // console.log(element.outerHTML);
    //             canvg(canvas, element.outerHTML,{ ignoreMouse: true, ignoreClear: true });
    //             // canvg(canvas, element.outerHTML);
    //             ypos=ypos+bBox.y; 
    //             var imgData = canvas.toDataURL('image/png');
    //             // doc.addImage(imgData, 'PNG', bBox.x, ypos, bBox.width, bBox.height);
    //             doc.addImage(imgData,'PNG',0,ypos, dimen.width, dimen.height);
    //             ypos=ypos+dimen.height;
    //             // this.svgcontainer.elementRef.nativeElement.appendChild(canvas);
    //             document.body.appendChild(canvas);
    //         } 
    //        doc.save('Test.pdf');
    //         console.log("pringing---------------------------------------------------"+this.svgcontainer);
    //     }
    WChartContainerComponent.prototype.getResizedDimension = function (pagewidth, pageheight, imagewidth, imageheight) {
        var aspectratio = 1;
        if (imagewidth > pagewidth) {
            aspectratio = pagewidth / imagewidth;
        }
        if (imageheight > pageheight) {
            aspectratio = pageheight / imageheight;
        }
        imageheight = imageheight * aspectratio;
        imagewidth = imagewidth * aspectratio;
        return { height: imageheight, width: imagewidth };
    };
    return WChartContainerComponent;
}());
__decorate([
    core_1.ViewChild('chartcontainer'),
    __metadata("design:type", Object)
], WChartContainerComponent.prototype, "chartcontainer", void 0);
__decorate([
    core_1.ViewChild('modaldialog'),
    __metadata("design:type", Object)
], WChartContainerComponent.prototype, "modaldialog", void 0);
__decorate([
    core_1.Input("gid"),
    __metadata("design:type", Number)
], WChartContainerComponent.prototype, "gid", void 0);
__decorate([
    core_1.Input("chartType"),
    __metadata("design:type", Object)
], WChartContainerComponent.prototype, "chartType", void 0);
__decorate([
    core_1.ViewChild('chart'),
    __metadata("design:type", Object)
], WChartContainerComponent.prototype, "chart", void 0);
__decorate([
    core_1.ViewChild('svgcontainer'),
    __metadata("design:type", Object)
], WChartContainerComponent.prototype, "svgcontainer", void 0);
WChartContainerComponent = __decorate([
    core_1.Component({
        selector: 'wchartcontainer',
        template: "\n     <div class=\"btn-wrapper\" #chartcontainer (window:resize)=\"onResize($event);\">\n   <a href=\"#\" id=\"btn-modal-1\" class=\"btn\">\n\t<span class=\"icosetting ico\"></span>\n    <ul class=\"btn-menu\">\n    \t<li id=\"btn-data\" (click)=\"switchTabs($event, 'wrapper_chart')\">Chart Setting</li>\n    \t<li id=\"btn-chart\" (click)=\"switchTabs($event,'wrapper_data')\">Data Setting</li>\n        <li id=\"btn-axis\" (click)=\"switchTabs($event, 'wrapper_axis', 'long')\">Axis Setting</li>\n        <li id=\"btn-series\" (click)=\"switchTabs($event, 'wrapper_series', 'long')\">Series Setting</li>\n        <li id=\"btn-data\" (click)=\"printpdf($event)\">Download PDF</li>\n        <li id=\"btn-data\" (click)=\"switchTabs($event, 'wrapper_comm')\">Add comments</li>\n    </ul>\n    \n</a>\n\n<div id=\"modal-1\" #modaldialog class=\"modal\" *ngIf=\"metadata\">\n    <div class=\"dialog\">\n        <div class=\"modal-header\">Temp Title</div>\n        <div class=\"modal-body\">\n        <section class=\"tab\" id=\"wrapper_comm\">\n            <article>\n                <label>Chart Comments</label>\n                <textarea rows=\"4\" cols=\"50\" type=\"text\" [(ngModel)]=\"metadata.comments\"></textarea>\n            </article>\n        </section>\n            <section class=\"tab\" id=\"wrapper_chart\">               \n                <article>\n                \t<label for=\"ctitle\">Chart Title</label>\n                    <input id=\"ctitle\" type=\"text\" [(ngModel)]=\"metadata.graphtitle\">\n\t\t\t\t</article>\n            \t<article>\n                    <label for=\"ctype\">Chart Type</label>\n                    <select id=\"ctype\" class=\"form-control\" [(ngModel)]=\"metadata.graphType\">\n                        <option value=\"row\">Bar Chart</option>\n                        <option value=\"column\">Column Chart</option>\n                        <option value=\"line\">Line Chart</option>\n                        <option value=\"area\">Area Chart</option>                        \n                        <option value=\"combo\">Combo Chart</option>\n                        <option value=\"pie\">Pie Chart</option>\n                        <option value=\"donutpie\">Donut Chart</option>\n                        <option value=\"scatter\">Scatter Chart</option>\n                    </select>\n                </article>\n                <article>\n                    <label for=\"ctheme\">Chart Color Theme</label>\n                    <select id=\"ctheme\" class=\"form-control\"  [(ngModel)]=\"metadata.graphColor\">\n                        <option value=\"category10\">Category-10</option>\n                        <option value=\"category20\">Category-20</option>\n                        <option value=\"category20b\">Category-20b</option>\n                        <option value=\"category20c\">Category-20c</option>\n                    </select>\n                </article>\n                <article>\n                \t<label>Legend/Position</label>\n                    <select class=\"form-control\" [(ngModel)]=\"metadata.legendPos\">\n                        <option value=\"ds\">Don't show</option>\n                        <option value=\"top\">Top</option>\n                        <option value=\"btm\">Bottom</option>\n                        <option value=\"rgt\">Right</option>\n                        <option value=\"lft\">Left</option>\n                    </select>\n                </article>                \n                <article>\n                \t<label for=\"cpadding\">Padding</label>\n                    <input type=\"number\" id=\"cpadding\" value=\"2\">\n\t\t\t\t</article>              \n                <article>\n                \t<label for=\"cbarsize\">Bar/Column Size</label>\n                    <input type=\"number\" id=\"cbarsize\" value=\"25\">\n\t\t\t\t</article>                \n                <article>\n                    <input type=\"checkbox\" id=\"ctick\">\n                \t<label for=\"ctick\">Show Ticks</label>\n\t\t\t\t</article>                \n                <article>\n                    <input type=\"checkbox\" [(ngModel)]=\"metadata.showTooltip\">\n                \t<label for=\"ctooltip\">Show Tooltip</label>\n\t\t\t\t</article>                \n                <!--<article>\n                    <input type=\"checkbox\" id=\"cgridlines\">\n                \t<label for=\"cgridlines\">Show Gridlines</label>\n\t\t\t\t</article>                \n                <article>\n                    <input type=\"checkbox\" id=\"cdataguide\">\n                \t<label for=\"cdataguide\">Show Data Guides</label>\n\t\t\t\t</article>   -->             \n                <article>\n                    <input type=\"checkbox\" [(ngModel)]=\"metadata.animeReq\">\n                \t<label for=\"canimation\">Animation</label>\n\t\t\t\t</article>              \n                <article>\n                    <input type=\"color\" [(ngModel)]=\"metadata.bgcolor\">\n                \t<label >Background Color</label>\n\t\t\t\t</article>\n\t\t\t</section>\n            <section class=\"tab\" id=\"wrapper_data\">            \n                <article>\n                \t<label for=\"dsource\">Data Source</label>\n                    <input type=\"text\" id=\"dsource\"[(ngModel)]=\"metadata.dataurl\" (change)=\"updJson($event)\">\n\t\t\t\t</article>           \n                <article>\n                \t<label for=\"dfilter\">Data Filter</label>\n                    <input type=\"text\" id=\"dfilter\" value=\"n/a\">\n\t\t\t\t</article>           \n                <article>\n                \t<label for=\"drefresh\">Auto Refresh</label>\n                    <select id=\"drefresh\" class=\"form-control\">\n                        <option value=\"0\">Never</option>\n                      <option value=\"2\">Every 1Min</option>\n                        <option value=\"3\">Every 5Mins</option>\n                        <option value=\"4\">Every 15Mins</option>\n\t\t\t\t\t</select>\n\t\t\t\t</article>\n\t\t\t</section>\n            <section class=\"tab\" id=\"wrapper_axis\">               \n               <article>\n                \t<label for=\"cxLabel\">X Axis Label</label>\n                    <input type=\"text\" id=\"cxLabel\">\n                </article>\n                <article>\n                    <label for=\"cxorient\">Orientation</label>\n                    <select id=\"cxorient\" [(ngModel)]=\"metadata.xaxis.orient\">\n                        <option value=\"top\">Top</option>\n                        <option value=\"bottom\">Bottom</option>\n                    </select>\n                </article>\n                <article>\n                    <label for=\"cxtick\">Tick Count</label>\n                    <input type=\"number\" id=\"cxtick\" [(ngModel)]=\"metadata.xaxis.tickscount\">\n                </article>\n                <!--<article>\n                    <label for=\"cxticksize\">Minor Ticks</label>\n                    <input type=\"number\" id=\"cxticksize\">\n                </article>-->\n                 <article>\n                    <label for=\"cxtickreq\">Minor Ticks</label>\n                    <input type=\"checkbox\" [(ngModel)]=\"metadata.xaxis.minticksreq\">\n                </article>              \n                <article>\n                \t<label for=\"cxLabel\">Y Axis Label</label>\n                    <input type=\"text\" id=\"cxLabel\">\n                </article>\n                <article>\n                    <label for=\"cyorient\">Orientation</label>\n                    <select id=\"cyorient\" [(ngModel)]=\"metadata.yaxis.orient\">\n                        <option value=\"left\">Left</option>\n                        <option value=\"right\">Right</option>\n                    </select>\n                </article>\n                <article>\n                    <label for=\"cytick\">Tick Count</label>\n                    <input type=\"number\" id=\"cytick\" [(ngModel)]=\"metadata.yaxis.tickscount\">\n                </article>\n               <!-- <article>\n                    <label for=\"cyticksize\">Tick Size</label>\n                    <input type=\"number\" id=\"cyticksize\">\n                </article>-->\n                <article>\n                    <label for=\"cytickreq\">Minor Ticks</label>\n                    <input type=\"checkbox\" [(ngModel)]=\"metadata.yaxis.minticksreq\">\n                </article>\n\t\t\t</section>\n            <section class=\"tab\" style=\"display: block;\" id=\"wrapper_series\" >               \n                <div *ngFor=\"let innerseries of metadata.dataSeriesList; let idx = index\">\n                <article>\n                \t<label for=\"cxcollabel\">Column Label</label>\n\t\t\t\t\t<input type=\"text\" id=\"cxcollabel\" value={{innerseries.id}}>\n                </article>              \n                <article>\n                    <label for=\"cxcolsource\">Column Source</label>\n                    <input type=\"text\" value={{innerseries.id}}>\n                    <!--<select id=\"cxcolsource\">\n                        <option value=\"source1\" *ngFor=\"let series of metadata.dataSeriesList;\">{{innerseries.id}}</option>\n                        \n                    </select>-->\n                </article>              \n                <article>\n                    <label for=\"cxcolsource\">Axis</label>\n                    <select id=\"cxcolsource\" [(ngModel)]=\"innerseries.axistype\">\n                        <option value=\"xaxis\">X-Axis</option>\n                        <option value=\"yaxis\">Y-Axis</option>\n                        \n                    </select>\n                </article>              \n                <article>\n                    <input type=\"color\" [(ngModel)]=\"innerseries.color\">\n                    <label for=\"cxcolcolor\">Column Color</label>\n                </article>\n                 <article class=\"rowSelect\">\n                    <input type=\"checkbox\" [(ngModel)]=\"innerseries.showseries\" >\n                </article>\n                </div>\n\t\t\t</section>\n            </div>\n        <div class=\"modal-footer\">\n            <button type=\"button\" class=\"btn btn-primary\" id=\"dialog-cancel\" (click)=\"closeDialog($event)\">Cancel</button>\n            <button type=\"button\" class=\"btn btn-primary\" id=\"dialog-apply\" (click)=\"applyDialog($event)\">Apply</button> \n        </div>\n\t</div>\n</div>\n    </div>\n    \n    <wsvgchartcontainer   [width]=[width] [height]=[height] [metadata]=\"metadata\" [updatechart]=\"updatechart\"></wsvgchartcontainer>\n     ",
        providers: [chartutils_1.DataProcessor, wlegend_component_1.WLegendComponent]
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, data_service_1.DataService, chartutils_1.DataProcessor, wlegend_component_1.WLegendComponent])
], WChartContainerComponent);
exports.WChartContainerComponent = WChartContainerComponent;
//# sourceMappingURL=wchartcontainer.component.js.map