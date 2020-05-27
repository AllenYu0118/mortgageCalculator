/**
 * 房贷试算器父类
 */
class MortgageCalculator {
    constructor() {

    }
}

/**
 * 多段利率接口
 */
interface OptionSegment {
    start: number
    end: number
    rate: number
}

// 函数参数的接口
interface MCOptions {
    price: number
    month: number
    type: number
    graceMonth: number
    rate: number
    segment: OptionSegment[]
}


// 函数返回值的接口
interface ResultData {
    price: number
    monthRate: number
    perMonthInterest: number
    perMonthCapital: number
    perMonthPrice: number
    totalMonth: number
    totalInerestPrice: number
}

/**
 * 房贷试算器 - 台湾版
 */
class TwMortgageCalculator extends MortgageCalculator {
    public options: MCOptions
    constructor(options: MCOptions) {
        super()

        let settings: MCOptions = {
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
        this.options = Object.assign({}, settings, options)
    }

    /**
     * 获取常用参数
     * @param options Object 参数
     */
    private getParams(options: MCOptions) {
        let { month, graceMonth, rate } = Object.assign({}, this.options, options)

        // 月利率
        let monthRate = rate / 12 / 100

        // 有效總月數
        let totalMonth = month - graceMonth

        // 每月應付本息金額之平均攤還率＝{[(1＋月利率)^月數]×月利率}÷{[(1＋月利率)^月數]－1}
        // ^ 代表次冪，JS 中使用 Math.pow 計算
        let averageInterest = Math.pow((1 + monthRate), totalMonth) * monthRate / (Math.pow((1 + monthRate), totalMonth) - 1)

        return {
            monthRate,
            totalMonth,
            averageInterest
        }
    }

    /**
     * 获取本息均摊的数据
     * @param options Object 参数
     */
    getInterest(options: MCOptions): ResultData {
        let { price, graceMonth } = Object.assign({}, this.options, options)

        let { monthRate, totalMonth, averageInterest } = this.getParams(options)

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

    /**
     * 获取本金均摊的数据
     * @param options Object 参数
     */
    getCapital(options: MCOptions): ResultData {
        let { price, graceMonth } = Object.assign({}, this.options, options)

        let { monthRate, totalMonth } = this.getParams(options)

        // 平均每月應攤付本金金額＝貸款本金÷還款總月數
        let perMonthCapital = price / totalMonth

        // 每月應付利息金額＝本金餘額×月利率
        let perMonthInterest = price * monthRate

        // 每月應付本息金額＝每月應還本金＋每月應付利息
        let perMonthPrice = perMonthCapital + perMonthInterest

        // 寬限期利息總額
        let graceInterest = perMonthInterest * graceMonth

        // 總利息金額
        let totalInerestPrice = graceInterest + (totalMonth + 1) * price * monthRate / 2

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
}