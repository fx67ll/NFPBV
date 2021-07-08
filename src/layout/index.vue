<template>
	<div class="fx67ll-layout-box">
		<div class="fx67ll-layout-type-A">
			<div class="fx67ll-layout-aside"></div>
			<div class="fx67ll-layout-container">
				<div class="fx67ll-layout-header"></div>
				<div class="fx67ll-layout-view">
					<keep-alive :include="whiteList" :exclude="blackList" :max="amount"><router-view :key="key"></router-view></keep-alive>
				</div>
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
			amount: 99999
		};
	},
	computed: {
		key() {
			return this.$route.path;
		}
	},
	mounted() {
		console.log(this.$route.path);
	}
};
</script>

<style lang="less" scoped="scoped">
@aside-width: 240px;
.fx67ll-layout-box {
	width: 100%;
	height: 100%;
	.fx67ll-layout-type-A {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		.fx67ll-layout-aside {
			width: @aside-width;
			height: 100%;
			background-color: #42b983;
		}
		.fx67ll-layout-container {
			width: calc(100% - @aside-width);
			height: 100%;
			.fx67ll-layout-header{
				width: 100%;
				height: 80px;
				background-color: #ef8e81;
			}
			.fx67ll-layout-view{
				width: 100%;
				height: calc(~"100% - 80px");
			}
		}
	}
}
</style>
