'use strict';
const db = uniCloud.database()
const daryDb = db.collection('diary')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('remove-------------event : ', event)
	let daryDel = await daryDb.doc(event.daryid).remove();
	//返回数据给客户端
	return daryDel
};
