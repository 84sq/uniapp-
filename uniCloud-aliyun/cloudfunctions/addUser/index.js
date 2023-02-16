'use strict';
const db = uniCloud.database()
const userDb = db.collection('user')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('adduser---event : ');
	let addUser = await userDb.add(event);
	//返回数据给客户端
	return addUser
};
