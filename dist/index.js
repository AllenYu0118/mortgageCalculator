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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @param price 貸款金額
 * @param month 貸款期限
 * @param type 貸款類型 {'本息定額': 1, '本金定額': 2}
 * @param graceMonth 寬限期
 * @param interest 年利率
 * @param segment 多段利率 Array [{start: '開始月份', end: '結束月份', interest: '此階段利率'}]
 * @description 多段利率計算公式參考：http://pip.moi.gov.tw/V2/C/SCRC0201.aspx
 * @description 其他規則公式參考：https://www.ks888.com.tw/www/bank1.htm
 * @description 站內參考 https://www.591.com.tw/housing-fdss.html
 * @date 更新时间 2018-10-10 16:26:19
 */
var MortgageCalculator = function () {
    function MortgageCalculator(params) {
        _classCallCheck(this, MortgageCalculator);

        var settings = {
            price: 1000 * 10000, // 默認 1000 萬
            month: 360,
            type: 1,
            graceMonth: 0,
            interest: 1.2,
            segment: [{ start: 1, end: 12, interest: 1.3 }, { start: 13, end: 24, interest: 1.4 }, { start: 25, end: 360, interest: 1.5 }]
        };
        this.params = Object.assign({}, settings, params);
    }

    /**
     * 验证多段利率下，每段时间与总贷款时间是否一致
     */


    _createClass(MortgageCalculator, [{
        key: "verifyParams",
        value: function verifyParams() {
            var totalMonth = 0;
            this.params.segment.forEach(function (item) {
                totalMonth += item.end - item.start + 1;
            });

            return totalMonth === this.params.month;
        }
    }, {
        key: "base",
        value: function base(params) {
            var _Object$assign = Object.assign({}, this.params, params),
                price = _Object$assign.price,
                month = _Object$assign.month,
                type = _Object$assign.type,
                graceMonth = _Object$assign.graceMonth,
                interest = _Object$assign.interest;

            // 月利率


            var monthInterest = interest / 12 / 100;

            // 有效總月數
            var totalMonth = month - graceMonth;

            // 每月應付本息金額之平均攤還率＝{[(1＋月利率)^月數]×月利率}÷{[(1＋月利率)^月數]－1}
            // ^ 代表次冪，JS 中使用 Math.pow 計算
            var averageInterest = Math.pow(1 + monthInterest, totalMonth) * monthInterest / (Math.pow(1 + monthInterest, totalMonth) - 1);

            // 每月本息金額 = 貸款本金×每月應付本息金額之平均攤還率
            var perMonthPrice = price * averageInterest;

            // 每月應付利息金額 = 貸款金額 * 月利率 / 百分比
            var perMonthInterest = price * monthInterest;

            // 每月還的本金 = 每月本息金額 - 每月應付利息金額
            var perMonthCapital = perMonthPrice - perMonthInterest;

            // 寬限期利息總額
            var graceInterest = perMonthInterest * graceMonth;

            // 還款利息總額 = (每月還款金額 * 總月數) - 總貸款金額
            var totalInerestPrice = graceInterest + perMonthPrice * totalMonth - price;

            // 本金貸款類型
            if (type === 2) {
                // 平均每月應攤付本金金額＝貸款本金÷還款總月數
                perMonthCapital = price / totalMonth;

                // 每月應付利息金額＝本金餘額×月利率
                perMonthInterest = price * monthInterest;

                // 每月應付本息金額＝每月應還本金＋每月應付利息
                perMonthPrice = perMonthCapital + perMonthInterest;

                // 寬限期利息總額
                graceInterest = perMonthInterest * graceMonth;

                // 總利息金額
                totalInerestPrice = graceInterest + (totalMonth + 1) * price * monthInterest / 2;
            }

            return {
                // 貸款總金額
                price: price,

                // 月利率
                monthInterest: monthInterest,

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
        }

        // 多段利率 - 本息

    }, {
        key: "interestMulti",
        value: function interestMulti(params) {
            var that = this;

            that.params = Object.assign({}, that.params, params);

            var totalInterest = 0; // 已經支付的利息
            var totalCapital = 0; // 已經支付的本金
            var graceMonth = that.params.graceMonth; // 寬限期
            var monthList = []; // 还款明细

            that.params.segment.forEach(function (item, key) {
                // 参数配置
                var options = {
                    interest: item.interest,
                    price: that.params.price - totalCapital // 剩下的本金
                };

                if (key > 0) {
                    options.month = that.params.month - that.params.segment[key - 1].end; // 剩下应还款月份

                    if (graceMonth > 0) {
                        options.graceMonth = graceMonth - (item.end - item.start + 1); // 剩下的寬限期
                    }
                }

                // 获取相对应的段利率的 月利率值
                var result = that.base(options);

                // 循环计算出某一段内所付的本金之和
                for (var i = item.start; i <= item.end; i++) {
                    var perMonthInterest = result.monthInterest * (that.params.price - totalCapital); // 每月利息
                    var perMonthCapital = result.perMonthPrice - perMonthInterest; // 每月本金

                    if (i <= that.params.graceMonth) {
                        perMonthInterest = result.monthInterest * result.price; // 每月利息
                        perMonthCapital = 0;
                    }

                    totalCapital += perMonthCapital; // 本金總額

                    totalInterest += perMonthInterest; // 利息總額

                    monthList.push({
                        month: i,
                        interest: perMonthInterest,
                        capital: perMonthCapital,
                        total: perMonthInterest + perMonthCapital
                    });
                }
            });

            return {
                totalInterest: totalInterest,
                totalCapital: totalCapital,
                monthList: monthList
            };
        }

        // 多段利率 - 本金均摊

    }, {
        key: "capitalMulti",
        value: function capitalMulti(params) {
            var that = this;

            this.params = Object.assign({}, this.params, params);

            var totalInterest = 0; // 已經支付的利息
            var totalCapital = 0; // 已經支付的本金
            var monthList = []; // 还款明细

            this.params.segment.forEach(function (item, key) {
                // 参数配置
                var options = {
                    interest: item.interest,
                    type: 2

                    // 获取相对应的段利率的 月利率值
                };var result = that.base(options);

                // 循环计算出某一段内所付的本金之和
                for (var i = item.start; i <= item.end; i++) {
                    var perMonthInterest = result.monthInterest * (that.params.price - totalCapital); // 每月利息
                    var perMonthCapital = result.perMonthCapital; // 每月本金

                    if (i <= that.params.graceMonth) {
                        perMonthInterest = result.monthInterest * result.price; // 每月利息
                        perMonthCapital = 0;
                    }

                    totalCapital += perMonthCapital; // 本金總額

                    totalInterest += perMonthInterest; // 利息總額

                    monthList.push({
                        month: i,
                        interest: perMonthInterest,
                        capital: perMonthCapital,
                        total: perMonthInterest + perMonthCapital
                    });
                }
            });

            return {
                totalInterest: totalInterest,
                totalCapital: totalCapital,
                monthList: monthList
            };
        }
    }]);

    return MortgageCalculator;
}();

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map