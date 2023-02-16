'use strict';
const db = uniCloud.database()
const userDb = db.collection('user')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let res = await userDb.doc(event.userId).update({
		userImage: event.userImage
	});
	//返回数据给客户端
	return res
};
