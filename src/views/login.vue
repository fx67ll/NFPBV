<template>
	<div class="login-box">
		<div class="container" :style="loginBoxAniStyle">
			<!-- 欢迎标题 -->
			<h1>
				Welcome! ヽ(✿ﾟ▽ﾟ)ノ
				<br />
				This is fx67ll's Nodejs Project Powered By Express & MongoDB ~
			</h1>

			<!-- form表单 -->
			<!-- <div class="form" :class="this.isLogin ? 'fadeout' : 'fadein'"> -->
			<div class="form" :class="{ 'form-shake': !this.isSuccess }" :style="loginFormAniStyle">
				<!-- 登录表单 -->
				<div class="form-login" :class="!this.isRegister ? 'form-toggle-show' : 'form-toggle-none'">
					<input v-model="loginForm.userName" type="text" placeholder="Username"
						@keyup.enter="handleLogin()" />
					<input v-model="loginForm.passWord" type="password" placeholder="Password"
						@keyup.enter="handleLogin()" />
					<el-button @click="handleLogin()">Login</el-button>
					<p class="message">
						还没有账户?
						<a href="#" @click="createAccount()">立刻创建</a>
					</p>
				</div>
				<!-- 注册表单 -->
				<div class="form-register" :class="this.isRegister ? 'form-toggle-show' : 'form-toggle-none'">
					<input v-model="registerForm.userName" type="text" placeholder="Username"
						@keyup.enter="handleRegister()" />
					<input v-model="registerForm.passWord" type="password" placeholder="Password"
						@keyup.enter="handleRegister()" />
					<input v-model="registerForm.confimPassWord" type="password" placeholder="Confirm Password"
						@keyup.enter="handleRegister()" />
					<input v-model="registerForm.email" type="text" placeholder="Email"
						@keyup.enter="handleRegister()" />
					<input v-model="registerForm.phone" type="text" placeholder="Phone"
						@keyup.enter="handleRegister()" />
					<el-button @click="handleRegister()">Register</el-button>
					<p class="message">
						已经有了一个账户?
						<a href="#" @click="loginNow()">立刻登录</a>
					</p>
				</div>
			</div>
		</div>

		<!-- 登录配置对话框 -->
		<el-dialog title="登录配置" :visible.sync="isNeedCookie" width="390px" top="170px" :show-close="false"
			:modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false">
			<div class="tip-box">
				<div class="tip-item">是否记住账号密码：</div>
				<div class="tip-item"><el-checkbox v-model="isRememberMe"></el-checkbox></div>
			</div>
			<div class="tip-box">
				<div class="tip-item">设置记住过期时间:</div>
				<div class="tip-item">
					<el-select v-model="loginForm.validityTime" placeholder="请选择记住过期时间">
						<el-option v-for="item in validityTimeOptions" :key="item.value" :label="item.label"
							:value="item.value"></el-option>
					</el-select>
				</div>
			</div>
			<div class="tip-box">Tips：暂不提供修改密码，如有需要请联系管理员 ~</div>
			<span slot="footer" class="dialog-footer"><el-button type="primary" @click="checkLoginOption()">确
					定</el-button></span>
		</el-dialog>

		<!-- 背景的悬浮气泡 -->
		<ul class="bg-bubbles">
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</ul>

		<!-- 通用页脚组件 -->
		<fx67ll-footer fontColor="#ffffff" />
	</div>
</template>

<script>
import {
	login,
	signup
} from '@api/auth.js';

import _ from 'underscore';
import moment from 'moment';

import Cookies from 'js-cookie';
import md5 from 'blueimp-md5';

