// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "findlost-3gxnjxpi30eec72b"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  let {
    userInfo,
  } = event
  let {
    OPENID
  } = cloud.getWXContext()
  db.collection('users').add({
      data: {
        _openid: OPENID,
        userInfo: userInfo
      }
    })
    .then(res => {
      console.log(res)
    })

  return {
    OPENID
  }
}