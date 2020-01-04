import './assets/css/index.css';
import './assets/css/index.less';
import Vue from 'vue'
import App from './app'

new Vue({
    render: h => h(App)
}).$mount('#app')