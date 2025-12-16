import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router/index.js';
import store from '@/store/index.js';

Vue.config.productionTip = false;

import less from 'less';
Vue.use(less)

import "normalize.css";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

import fx67llVueUI from 'fx67ll-vue-ui';
Vue.use(fx67llVueUI)

// 统一成功弹窗
Vue.prototype.msgOK = function(msg, duration) {
	this.$message.success({
		message: msg,
		duration: duration || 1023,
		showClose: false
	});
}
// 统一错误弹窗
Vue.prototype.msgError = function(msg, duration) {
	this.$message.error({
		message: msg,
		duration: duration || 1023,
		showClose: false
	});
}
// 权限成功弹窗
Vue.prototype.authOK = function(tip, msg, duration) {
	this.$notify.success({
		title: tip,
		message: msg,
		duration: duration || 1023,
		showClose: false
	});
}
// 权限失败弹窗
Vue.prototype.authError = function(tip, msg, duration) {
	this.$notify.error({
		title: tip,
		message: msg,
		duration: duration || 1023,
		showClose: false
	});
}

// 长时间悬浮提示
Vue.prototype.longTimeTip = function(tip, msg, duration) {
	this.$notify.success({
		title: tip,
		message: msg,
		duration: duration || 4444,
		showClose: false
	});
}


new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
