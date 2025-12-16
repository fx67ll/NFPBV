<template>
	<div class="jdsms-box">
		<div class="jdsms-right-btnbox">
			<el-select v-model="dateType" placeholder="请选择查询方式" class="jdsms-right-btn-select"
				@change="dateTypeChange()">
				<el-option label="月查询" :value="0"></el-option>
				<el-option label="日查询" :value="1"></el-option>
				<el-option label="自定义" :value="2"></el-option>
			</el-select>
			<el-date-picker v-if="dateType === 0" v-model="month" type="month" value-format="yyyy-MM"
				placeholder="请选择月份" class="jdsms-right-btn-date" @change="monthChange()"></el-date-picker>
			<el-date-picker v-if="dateType === 1" v-model="date" type="date" value-format="yyyy-MM-dd"
				placeholder="请选择日期" class="jdsms-right-btn-date" @change="dateChange()"></el-date-picker>
			<el-date-picker v-if="dateType === 2" v-model="time" type="daterange" align="right" unlink-panels
				range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
				value-format="yyyy-MM-dd" class="jdsms-right-btn-date-long" @change="timeChange()"></el-date-picker>
			<el-button type="primary" icon="el-icon-search" class="jdsms-right-btn-search"
				@click="handleSearch">查询满18周岁的人</el-button>
			<el-button type="default" icon="el-icon-close" circle @click="handleReset"></el-button>
			<el-button type="danger" class="jdsms-right-btn-right" @click="handleLoginOut">
				退出登录
				<i class="el-icon-male el-icon--right"></i>
			</el-button>
			<el-button type="success" class="jdsms-right-btn-right" @click="handleAdd">
				新增
				<i class="el-icon-upload el-icon--right"></i>
			</el-button>
			<el-button type="text" class="jdsms-right-btn-text" @click="openTips">页面简介</el-button>
		</div>
		<div class="jdsms-right-table">
			<el-table :data="tableData" style="width: 100%" :max-height="tableHeight" v-loading="loading">
				<el-table-column type="index" label="序号" width="180"></el-table-column>
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column label="性別">
					<template slot-scope="scope">
						<span v-show="scope.row.sex === true">男</span>
						<span v-show="scope.row.sex === false">女</span>
					</template>
				</el-table-column>
				<el-table-column prop="birth" label="出生日期"></el-table-column>
				<el-table-column prop="phone" label="手机号码"></el-table-column>
				<el-table-column prop="bro" label="备注信息"></el-table-column>
				<el-table-column prop="createTime" label="创建日期"></el-table-column>
				<el-table-column fixed="right" label="操作" width="180">
					<template slot-scope="scope">
						<el-button @click.native.prevent="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
						<!-- <el-button @click.native.prevent="handleCheck(scope.row)" type="text" size="small">表示</el-button> -->
						<el-button @click.native.prevent="handleDelete(scope.row)" type="text" size="small"
							style="color: red;">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryParams.pageIndex" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
				layout="total, sizes, prev, pager, next, jumper" :total="total"
				class="jdsms-right-pagination"></el-pagination>
		</div>
		<el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="420px"
			:before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="姓名" prop="name"><el-input v-model="form.name" placeholder="请输入姓名"
						class="form-item"></el-input></el-form-item>
				<el-form-item label="性別" prop="sex">
					<el-select v-model="form.sex" :clearable="true" placeholder="请选择性别" class="form-item">
						<el-option label="男" :value="true"></el-option>
						<el-option label="女" :value="false"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="出生日期" prop="birth">
					<el-date-picker v-model="form.birth" value-format="yyyy-MM-dd" type="date" placeholder="请选择出生日期"
						class="form-item"></el-date-picker>
				</el-form-item>
				<el-form-item label="手机号码" prop="phone"><el-input v-model="form.phone" placeholder="请输入手机号码"
						class="form-item"></el-input></el-form-item>
				<!-- 原来是家人，现在改为备注信息 -->
				<el-form-item label="备注信息" prop="bro"><el-input v-model="form.bro" placeholder="请输入备注信息"
						class="form-item"></el-input></el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCancel()">取消</el-button>
				<el-button type="primary" @click="submitForm()">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		listStudent,
		getStudent,
		addStudent,
		updateStudent,
		delStudent
	} from '@api/student.js';
	import moment from 'moment';
	import _ from 'underscore';
	import Cookies from 'js-cookie';

	export default {
		name: 'index',
		data() {
			return {
				// 表单
				form: {
					_id: null,
					name: null,
					sex: null,
					birth: null,
					phone: null,
					bro: null
				},
				// 表单校验
				rules: {
					name: [{
						required: true,
						message: '请输入姓名！',
						trigger: 'blur'
					}],
					sex: [{
						required: true,
						message: '请选择性别！',
						trigger: 'blur'
					}],
					birth: [{
						required: true,
						message: '请选择出生日期！',
						trigger: 'blur'
					}],
					phone: [{
							required: true,
							message: '请输入手机号码！',
							trigger: 'blur'
						},
						{
							pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
							message: '手机号码格式错误！'
						}
					],
					bro: [{
						required: true,
						message: '请输入备注信息！',
						trigger: 'blur'
					}]
				},
				// 查询类型
				dateType: 0,
				// 查询月份
				// month: moment().format('YYYY-MM'),
				month: '',
				// 查询日期
				date: '',
				// 查询日期间隔
				time: [],
				// 日期控件快捷选择
				pickerOptions: {
					shortcuts: [{
							text: '最近一周',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit('pick', [start, end]);
							}
						},
						{
							text: '最近一月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								picker.$emit('pick', [start, end]);
							}
						},
						{
							text: '最近三个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
								picker.$emit('pick', [start, end]);
							}
						}
					]
				},
				// 表格动态最大高度，需要随布局同步处理
				tableHeight: window.innerHeight - 210,
				// 表格数据
				tableData: [],
				// 列表查询参数
				queryParams: {
					// 当前页
					pageIndex: 1,
					// 页数
					pageSize: 10,
					// 按时间查询，18年前的当前月开始和结束时间
					// startTime: moment()
					// 	.subtract(18, 'years')
					// 	.startOf('month')
					// 	.format('YYYY-MM-DD'),
					// endTime: moment()
					// 	.subtract(18, 'years')
					// 	.endOf('month')
					// 	.format('YYYY-MM-DD')
					startTime: '',
					endTime: ''
				},
				// 当前数据总量
				total: 0,
				// 是否隐藏弹窗
				dialogVisible: false,
				// 弹窗标题
				dialogTitle: '弹窗',
				// 列表刷新状态
				loading: false
			};
		},
		mounted() {
			// this.initTableData();
			this.getLayout();
			this.getList();
		},
		methods: {
			// 打开页面介绍
			openTips() {
				this.$alert(
					`<br/>
				<strong> 本项目是 <a href="https://www.fx67ll.com" target="_blank">fx67ll</a> 基于 Express & MongoDB 的 Nodejs 简易演示项目 </strong>  <br/><br/>
				<strong> 本页面对日常开发中必备的前端逻辑做了完善的处理，欢迎找茬 &nbsp;&nbsp; (✪ω✪) </strong>  <br/><br/>
				<strong> 本页面用于测试基础业务，主要包括 登录注册 和 CRUD 功能 &nbsp;&nbsp;  (>▽<) </strong>  <br/><br/>
				<strong> 每个账号均可独立操作 &nbsp;&nbsp; (๑•̀ㅂ•́)و✧ </strong>  <br/><br/>
				<strong> 有任何问题请联系管理员 &nbsp; <em>fx67ll@qq.com</em> &nbsp; ┗|｀O′|┛ </strong>  <br/><br/>
				<strong> Thanks♪(･ω･)ﾉ </strong>`,
					'页面简介', {
						dangerouslyUseHTMLString: true,
						confirmButtonText: '我知道了',
						customClass: 'alertDialog',
						callback: action => {
							// this.$message({
							// 	type: 'info',
							// 	message: `action: ${action}`
							// });
						}
					}
				);
			},
			// 获取布局信息
			// fx67ll：这里需要寻找更为通用的方法，不然每个页面都需要做单独处理？？？？？？
			getLayout() {
				if (Cookies.get('Layout-Info')) {
					if (!Cookies.getJSON('Layout-Info').isAside) {
						// 如果有横向菜单，除了减去所有表格信息之外的高度，还要减去横向菜单的高度
						this.tableHeight = window.innerHeight - 210 - 61;
					} else {
						// 侧向菜单，固定减去头部、表头和底部的高度
						this.tableHeight = window.innerHeight - 210;
					}
				}
			},
			// 退出登录
			handleLoginOut() {
				Cookies.remove('User-Token');
				if (!Cookies.get('User-Token')) {
					this.authOK('提示', '退出登录成功！', 444);
					this.$router.push({
						name: 'login'
					});
				}
			},
			// 清除查询条件
			handleReset() {
				this.dateType = 0;
				this.month = null;
				this.date = null;
				this.time = [];
				this.queryParams.startTime = '';
				this.queryParams.endTime = '';
				this.getList();
			},
			// 切换查询类型
			dateTypeChange() {
				this.month = null;
				this.date = null;
				this.time = [];
				this.queryParams.startTime = '';
				this.queryParams.endTime = '';
				this.getList();
			},
			timeChange() {
				if (this.time) {
					this.queryParams.startTime = moment(this.time[0])
						.subtract(18, 'years')
						.format('YYYY-MM-DD');
					this.queryParams.endTime = moment(this.time[1])
						.subtract(18, 'years')
						.format('YYYY-MM-DD');
				} else {
					this.queryParams.startTime = '';
					this.queryParams.endTime = '';
				}
				// this.getList();
			},
			dateChange() {
				if (this.date) {
					this.queryParams.startTime = moment(this.date)
						.subtract(18, 'years')
						.format('YYYY-MM-DD');
					this.queryParams.endTime = moment(this.date)
						.subtract(18, 'years')
						.format('YYYY-MM-DD');
				} else {
					this.queryParams.startTime = '';
					this.queryParams.endTime = '';
				}
				// this.getList();
			},
			// 月份选择的时候获取18年前的当前月开始和结束时间
			monthChange() {
				if (this.month) {
					this.queryParams.startTime = moment(this.month)
						.subtract(18, 'years')
						.startOf('month')
						.format('YYYY-MM-DD');
					this.queryParams.endTime = moment(this.month)
						.subtract(18, 'years')
						.endOf('month')
						.format('YYYY-MM-DD');
				} else {
					this.queryParams.startTime = '';
					this.queryParams.endTime = '';
				}
				// this.getList();
			},
			// 获取表格数据
			getList() {
				this.loading = true;
				listStudent(this.queryParams).then(res => {
					_.each(res.data, function(item, key) {
						item.birth = moment(item.birth).format('YYYY-MM-DD');
						item.createTime = moment(item.createTime).format('YYYY-MM-DD');
					});
					this.tableData = res.data;
					this.total = res.total;
					this.loading = false;
				});
			},
			// 拦截关闭弹窗事件
			handleClose(done) {
				done();
			},
			// 每页条数改变
			handleSizeChange(val) {
				this.queryParams.pageSize = val;
				this.queryParams.pageIndex = 1;
				this.getList();
			},
			// 当前页改变
			handleCurrentChange(val) {
				this.queryParams.pageIndex = val;
				this.getList();
			},
			// 查询
			handleSearch() {
				// this.$message.info('機能開発中');
				if (this.queryParams.startTime && this.queryParams.endTime) {
					this.getList();
				} else {
					this.msgError('请先选择查询日期！');
				}
			},
			// 新增
			handleAdd() {
				this.dialogTitle = '新增';
				this.clearForm();
				this.dialogVisible = true;
			},
			// 编辑
			handleEdit(row) {
				this.dialogTitle = '编辑';
				this.form = row;
				this.dialogVisible = true;
			},
			// 查看，暂时不需要
			handleCheck() {
				this.dialogTitle = '查看';
				// this.dialogVisible = true;
			},
			// 清空表单
			clearForm() {
				this.$nextTick(() => {
					this.form = {
						_id: null,
						name: null,
						sex: null,
						birth: null,
						phone: null,
						bro: null
					};
					this.$refs.form.resetFields();
				});
			},
			// 取消按钮
			handleCancel() {
				this.clearForm();
				this.dialogVisible = false;
			},
			// 提交表单
			submitForm() {
				if (!this.loading) {
					this.loading = true;
					this.$refs['form'].validate(valid => {
						if (valid) {
							if (this.form._id != undefined) {
								updateStudent(this.form).then(res => {
									this.clearForm();
									this.dialogVisible = false;
									this.msgOK(res.msg);
									this.getList();
								});
							} else {
								addStudent(this.form).then(res => {
									this.clearForm();
									this.dialogVisible = false;
									this.msgOK(res.msg);
									this.getList();
								});
							}
						} else {
							this.loading = false;
						}
					});
				}
			},
			// 删除
			handleDelete(row) {
				this.$confirm('删除操作不可逆，确定删除吗?', '删除', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(function() {
						return delStudent(row._id);
					})
					.then(() => {
						this.getList();
						this.msgOK('删除成功!');
					});
			},
			// 表格数据初始化
			initTableData() {
				if (this.tableData.length < 100) {
					this.tableData.push({
						name: '安倍晋三',
						sex: '男',
						birth: '2021-03-23',
						phone: '18902380987',
						email: '23456@qq.com',
						bro: '安倍晋六'
					});
					this.initTableData();
				}
			}
		}
	};
