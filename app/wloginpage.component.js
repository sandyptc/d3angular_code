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
var authentication_service_1 = require("./service/authentication.service");
var LoginComponent = (function () {
    function LoginComponent(_service) {
        this._service = _service;
        this.user = new authentication_service_1.User('', '');
        this.errorMsg = '';
    }
    LoginComponent.prototype.ngOnInit = function () {
        this._service.checkCredentials();
    };
    LoginComponent.prototype.logout = function () {
        this._service.logout();
    };
    LoginComponent.prototype.login = function () {
        if (!this._service.login(this.user)) {
            this.errorMsg = 'Failed to login';
        }
        else {
            this._service.login(this.user);
        }
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        selector: 'wloginform',
        providers: [authentication_service_1.AuthenticationService],
        template: "\n        <div class=\"container\" >\n            <div class=\"title\">\n                Welcome\n            </div>\n            <div class=\"panel-body\">\n                <div class=\"row\">\n                    <div class=\"input-field col s12\">\n                        <input [(ngModel)]=\"user.email\" id=\"email\"  type=\"email\" class=\"validate\">\n                        <label for=\"email\">Email</label>\n                    </div>\n                </div>\n \n                <div class=\"row\">\n                    <div class=\"input-field col s12\">\n                        <input [(ngModel)]=\"user.password\" id=\"password\" \n                            type=\"password\" class=\"validate\">\n                        <label for=\"password\">Password</label>\n                    </div>\n                </div>\n \n                <span>{{errorMsg}}</span>\n                <button (click)=\"login()\" \n                    class=\"btn waves-effect waves-light\" \n                    type=\"submit\" name=\"action\">Login</button>\n            </div>\n        </div>\n    \t"
    }),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=wloginpage.component.js.map