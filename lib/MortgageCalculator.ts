/**
 * 房贷试算器父类
 */

export default class MortgageCalculator {
    public name: string
    constructor() {
        this.name = 'MortgageCalculator'
    }

    test() {
        console.log(this.name)
    }
}