<template>
	<div class="fx67ll-layout-box">
		<div class="fx67ll-setting-box">
			<div class="fx67ll-setting-radio">
				<el-radio-group v-model="isCollapse" v-if="isAside">
					<el-radio-button :label="false">展开</el-radio-button>
					<el-radio-button :label="true">收起</el-radio-button>
				</el-radio-group>
			</div>
			<div class="fx67ll-setting-radio">
				<el-radio-group v-model="isAside" @change="asideChange()">
					<el-radio-button :label="true">竖向</el-radio-button>
					<el-radio-button :label="false">横向</el-radio-button>
				</el-radio-group>
			</div>
		</div>
		<el-menu
			class="fx67ll-layout-aside"
			v-if="isAside"
			:class="{ 'fx67ll-layout-aside-open': !isCollapse, 'fx67ll-layout-aside-close': isCollapse }"
			:collapse="isCollapse"
			:collapse-transition="false"
			@open="handleOpen()"
			@close="handleClose()"
		>
			<el-submenu index="1">
				<template slot="title">
					<i class="el-icon-platform-eleme"></i>
					<span slot="title">多级导航</span>
				</template>
				<el-submenu index="1-1">
					<span slot="title">测试用导航 1</span>
					<el-menu-item index="1-1">测试用导航 1-1</el-menu-item>
					<el-menu-item index="1-2">测试用导航 1-2</el-menu-item>
				</el-submenu>
				<el-menu-item index="1-2">测试用导航 2</el-menu-item>
				<el-submenu index="1-3">
					<span slot="title">测试用导航 3</span>
					<el-menu-item index="1-4-1">测试用导航 3-1</el-menu-item>
				</el-submenu>
			</el-submenu>
			<el-menu-item index="2">
				<i class="el-icon-info"></i>
				<span slot="title">一级导航</span>
			</el-menu-item>
			<el-menu-item index="3" disabled>
				<i class="el-icon-question"></i>
				<span slot="title">禁用导航</span>
			</el-menu-item>
			<el-menu-item index="4">
				<a href="https://www.fx67ll.com" target="_blank"><i class="el-icon-s-promotion"></i></a>
				<span slot="title">fx67ll.com</span>
			</el-menu-item>
			<el-menu-item index="5">
				<a href="https://www.fx67ll.xyz" target="_blank"><i class="el-icon-s-promotion"></i></a>
				<span slot="title">fx67ll.xyz</span>
			</el-menu-item>
		</el-menu>
		<div
			class="fx67ll-layout-container"
			:class="{
				'fx67ll-layout-container-open': !isCollapse && isAside,
				'fx67ll-layout-container-close': isCollapse && isAside,
				'fx67ll-layout-container-transverse': !isAside
			}"
		>
			<el-menu v-if="!isAside" class="fx67ll-layout-header" mode="horizontal" @select="handleSelect()">
				<el-submenu index="1">
					<template slot="title">
						多级导航
					</template>
					<el-submenu index="1-1">
						<template slot="title">
							测试用导航 1
						</template>
						<el-menu-item index="1-1-1">测试用导航 1-1</el-menu-item>
						<el-menu-item index="1-1-2">测试用导航 1-2</el-menu-item>
					</el-submenu>
					<el-menu-item index="1-2">测试用导航 2</el-menu-item>
					<el-submenu index="1-3">
						<template slot="title">
							测试用导航 3
						</template>
						<el-menu-item index="1-3-1">测试用导航 3-1</el-menu-item>
					</el-submenu>
				</el-submenu>
				<el-menu-item index="2">一级导航</el-menu-item>
				<el-menu-item index="3" disabled>禁用导航</el-menu-item>
				<el-menu-item index="4"><a href="https://www.fx67ll.com" target="_blank">fx67ll.com</a></el-menu-item>
				<el-menu-item index="5"><a href="https://www.fx67ll.xyz" target="_blank">fx67ll.xyz</a></el-menu-item>
			</el-menu>
			<div
				class="fx67ll-layout-view"
				:class="{
					'fx67ll-layout-transverse-open': !isAside,
					'fx67ll-layout-transverse-close': isAside
				}"
			>
				<keep-alive :include="whiteList" :exclude="blackList" :max="amount"><router-view :key="key"></router-view></keep-alive>
			</div>
		</div>
	</div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
	name: 'layout',
	data() {
		return {
			// 保持页面在后台不销毁白名单
			whiteList: [],
			// 保持页面在后台不销毁黑名单
			blackList: [],
			// 保持页面在后台的最大数量
			amount: 99999,
			// 是否展开侧面板
			isCollapse: true,
			// 是否切换横向菜单
			isAside: true
		};
	},
	watch: {
		// 监听是否展开侧面板
		isCollapse: {
			deep: true,
			handler: function(newval, oldVal) {
				this.setOptions();
			}
		},
		// 监听是否切换横向菜单
		isAside: {
			deep: true,
			handler: function(newval, oldVal) {
				this.setOptions();
			}
		}
	},
	computed: {
		key() {
			return this.$route.path;
		}
	},
	mounted() {
		// console.log(this.$route.path);
		this.getOldOptions();
	},
	methods: {
		// 如果切换横竖布局，则刷新一下页面
		asideChange() {
			window.location.reload();
		},
		// 获取之前设置好的配置
		getOldOptions() {
			if (Cookies.get('Layout-Info') && Cookies.getJSON('Login-Info')) {
				if (Cookies.getJSON('Layout-Info').userName === Cookies.getJSON('Login-Info').userName) {
					this.isCollapse = Cookies.getJSON('Layout-Info').isCollapse;
					this.isAside = Cookies.getJSON('Layout-Info').isAside;
				}
			}
		},
		// 设置配置，布局信息仅在登录信息有效期内有效，且仅限本账号有效
		setOptions() {
			let validityTime, userName;

			// 获取登录过期时间信息
			if (Cookies.get('rememberMe')) {
				if (JSON.parse(Cookies.get('rememberMe'))) {
					userName = Cookies.getJSON('Login-Info').userName;
					validityTime = Cookies.getJSON('Login-Info').validityTime;
				}
			}

			// 设置Cookies路径和过期时间
			let path = window.location.href;
			let expires = validityTime;

			// 装配布局信息
			Cookies.set(
				'Layout-Info',
				{
					isCollapse: this.isCollapse,
					isAside: this.isAside,
					userName: userName
				},
				{ expires: expires, path: path }
			);
		},
		// 菜单展开
		handleOpen(key, keyPath) {
			// console.log(key, keyPath);
		},
		// 菜单关闭
		handleClose(key, keyPath) {
			// console.log(key, keyPath);
		},
		// 菜单选择
		handleSelect(key, keyPath) {
			// console.log(key, keyPath);
		}
	}
};
</script>

