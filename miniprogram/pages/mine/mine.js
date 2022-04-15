// pages/mine/mine.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    isHidden: true,
    userInfo: {},
    openid: '',
  },
  onLoad() {
    app.editTabbar();
    let that = this
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          userInfo: res.data,
          isHidden: false
        })
      }
    })
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善资料',
      success: (res) => {
        console.log(res);
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          isHidden: false
        })
        wx.getStorage({
          key: 'OPENID',
          success(res) {
            that.setData({
              openid: res.data
            })
          }
        })
        wx.cloud.callFunction({
          name: 'login',
          data: {
            userInfo: res.userInfo,
          }
        }).then(res => {
          wx.setStorageSync('OPENID', res.result.OPENID)
        })
      }
    })
  },
})