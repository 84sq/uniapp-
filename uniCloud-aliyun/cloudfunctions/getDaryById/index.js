'use strict';
const db = uniCloud.database()
const daryDb = db.collection('diary')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('getdarybyid----------------------event : ', event)
	let res = await daryDb.where({
		_id: event.daryid,
		}).get();
	//返回数据给客户端
	return res
};
