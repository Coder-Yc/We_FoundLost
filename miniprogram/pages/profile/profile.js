// pages/profile/profile.js
Page({
  data: {
    mobile: '',
    weChat: '',
  },

  save() {
    console.log('save...');
    if (!this._validatePhoneNumber(this.data.mobile)) {
      return wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
    }
    if (this.data.weChat.trim().length === 0) {
      return wx.showToast({
        title: '请输入微信号',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '正在保存...',
    })
    wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: "updateMobileAndWeChat",
        mobile: this.data.mobile,
        weChat: this.data.weChat
      }
    }).then((res) => {
      if (res.errMsg) {

        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000
        })

      }
    })

  },
  _validatePhoneNumber(str) {
    const reg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
    return reg.test(str)
  },
  handleMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  handleWeChatInput: function (e) {
    this.setData({
      weChat: e.detail.value
    })
  },
  onLoad: function () {
    wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: "getMobileAndWeChat",
      }
    }).then((res) => {
      this.setData({
        mobile: res.result.collections[0].mobile,
        weChat: res.result.collections[0].weChat
      })
    })
  },

})