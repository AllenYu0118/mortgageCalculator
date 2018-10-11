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
class MortgageCalculator {
    constructor (params) {
        let settings = {
            price: 1000 * 10000, // 默認 1000 萬
            month: 360,
            type: 1,
            graceMonth: 0,
            interest: 1.2,
            segment: [
                { start: 1, end: 12, interest: 1.3 },
                { start: 13, end: 24, interest: 1.4 },
                { start: 25, end: 360, interest: 1.5 }
            ]
        }
        this.params = Object.assign({}, settings, params)
    }

    /**
     * 验证多段利率下，每段时间与总贷款时间是否一致
     */
    verifyParams () {
        let totalMonth = 0
        this.params.segment.forEach((item) => {
            totalMonth += item.end - item.start + 1
        })

        return totalMonth === this.params.month
    }

    base (params) {
        let { price, month, type, graceMonth, interest } = Object.assign({}, this.params, params)

        // 月利率
        let monthInterest = interest / 12 / 100

        // 有效總月數
        let totalMonth = month - graceMonth

        // 每月應付本息金額之平均攤還率＝{[(1＋月利率)^月數]×月利率}÷{[(1＋月利率)^月數]－1}
        // ^ 代表次冪，JS 中使用 Math.pow 計算
        let averageInterest = Math.pow((1 + monthInterest), totalMonth) * monthInterest / (Math.pow((1 + monthInterest), totalMonth) - 1)

        // 每月本息金額 = 貸款本金×每月應付本息金額之平均攤還率
        let perMonthPrice = price * averageInterest

        // 每月應付利息金額 = 貸款金額 * 月利率 / 百分比
        let perMonthInterest = price * monthInterest

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
            perMonthInterest = price * monthInterest

            // 每月應付本息金額＝每月應還本金＋每月應付利息
            perMonthPrice = perMonthCapital + perMonthInterest

            // 寬限期利息總額
            graceInterest = perMonthInterest * graceMonth

            // 總利息金額
            totalInerestPrice = graceInterest + (totalMonth + 1) * price * monthInterest / 2
        }

        return {
            // 貸款總金額
            price,

            // 月利率
            monthInterest,

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

    // 多段利率 - 本息
    interestMulti (params) {
        let that = this

        that.params = Object.assign({}, that.params, params)

        let totalInterest = 0 // 已經支付的利息
        let totalCapital = 0 // 已經支付的本金
        let graceMonth = that.params.graceMonth // 寬限期
        let monthList = [] // 还款明细

        that.params.segment.forEach((item, key) => {
            // 参数配置
            let options = {
                interest: item.interest,
                price: that.params.price - totalCapital, // 剩下的本金
            }

            if (key > 0) {
                options.month = that.params.month - that.params.segment[key - 1].end // 剩下应还款月份

                if (graceMonth > 0) {
                    options.graceMonth = graceMonth - (item.end - item.start + 1) // 剩下的寬限期
                }
            }

            // 获取相对应的段利率的 月利率值
            let result = that.base(options)

            // 循环计算出某一段内所付的本金之和
            for (let i = item.start; i <= item.end; i++) {
                let perMonthInterest = result.monthInterest * (that.params.price - totalCapital) // 每月利息
                let perMonthCapital = result.perMonthPrice - perMonthInterest // 每月本金

                if (i <= that.params.graceMonth) {
                    perMonthInterest = result.monthInterest * result.price // 每月利息
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
    capitalMulti (params) {
        let that = this

        this.params = Object.assign({}, this.params, params)

        let totalInterest = 0 // 已經支付的利息
        let totalCapital = 0 // 已經支付的本金
        let monthList = [] // 还款明细

        this.params.segment.forEach((item, key) => {
            // 参数配置
            let options = {
                interest: item.interest,
                type: 2
            }

            // 获取相对应的段利率的 月利率值
            let result = that.base(options)

            // 循环计算出某一段内所付的本金之和
            for (let i = item.start; i <= item.end; i++) {
                let perMonthInterest = result.monthInterest * (that.params.price - totalCapital) // 每月利息
                let perMonthCapital = result.perMonthCapital // 每月本金

                if (i <= that.params.graceMonth) {
                    perMonthInterest = result.monthInterest * result.price // 每月利息
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
}
