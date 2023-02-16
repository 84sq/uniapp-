'use strict';
const db = uniCloud.database()
const daryDb = db.collection('diary')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('ADD-------event : ', event);
	let addDary = await daryDb.add(event);
	//返回数据给客户端
	return addDary
};
