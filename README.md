## 房贷试算

### 重要概念和名词:
- 利率类别分为两种:
    - a.单一利率 字段 无, 使用 `rate` 内的值
    - b.多段利率 字段 `Multi`, 使用 `segment` 内的值

- 还款类别分为两种:
    - a.本息均摊 字段 `interest`
    - b.本金均摊 字段 `capital`


### Api

| 方法 | 说明 | 参数 |
|------|------|------|
| getInterest | 获取本息均摊的数据| MCOptions |
| getCapital | 获取本金均摊的数据 | MCOptions |
| interestPerMonthList | 本息均摊 - 单一利率下获取每月明细 | MCOptions |
| capitalPerMonthList | 本金均摊 - 单一利率下获取每月明细 | MCOptions |
| interestMulti | 多段利率 - 本息 | MCOptions |
| capitalMulti | 多段利率 - 本金均摊 | MCOptions |

### Build

构建 `mortgageCalculator` 类的 `JavaScript` 文件：

```shell

npm run build-lib

```

运行本地示例：[项目示例](https://yuxiaolei1989.github.io/mortgageCalculator/)

```shell

npm run dev

```

构建打包示例代码到 `dist`：

```shell

npm run build

```

### TypeScript 类型结构

```typescript

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
```


### Example
- https://yuxiaolei1989.github.io/mortgageCalculator/ 计算结果需要查看开发者工具(`F12`) `Console` 面板