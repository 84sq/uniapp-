'use strict';
const db = uniCloud.database()
const daryDb = db.collection('diary')

exports.main = async (event, context) => {
	console.log('getDary----------event : ', event.userId)
	let res = await daryDb.where({
		userId: event.userId
	}).get();
	//event为客户端上传的参数
	

	//返回数据给客户端
	return res
};
