<template>
    <div>
        <el-alert style="margin-bottom: 20px;" title="计算结果需要查看开发者工具(F12) Console 面板" type="error"></el-alert>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>台湾版房贷试算器</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <el-row :gutter="20">
                <el-col :span="16">
                    <el-form label-width="80px">
                        <el-form-item label="贷款总额">
                            <el-input v-model="params.price">
                                <template slot="append">万元</template>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="贷款期限">
                            <el-select v-model="params.year" placeholder="请选择活动区域">
                                <el-option v-for="item in 30"
                                    :label="`${reverseMonth(item)}年(${reverseMonth(item) * 12}个月)`"
                                    :value="reverseMonth(item)"
                                    :key="item"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="宽限期">
                            <el-select v-model="params.grace" placeholder="请选择活动区域">
                                <el-option v-for="item in 5" :label="`${item}年`" :value="item" :key="item"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="贷款类型">
                            <el-select v-model="params.type" placeholder="请选择活动区域">
                                <el-option label="本息均摊" :value="1"></el-option>
                                <el-option label="本金均摊" :value="2"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="利率方式">
                            <el-select v-model="rateType" placeholder="请选择活动区域">
                                <el-option label="单一利率" :value="1"></el-option>
                                <el-option label="多段利率" :value="2"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="年利率" v-if="rateType === 1">
                            <el-input v-model="params.rate"></el-input>
                        </el-form-item>

                        <template v-if="rateType === 2">
                            <el-form-item v-for="(item, key) in params.segment"
                            :label="`第${key + 1}段利率`" :key="key">
                                <el-row>
                                    <el-col :span="6">
                                        <el-input v-model="item.start">
                                            <span slot="append">月</span>
                                        </el-input>
                                    </el-col>
                                    <el-col :span="1" style="text-align:center;">
                                        ~
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input v-model="item.end">
                                            <span slot="append">月</span>
                                        </el-input>
                                    </el-col>
                                    <el-col :span="6" :offset="1">
                                        <el-input v-model="item.rate">
                                            <span slot="append">%</span>
                                        </el-input>
                                    </el-col>
                                    <el-col :span="5"></el-col>
                                </el-row>
                            </el-form-item>
                        </template>


                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">开始计算</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="8">

                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import MortgageCalculator from '../es'
export default {
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
            console.log('calculator: ', calculator);

            if (this.rateType === 1) {
                console.group('单一利率')

                    console.group('单一利率计算结果')
                    console.log(calculator.getInterest())
                    console.groupEnd()

                    console.group('单一利率本息每月明细')
                    console.log(calculator.interestPerMonthList())
                    console.groupEnd()

                    console.group('单一利率本金每月明细')
                    console.log(calculator.capitalPerMonthList())
                    console.groupEnd()
                console.groupEnd()
            } else {
                console.group('多段利率')
                    console.group('多段利率本息计算结果')
                    console.log(calculator.interestMulti())
                    console.groupEnd()

                    console.group('多段利率本金计算结果')
                    console.log(calculator.capitalMulti())
                    console.groupEnd()
                console.groupEnd()
            }

        },

        reverseMonth(month) {
            return 30 - month + 1
        }
    }
}
</script>

<style lang="less" scoped>

</style>