// @ts-nocheck
import Vue from 'vue'
import { Alert, Card, Row, Col, Form, FormItem, Input, Select, Option, Button } from 'element-ui';
import App from './app.vue'

Vue
    .use(Button)
    .use(Select)
    .use(Alert)
    .use(Card)
    .use(Row)
    .use(Col)
    .use(Form)
    .use(Input)
    .use(Option)
    .use(FormItem)

new Vue({
    el: "#app",
    template: '<App/>',
    render: h => h(App)
})