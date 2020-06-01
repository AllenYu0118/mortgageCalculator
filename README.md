## 房贷试算

#### 重要概念和字段:
- 利率类别分为两种:
    - a.单一利率 字段 无, 使用 rate 内的值
    - b.多段利率 字段 Multi, 使用 segment 内的值

- 还款类别分为两种:
    - a.本息均摊 字段 interest type: 1
    - b.本金均摊 字段 capital type: 2

- 数据返回
    - a. base 方法返回单一利率的计算结果
    - b. 想要获取单一利率每月还款明细, 需要使用 interestPerMonthList 或 capitalPerMonthList 方法
    - c. 多段利率使用 interestMulti 或 capitalMulti 方法, 会同时返回基础计算结果和每月还款明细


#### Example
- https://yuxiaolei1989.github.io/mortgageCalculator/example/index.html 计算结果需要查看开发者工具(`F12`) `Console` 面板