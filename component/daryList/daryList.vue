<template>
	<view>
		<image :src="image1"></image>
		<view >{{text1}}</view>
	</view>
</template>

<script>
	export default {
		name: "daryList",
		props: {
			image1: {
				type: String,
				default: "../../static/good.png"
			},
			text1:{
				type: String,
				default: '11111111'
			}
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