</script>

<style lang="less">
	// 去除表格底部的灰色线条
	.el-table--border::after,
	.el-table--group::after,
	.el-table::before {
		background-color: transparent;
	}

	// 去除表格固定列的底部灰色线条
	.el-table__fixed-right::before,
	.el-table__fixed::before {
		background-color: transparent;
	}

	.alertDialog {
		width: 500px !important;
	}
</style>
<style lang="less" scoped="scoped">
	.jdsms-box {
		width: 100%;
		height: 100%;
		.ban-user-select();

		.jdsms-right-btnbox {
			padding: 30px 40px 30px 40px;
			border-bottom: 1px solid #e6e6e6;
			margin-bottom: 10px;
			background-color: rgba(255, 247, 101, 0.7);

			.jdsms-right-btn-select {
				width: 100px;
				margin-right: 20px;
			}

			.jdsms-right-btn-date {
				width: 150px;
				margin-right: 20px;
			}

			.jdsms-right-btn-date-long {
				width: 260px;
				margin-right: 20px;
			}

			.jdsms-right-btn-search {
				margin-right: 10px;
			}

			.jdsms-right-btn-right {
				float: right;
			}

			.jdsms-right-btn-text {
				float: right;
				color: #000000;
				line-height: 20px;
				margin-right: 10px;
			}
		}

		.jdsms-right-table {
			// 减去按钮框的高度
			height: calc(100% - 120px);
			padding: 0 40px 0 40px;

			.jdsms-right-pagination {
				// margin-top: 40px;
				position: relative;
				top: 40px;
			}
		}

		.form-item {
			width: 85%;
		}
	}
</style>