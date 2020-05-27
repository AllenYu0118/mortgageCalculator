/**
 * 重要概念和字段:
 * 1. 利率类别分为两种:
 *  a.单一利率 字段 无, 使用 rate 内的值
 *  b.多段利率 字段 Multi, 使用 segment 内的值
 * 2. 还款类别分为两种:
 *  a.本息均摊 字段 interest type: 1
 *  b.本金均摊 字段 capital type: 2
 * 3. 数据返回
 *  a. base 方法返回单一利率的计算结果
 *  b. 想要获取单一利率每月还款明细, 需要使用 interestPerMonthList 或 capitalPerMonthList 方法
 *  c. 多段利率使用 interestMulti 或 capitalMulti 方法, 会同时返回基础计算结果和每月还款明细
 *
 * @param price 貸款金額
 * @param month 貸款期限
 * @param type 貸款類型 {'本息定額': 1, '本金定額': 2}
 * @param graceMonth 寬限期
 * @param rate 年利率
 * @param segment 多段利率 Array [{start: '開始月份', end: '結束月份', rate: '此階段利率'}]
 * @description 多段利率計算公式參考：http://pip.moi.gov.tw/V2/C/SCRC0201.aspx
 * @description 其他規則公式參考：https://www.ks888.com.tw/www/bank1.htm
 * @description 站內參考 https://www.591.com.tw/housing-fdss.html
 * @date 更新时间 2018-10-10 16:26:19
 */
export default class MortgageCalculator {
    constructor(params) {
        let settings = {
            price: 1000 * 10000, // 默認 1000 萬
            month: 360,
            type: 1, // 贷款方式
            graceMonth: 0, // 宽限期
            rate: 1.2, // 单一利率
            segment: [ // 多段利率
                { start: 1, end: 12, rate: 1.3 },
                { start: 13, end: 24, rate: 1.4 },
                { start: 25, end: 360, rate: 1.5 }
            ]
        }
        this.params = Object.assign({}, settings, params)
    }

    // 基本方法, 单一利率获取计算结果, type = 2 可获取本金均摊计算结果
    base(params) {
        let { price, month, type, graceMonth, rate } = Object.assign({}, this.params, params)

        // 月利率
        let monthRate = rate / 12 / 100

        // 有效總月數
        let totalMonth = month - graceMonth

        // 每月應付本息金額之平均攤還率＝{[(1＋月利率)^月數]×月利率}÷{[(1＋月利率)^月數]－1}
        // ^ 代表次冪，JS 中使用 Math.pow 計算
        let averageInterest = Math.pow((1 + monthRate), totalMonth) * monthRate / (Math.pow((1 + monthRate), totalMonth) - 1)

        // 每月本息金額 = 貸款本金×每月應付本息金額之平均攤還率
        let perMonthPrice = price * averageInterest

        // 每月應付利息金額 = 貸款金額 * 月利率 / 百分比
        let perMonthInterest = price * monthRate

        // 每月還的本金 = 每月本息金額 - 每月應付利息金額
        let perMonthCapital = perMonthPrice - perMonthInterest

        // 寬限期利息總額
        let graceInterest = perMonthInterest * graceMonth

        // 還款利息總額 = (每月還款金額 * 總月數) - 總貸款金額
        let totalInerestPrice = graceInterest + (perMonthPrice * totalMonth) - price

        // 本金貸款類型
        if (type === 2) {
            // 平均每月應攤付本金金額＝貸款本金÷還款總月數
            perMonthCapital = price / totalMonth

            // 每月應付利息金額＝本金餘額×月利率
            perMonthInterest = price * monthRate

            // 每月應付本息金額＝每月應還本金＋每月應付利息
            perMonthPrice = perMonthCapital + perMonthInterest

            // 寬限期利息總額
            graceInterest = perMonthInterest * graceMonth

            // 總利息金額
            totalInerestPrice = graceInterest + (totalMonth + 1) * price * monthRate / 2
        }

        return {
            // 貸款總金額
            price,

            // 月利率
            monthRate,

            // 每月利息
            perMonthInterest,

            // 每月還的本金
            perMonthCapital,

            // 每月還款金額
            perMonthPrice,

            // 總還款月數
            totalMonth,

            // 總利息金額
            totalInerestPrice
        }
    }

    // 本息均摊 - 单一利率下获取每月明细
    interestPerMonthList(params) {
        var result = this.base(Object.assign({}, this.params, params))

        let monthList = [] // 还款明细

        var totalCapital = 0
        for (var i = 1; i <= this.params.month; i++) {
            var perMonthInterest = (result.price - totalCapital) * result.monthRate // 每月利息
            var perMonthCapital = result.perMonthPrice - perMonthInterest // 每月本金

            // 寬限期處理
            if (i <= this.params.graceMonth) {
                perMonthInterest = result.price * result.monthRate
                perMonthCapital = 0
            }

            totalCapital += perMonthCapital

            monthList.push({
                month: i,
                interest: perMonthInterest,
                capital: perMonthCapital,
                total: perMonthInterest + perMonthCapital
            })
        }

        return monthList
    }

