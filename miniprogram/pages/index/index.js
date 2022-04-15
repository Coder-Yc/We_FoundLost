const app = getApp()
Page({
  data: {
    interval:3000,
  },
  // async load_() {
  //   wx.showLoading({
  //     title: "玩了命在加载呢！",
  //   });
  //   const db = wx.cloud.database()
  //   const lost = await db.collection('list')
  //     .where({
  //       type: 'lost'
  //     })
  //     .get()
    
  // },
  onShow: function () {
    app.editTabbar()
    // this.load_()
  },
})