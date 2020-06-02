
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
    type?: number
    graceMonth: number
    rate: number
    segment?: OptionSegment[]
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