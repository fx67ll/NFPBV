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
				<el-radio-group v-model="isAside">
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
			@open="handleOpen"
			@close="handleClose"
		>
			<el-submenu index="1">
				<template slot="title">
					<i class="el-icon-location"></i>
					<span slot="title">导航一</span>
				</template>
				<el-menu-item-group>
					<span slot="title">分组一</span>
					<el-menu-item index="1-1">选项1</el-menu-item>
					<el-menu-item index="1-2">选项2</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group title="分组2"><el-menu-item index="1-3">选项3</el-menu-item></el-menu-item-group>
				<el-submenu index="1-4">
					<span slot="title">选项4</span>
					<el-menu-item index="1-4-1">选项1</el-menu-item>
				</el-submenu>
			</el-submenu>
			<el-menu-item index="2">
				<i class="el-icon-menu"></i>
				<span slot="title">导航二</span>
			</el-menu-item>
			<el-menu-item index="3" disabled>
				<i class="el-icon-document"></i>
				<span slot="title">导航三</span>
			</el-menu-item>
			<el-menu-item index="4">
				<i class="el-icon-setting"></i>
				<span slot="title">导航四</span>
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
			<el-menu v-if="!isAside" class="fx67ll-layout-header" mode="horizontal" @select="handleSelect">
				<el-menu-item index="1">处理中心</el-menu-item>
				<el-submenu index="2">
					<template slot="title">
						我的工作台
					</template>
					<el-menu-item index="2-1">选项1</el-menu-item>
					<el-menu-item index="2-2">选项2</el-menu-item>
					<el-menu-item index="2-3">选项3</el-menu-item>
					<el-submenu index="2-4">
						<template slot="title">
							选项4
						</template>
						<el-menu-item index="2-4-1">选项1</el-menu-item>
						<el-menu-item index="2-4-2">选项2</el-menu-item>
						<el-menu-item index="2-4-3">选项3</el-menu-item>
					</el-submenu>
				</el-submenu>
				<el-menu-item index="3" disabled>消息中心</el-menu-item>
				<el-menu-item index="4"><a href="https://www.fx67ll.com" target="_blank">订单管理</a></el-menu-item>
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
export default {
	name: 'layout',
	data() {
		return {
			whiteList: [],
			blackList: [],
			amount: 99999,
			isCollapse: false,
			isAside: true
		};
	},
	computed: {
		key() {
			return this.$route.path;
		}
	},
	mounted() {
		console.log(this.$route.path);
	},
	methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		},
		handleSelect(key, keyPath) {
			console.log(key, keyPath);
		}
	}
};
</script>

<style lang="less" scoped="scoped">
@aside-width-open: 240px;
@aside-width-close: 65px;
@transition-time: 0.2s;
@header-height: 80px;
.fx67ll-setting-box {
	position: absolute;
	bottom: 20px;
	right: 20px;
	z-index: 999;
	.fx67ll-setting-radio {
		margin-bottom: 20px;
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
