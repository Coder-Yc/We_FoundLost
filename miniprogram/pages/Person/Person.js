Page({
  data: {
    list: [],
    currentIndex: 0,
    isHidden: true
  },
  async _loadData() {
    // console.log(this.data.currentIndex);
    await wx.cloud.callFunction({
      name: 'list',
      data: {
        $url: 'getMyLostList',
        skip: this.data.currentIndex,
      }
    }).then(res => {
      // console.log(res.result.data);
      if (res.result.data != []) {
        this.setData({
          isHidden: false,
          list: [...this.data.list, ...res.result.data],
        })
      }
      // console.log(this.data.list);
    })
  },

  onLoad(options) {
    let id = options._id
    console.log();
    this._loadData()
  },
  onPullDownRefresh: function () {
    this.setData({
      list: []
    })
    this._loadData()
  },

  onReachBottom: function () {
    let temp = this.data.currentIndex + 10
    this.setData({
      currentIndex: temp
    })
    this._loadData()
  },

})