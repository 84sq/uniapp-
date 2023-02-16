<template>
	<view>
		<view class="container">
			<view class="uninput">
				<input v-model="userFrom.username" @blur="getUsername" placeholder="请输入需要注册用户名" type="text" />
			</view>
			<view class="uninput">
				<input v-model="userFrom.password" placeholder="请输入您的注册密码" type="safe-password" />
			</view>
			<view class="uninput">
				<input v-model="userFrom.nickname" placeholder="请输入您的昵称" type="text" />
			</view>
			<view class="uninput">
				<input v-model="userFrom.sign" placeholder="请输入您的个性签名" type="text" />
			</view>
		</view>
		<view class="btn">
			<button type="primary" @click="register">注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userFrom: {
					username: "",
					password: "",
					nickname: "",
					sign: "",
					userImage: "../../../static/panda.png"
				}
			}
		},
		methods: {
			register: function(e) {
				let that = this;
				uniCloud.callFunction({
					name: 'getUserByUsername',
					data: {
						"username": that.username
					},
					success: (e) => {
						console.log(e)
						if (e.result.affectedDocs > 0) {
							uni.showToast({
								title: '已经有该用户了',
								duration: 3000,
								icon: 'error'
							});
						} else if (e.result.affectedDocs == 0) {
							uniCloud.callFunction({
								name: 'addUser',
								data: this.userFrom,
								success: (e) => {
									console.log(e.result);
									uni.showToast({
										title: '注册成功',
										duration: 3000
									});
									setTimeout(function(e) {
										uni.navigateTo({
											url: '/pages/user/login/login'
										})
									}, 1000)
								}
							})
						}

					},
					fail: (err) => {
						console.log(err)

					}
				})

			},
			getUsername: function(e) {
				this.username = e.detail.value
				console.log(this.username)
			}
		}
	}
</script>

<style>
	@import '@/lib/css/login.css';
</style>
