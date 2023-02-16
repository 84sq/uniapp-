'use strict';
const db = uniCloud.database()
const UserDb = db.collection('diary')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let res = await UserDb.doc(event.diaryId).update({
		goodState: event.goodState
	});
	
	//返回数据给客户端
	return event
};
