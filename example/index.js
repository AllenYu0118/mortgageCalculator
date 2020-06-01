new Vue({
    el: '#app',
    data() {
        return {
            rateType: 1, // 利率方式
            params: {
                price: 1000,
                year: 30,
                type: 1,
                grace: 0,
                rate: 1.2,
                segment: [
                    { start: 1, end: 12, rate: 1.3 },
                    { start: 13, end: 24, rate: 1.4 },
                    { start: 25, end: 360, rate: 1.5 }
                ]
            }
        }
    },

    methods: {
        onSubmit() {
            let params = Object.assign({}, this.params, {
                price: this.params.price * 10000,
                month: this.params.year * 12,
                graceMonth: this.params.grace * 12
            })
            let calculator = new MortgageCalculator(params)

            if (this.rateType === 1) {
                console.group('单一利率')

                console.group('单一利率计算结果')
                console.log(calculator.base())

                console.group('单一利率本息每月明细')
                console.log(calculator.interestPerMonthList())

                console.group('单一利率本金每月明细')
                console.log(calculator.interestPerMonthList())
            } else {
                console.group('多段利率')

                console.group('多段利率本息计算结果')
                console.log(calculator.interestMulti())

                console.group('多段利率本金计算结果')
                console.log(calculator.capitalMulti())
            }

        },

        reverseMonth(month) {
            return 30 - month + 1
        }
    }
})