<template>
	<view class="body">
		<view class="dary-list" v-for="(item,i) in daryList" :key="i" @click="gotoDetail">
			<view class="dary-item" @click="daryDtail(item._id)">
				<view class="dary-image" v-if="item.imaging">
					<image :src="item.imaging[0] ? item.imaging[0] : images"></image>
				</view>
				<view class="item-right">
					<view class="dary-title">
						<view class="title">{{item.title}}</view>
						<view class="dary-content">
							<text>
								{{item.content}}
							</text>
						</view>
						<view class="dary-date" v-if="item.darydate">
							{{item.darydate.year}}-{{item.darydate.month}}-{{item.darydate.day}}
						</view>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				daryList: [],
				images: "../../../static/good.png",
			}
		},
		onLoad(opt) {
			this.getDate(opt.userId)
		},
		methods: {
			getDate: function(_id) {
				uniCloud.callFunction({
					name: "getDaryByLike",
					data: {
						"userId": _id,
						"goodState": true
					},
					success: (e) => {
						this.daryList = e.result.data;
					},
					fail: (err) => {
						console.log(err);
					}
				});
			},
			gotoDetail: function(e) {
				uni.switchTab({
					url: '/pages/tabbar/index/index'
				})
			}
		}
	}
</script>

<style>
	@import '@/lib/css/goodLike.css';
</style>
