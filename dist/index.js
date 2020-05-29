(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mortgageCalculator"] = factory();
	else
		root["mortgageCalculator"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/next.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/next.ts":
/*!*********************!*\
  !*** ./src/next.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 房贷试算器父类
 */
var MortgageCalculator = /** @class */ (function () {
    function MortgageCalculator() {
    }
    return MortgageCalculator;
}());
/**
 * 房贷试算器 - 台湾版
 */
var TwMortgageCalculator = /** @class */ (function (_super) {
    __extends(TwMortgageCalculator, _super);
    function TwMortgageCalculator(options) {
        var _this = _super.call(this) || this;
        var settings = {
            price: 1000 * 10000,
            month: 360,
            type: 1,
            graceMonth: 0,
            rate: 1.2,
            segment: [
                { start: 1, end: 12, rate: 1.3 },
                { start: 13, end: 24, rate: 1.4 },
                { start: 25, end: 360, rate: 1.5 }
            ]
        };
        _this.options = Object.assign({}, settings, options);
        return _this;
    }
    /**
     * 获取常用参数
     * @param options Object 参数
     */
    TwMortgageCalculator.prototype.getParams = function (options) {
        var _a = Object.assign({}, this.options, options), month = _a.month, graceMonth = _a.graceMonth, rate = _a.rate;
        // 月利率
        var monthRate = rate / 12 / 100;
        // 有效總月數
        var totalMonth = month - graceMonth;
        // 每月應付本息金額之平均攤還率＝{[(1＋月利率)^月數]×月利率}÷{[(1＋月利率)^月數]－1}
        // ^ 代表次冪，JS 中使用 Math.pow 計算
        var averageInterest = Math.pow((1 + monthRate), totalMonth) * monthRate / (Math.pow((1 + monthRate), totalMonth) - 1);
        return {
            monthRate: monthRate,
            totalMonth: totalMonth,
            averageInterest: averageInterest
        };
    };
    /**
     * 获取本息均摊的数据
     * @param options Object 参数
     */
    TwMortgageCalculator.prototype.getInterest = function (options) {
        var _a = Object.assign({}, this.options, options), price = _a.price, graceMonth = _a.graceMonth;
        var _b = this.getParams(options), monthRate = _b.monthRate, totalMonth = _b.totalMonth, averageInterest = _b.averageInterest;
        // 每月本息金額 = 貸款本金×每月應付本息金額之平均攤還率
        var perMonthPrice = price * averageInterest;
        // 每月應付利息金額 = 貸款金額 * 月利率 / 百分比
        var perMonthInterest = price * monthRate;
        // 每月還的本金 = 每月本息金額 - 每月應付利息金額
        var perMonthCapital = perMonthPrice - perMonthInterest;
        // 寬限期利息總額
        var graceInterest = perMonthInterest * graceMonth;
        // 還款利息總額 = (每月還款金額 * 總月數) - 總貸款金額
        var totalInerestPrice = graceInterest + (perMonthPrice * totalMonth) - price;
        return {
            // 貸款總金額
            price: price,
            // 月利率
            monthRate: monthRate,
            // 每月利息
            perMonthInterest: perMonthInterest,
            // 每月還的本金
            perMonthCapital: perMonthCapital,
            // 每月還款金額
            perMonthPrice: perMonthPrice,
            // 總還款月數
            totalMonth: totalMonth,
            // 總利息金額
            totalInerestPrice: totalInerestPrice
        };
    };
    /**
     * 获取本金均摊的数据
     * @param options Object 参数
     */
    TwMortgageCalculator.prototype.getCapital = function (options) {
        var _a = Object.assign({}, this.options, options), price = _a.price, graceMonth = _a.graceMonth;
        var _b = this.getParams(options), monthRate = _b.monthRate, totalMonth = _b.totalMonth;
        // 平均每月應攤付本金金額＝貸款本金÷還款總月數
        var perMonthCapital = price / totalMonth;
        // 每月應付利息金額＝本金餘額×月利率
        var perMonthInterest = price * monthRate;
        // 每月應付本息金額＝每月應還本金＋每月應付利息
        var perMonthPrice = perMonthCapital + perMonthInterest;
        // 寬限期利息總額
        var graceInterest = perMonthInterest * graceMonth;
        // 總利息金額
        var totalInerestPrice = graceInterest + (totalMonth + 1) * price * monthRate / 2;
        return {
            // 貸款總金額
            price: price,
            // 月利率
            monthRate: monthRate,
            // 每月利息
            perMonthInterest: perMonthInterest,
            // 每月還的本金
            perMonthCapital: perMonthCapital,
            // 每月還款金額
            perMonthPrice: perMonthPrice,
            // 總還款月數
            totalMonth: totalMonth,
            // 總利息金額
            totalInerestPrice: totalInerestPrice
        };
    };
    return TwMortgageCalculator;
}(MortgageCalculator));


/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map