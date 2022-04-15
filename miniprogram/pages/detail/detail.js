// pages/detail/detail.js
Page({
  data: {
    data: {}
  },
  onLoad: function (options) {
    let id = options._id
    console.log(id);
    wx.cloud.callFunction({
      name: 'list',
      data: {
        $url: 'getSingleList',
        _id: id
      }
    }).then(res => {
      console.log(res.result.data);
      this.setData({
        data: res.result.data[0],
      })
    })
  },
  showPic(event) {
    var that = this
    console.log(event.currentTarget.dataset.src)
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl,
      urls: that.data.data.imgs
    })
  },
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.data.contact
    })
  }
})