    // 本金均摊 - 单一利率下获取每月明细
    capitalPerMonthList(params) {
        var result = this.base(Object.assign({}, this.params, params, { type: 2 }))

        let monthList = [] // 还款明细

        var totalCapital = 0
        for (var i = 1; i <= this.params.month; i++) {
            var perMonthInterest = (result.price - totalCapital) * result.monthRate // 每月利息

            var perMonthPrice = result.perMonthCapital + perMonthInterest

            // 寬限期處理
            if (i <= this.params.graceMonth) {
                perMonthInterest = result.price * result.monthRate
                perMonthPrice = perMonthInterest
            }

            totalCapital += (perMonthPrice - perMonthInterest)

            monthList.push({
                month: i,
                interest: perMonthInterest,
                capital: perMonthPrice - perMonthInterest,
                total: perMonthPrice
            })
        }

        return monthList
    }

    // 多段利率 - 本息
    interestMulti(params) {
        let that = this

        that.params = Object.assign({}, that.params, params)

        let totalInterest = 0 // 已經支付的利息
        let totalCapital = 0 // 已經支付的本金
        let graceMonth = that.params.graceMonth // 寬限期
        let monthList = [] // 还款明细

        that.params.segment.forEach((item, key) => {
            // 任何一個值為空,就返回
            if (!item.start || !item.end || !item.rate) return false

            // 参数配置
            let options = {
                rate: item.rate,
                price: that.params.price - totalCapital // 剩下的本金
            }

            if (key > 0) {
                options.month = that.params.month - that.params.segment[key - 1].end // 剩下应还款月份
                options.graceMonth = graceMonth > 0 ? graceMonth : 0
            }

            if (graceMonth > 0) {
                graceMonth -= item.end - item.start + 1 // 剩下的寬限期
            }

            // 获取相对应的段利率的 月利率值
            let result = that.base(options)

            // 循环计算出某一段内所付的本金之和
            for (let i = ~~item.start; i <= ~~item.end; i++) {
                let perMonthInterest = result.monthRate * (that.params.price - totalCapital) // 每月利息
                let perMonthCapital = result.perMonthPrice - perMonthInterest // 每月本金

                if (i <= that.params.graceMonth) {
                    // console.log(i, that.params.graceMonth)
                    perMonthInterest = result.monthRate * result.price // 每月利息
                    perMonthCapital = 0
                }

                totalCapital += perMonthCapital // 本金總額

                totalInterest += perMonthInterest // 利息總額

                monthList.push({
                    month: i,
                    interest: perMonthInterest,
                    capital: perMonthCapital,
                    total: perMonthInterest + perMonthCapital
                })
            }
        })

        return {
            totalInterest,
            totalCapital,
            monthList
        }
    }

    // 多段利率 - 本金均摊
    capitalMulti(params) {
        let that = this

        this.params = Object.assign({}, this.params, params)

        let totalInterest = 0 // 已經支付的利息
        let totalCapital = 0 // 已經支付的本金
        let monthList = [] // 还款明细

        this.params.segment.forEach((item, key) => {
            // 任何一個值為空,就返回
            if (!item.start || !item.end || !item.rate) return false

            // 参数配置
            let options = {
                rate: item.rate,
                type: 2
            }

            // 获取相对应的段利率的 月利率值
            let result = that.base(options)

            // 循环计算出某一段内所付的本金之和
            for (let i = ~~item.start; i <= ~~item.end; i++) {
                let perMonthInterest = result.monthRate * (that.params.price - totalCapital) // 每月利息
                let perMonthCapital = result.perMonthCapital // 每月本金

                if (i <= that.params.graceMonth) {
                    perMonthInterest = result.monthRate * result.price // 每月利息
                    perMonthCapital = 0
                }

                totalCapital += perMonthCapital // 本金總額

                totalInterest += perMonthInterest // 利息總額

                monthList.push({
                    month: i,
                    interest: perMonthInterest,
                    capital: perMonthCapital,
                    total: perMonthInterest + perMonthCapital
                })
            }
        })

        return {
            totalInterest,
            totalCapital,
            monthList
        }
    }

    /**
     * 验证多段利率下，每段时间与总贷款时间是否一致
     */
    verifyParams() {
        let totalMonth = 0
        this.params.segment.forEach((item) => {
            totalMonth += item.end - item.start + 1
        })

        return totalMonth === this.params.month
    }
}