export default {
	name: 'nodeLogin',
	data() {
		return {
			// footer
			year: moment().format('YYYY'),
			// 判断是否在登录
			isLogin: false,
			// 判断是否需要注册
			isRegister: false,
			// 判断登录或注册是否成功
			isSuccess: true,
			// 判断是否需要弹出记住密码的弹框
			isNeedCookie: false,
			// 判断是否记住密码
			isRememberMe: false,
			// 记住账号密码的选择时间列表
			validityTimeOptions: [{
				value: 60 * 60 * 24,
				label: '24小时'
			},
			{
				value: 60 * 60 * 24 * 7,
				label: '7天'
			},
			{
				value: 60 * 60 * 24 * 30,
				label: '30天'
			},
			{
				value: 60 * 60 * 24 * 180,
				label: '180天'
			},
			{
				value: 60 * 60 * 24 * 365,
				label: '365天'
			}
			],
			// 当前token信息
			token: '',
			// 登录表单
			loginForm: {
				userName: '',
				passWord: '',
				validityTime: 60 * 60 * 24, // 默认登录24小时有效
				isFromCookie: false
			},
			// 注册表单
			registerForm: {
				userName: '',
				passWord: '',
				confimPassWord: '',
				email: '',
				phone: '',
				level: 16
			},
			// 登录动画动态样式
			loginBoxAniStyle: {},
			loginFormAniStyle: {},
			// 初始表单
			originForm: {},
		};
	},
	mounted() {
		this.ifRememberMe();
		// 1166px，后期用vuex统一一下
		if (document.body.clientWidth > 1166) {
			this.showTips();
		}
	},
	methods: {
		// 创建账户
		createAccount() {
			this.isRegister = !this.isRegister;
		},
		// 立刻登录
		loginNow() {
			this.isRegister = !this.isRegister;
		},
		// 注册
		handleRegister() {
			const self = this;
			if (!this.objectHasNull(this.registerForm)) {
				if (this.registerForm.passWord === this.registerForm.confimPassWord) {
					// 初始信息存储一下，用于注册失败之后还原注册信息
					this.originForm = {
						...self.registerForm,
					};

					// 删除确认的字段，不需要提交
					delete this.registerForm.confimPassWord;

					// 注册的时候不用那么多判断，直接一律加密
					this.registerForm.passWord = md5(this.registerForm.passWord);

					// 发送注册请求
					signup(this.registerForm).then(res => {
						if (res.status !== 0) {
							this.isSuccess = false;
							self.registerForm = {
								...self.originForm,
							};
						}
						if (res.status === 0) {
							this.loginForm.userName = this.registerForm.userName;
							this.loginForm.passWord = '';
							this.isRegister = !this.isRegister;
							this.authOK('提示', '注册成功！请登录~', 444);
							setTimeout(function () {
								self.registerForm = {
									userName: '',
									passWord: '',
									confimPassWord: '',
									email: '',
									phone: '',
									level: 16
								};
							}, 1000);
						}
					});
				} else {
					this.submitWarning('两次输入的密码不一致！');
				}
			} else {
				this.submitWarning('注册信息均不能为空！');
			}
		},
		// 登录
		handleLogin() {
			const self = this;
			if (!this.objectHasNull(this.loginForm)) {
				this.isLogin = !this.isLogin;
				this.loginBoxAniStyle = {
					transition: "all 0.6s",
					transform: "translateY(85px)",
				}
				this.loginFormAniStyle = {
					transition: "all 0.6s",
					opacity: 0,
				};

				// 获取cookie里保存的登录信息，如果没用储存过的账号密码登录，需要重新加密密码登录
				let lastUserName, lastPassWord;
				if (Cookies.getJSON('Login-Info')) {
					lastUserName = Cookies.getJSON('Login-Info').userName;
					lastPassWord = Cookies.getJSON('Login-Info').passWord;
				} else {
					lastUserName = '';
					lastPassWord = '';
				}

				// 如果使用cookie里的登录信息就不再做md5加密了，判断条件多加一个当前的登录名和保存的登录名一致
				if (!this.loginForm.isFromCookie || this.loginForm.userName !== lastUserName || this.loginForm
					.passWord !== lastPassWord) {
					this.loginForm.passWord = md5(this.loginForm.passWord);
				}

				// 提交的时候不需要整个判断字段
				delete this.loginForm.isFromCookie;

				// 发送登录请求
				login(this.loginForm).then(res => {
					if (res.status !== 0) {
						// 登录失败后的操作
						this.finishedLogin(false);
					}
					if (res.status === 0) {
						// 如果之前配置过记住密码，后期只有通过清空缓存数据可以重新配置
						this.isNeedRememberMe(res);

						// duration步长，第二个参数是计量单位
						// console.log(moment.duration(res.data.loginTimeGap, 'seconds').seconds());
						// console.log(moment.duration(res.data.loginTimeGap, 'seconds').minutes());
						// console.log(moment.duration(res.data.loginTimeGap, 'seconds').hours());
						// console.log(moment.duration(res.data.loginTimeGap, 'seconds').asMinutes());
						// console.log(moment.duration(res.data.loginTimeGap, 'seconds').asHours());

						// 返回登录间隔秒，超过多少秒就必须填验证码，前后功能待开发
						// 貌似不需要前台来做，直接服务端返回即可
						// console.log(res.data.loginTimeGap);
					}
				}).catch(error => {
					// 结束加载状态
					this.finishedLogin(false);
				});
			} else {
				this.submitWarning('账号或密码不能为空！');
			}
		},
		// 登录成功后是否需要记住密码
		isNeedRememberMe(res) {
			const self = this;

			let expires = this.loginForm.validityTime / (60 * 60 * 24);
			let path = window.location.href;

			// 官方文档只要设置天数，没有时分秒，默认是一天
			// 通过下面这种方式，60秒后过期来测试cookie过期，https://www.jb51.net/article/163289.htm
			// let seconds = 10;
			// let expires = new Date(new Date() * 1 + seconds * 1000);

			// 设置token
			Cookies.set('User-Token', res.token, {
				expires: expires,
				path: path
			});

			if (!Cookies.get('rememberMe') || !Cookies.getJSON('Login-Info') || (Cookies.getJSON('Login-Info') && this
				.loginForm.userName !== Cookies.getJSON('Login-Info').userName)) {
				// 设置登录配置
				this.token = res.token;
				this.isNeedCookie = true;
			} else {
				// 登录成功后的操作
				this.finishedLogin(true);
			}
		},
		// 记录账号密码功能
		checkLoginOption() {
			const self = this;

			let path = window.location.href;

			// 记住密码或者不记住密码
			if (this.isRememberMe) {
				let expires = this.loginForm.validityTime / (60 * 60 * 24);
				Cookies.remove('User-token');
				Cookies.set('User-Token', this.token, {
					expires: expires,
					path: path
				});

				// 设置记住密码
				Cookies.set('rememberMe', this.isRememberMe, {
					path: path
				});
				Cookies.set(
					'Login-Info', {
					userName: this.loginForm.userName,
					passWord: this.loginForm.passWord,
					validityTime: this.loginForm.validityTime,
					isFromCookie: true
				}, {
					path: path
				}
				);
			} else {
				Cookies.remove('rememberMe');
				Cookies.remove('Login-Info');
			}

			// 登录成功后的操作
			this.finishedLogin(true);
		},
		// 登录完成之后的操作
		finishedLogin(state) {
			const self = this;

			if (state) {
				// 登录成功并跳转
				this.authOK('提示', '登录成功！', 444);
				setTimeout(function () {
					self.$router.push({
						name: 'student'
					});
				}, 600);

				// 登录成功后清除信息
				setTimeout(function () {
					self.isLogin = !self.isLogin;
					self.isSuccess = state;
					self.loginForm = {
						userName: '',
						passWord: '',
						validityTime: 60 * 60 * 24,
						isFromCookie: false
					};
				}, 1000);
			} else {
				self.isLogin = !self.isLogin;
				setTimeout(function () {
					self.$nextTick(() => {
						self.loginBoxAniStyle = {
							transform: "translateY(0)",
							transition: "all 0.6s",
						};
						self.loginFormAniStyle = {
							opacity: 1,
							transition: "all 0.6s",
						};
					});
				}, 600);
				// 登录失败
				setTimeout(function () {
					self.loginForm = {
						userName: self.loginForm.userName,
						passWord: '',
						validityTime: 60 * 60 * 24,
						isFromCookie: false
					};
				}, 600);
			}
		},
		// 页面加载的时候检查cookie中是否存有登录密码
		ifRememberMe() {
			if (Cookies.get('rememberMe')) {
				if (JSON.parse(Cookies.get('rememberMe')) && Cookies.getJSON('Login-Info')) {
					this.loginForm = Cookies.getJSON('Login-Info');
					this.loginForm.validityTime = 60 * 60 * 24;
				}
			}
		},
		// 对象属性是否有非空
		objectHasNull(obj) {
			let hasNull = false;
			_.mapObject(obj, function (val, key) {
				if (val === '') {
					hasNull = true;
				}
			});
			return hasNull;
		},
		// 提交警告
		submitWarning(text) {
			const self = this;
			this.isSuccess = false;
			this.authError('警告', text, 444);
			setTimeout(function () {
				self.isSuccess = true;
			}, 1000);
		},
		// 提示
		showTips() {
			const self = this;
			setTimeout(function () {
				self.longTimeTip('游客提示', '请自行注册账号以体验完整的业务流程', 2222);
			}, 100);
		}
	}
};
</script>

<style lang="less">
.el-dialog__title {
	// font-size: 24px;
}

.el-checkbox__input {
	position: relative;
	top: 2px;

	.el-checkbox__inner {
		width: 24px;
		height: 24px;
		border-width: 2px;
	}

	.el-checkbox__inner::after {
		zoom: 1.7;
	}
}
</style>
<style lang="less" scoped="scoped">
@import '@a/styles/login/login.less';
</style>