<style lang="less" scoped="scoped">
@aside-width-open: 240px;
@aside-width-close: 65px;
@transition-time: 0.2s;
@header-height: 65px;
.fx67ll-setting-box {
	width: 300px;
	position: absolute;
	bottom: 20px;
	right: 20px;
	z-index: 99999;
	display: flex;
	justify-content: space-between;
	.fx67ll-setting-radio {
		margin-bottom: 10px;
	}
}
.fx67ll-layout-box {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	.fx67ll-layout-aside {
		transition: width @transition-time;
		height: 100%;
	}
	.fx67ll-layout-aside-open {
		width: @aside-width-open;
	}
	.fx67ll-layout-aside-close {
		width: @aside-width-close;
	}
	.fx67ll-layout-container {
		transition: width @transition-time;
		height: 100%;
		.fx67ll-layout-header {
			width: 100%;
		}
		.fx67ll-layout-view {
			width: 100%;
			transition: height @transition-time;
		}
	}
	.fx67ll-layout-container-open {
		width: calc(100% - @aside-width-open);
	}
	.fx67ll-layout-container-close {
		width: calc(100% - @aside-width-close);
	}
	.fx67ll-layout-container-transverse {
		width: 100%;
	}
	.fx67ll-layout-transverse-open {
		height: calc(100% - @header-height);
	}
	.fx67ll-layout-transverse-close {
		height: 100%;
	}
}
</style>
