// pages/lost/lost.js
Page({

  data: {
    tmpImgs: [],
    info: {
      lost_data: ['2021', '09', '20'],
      name: '',
      place: '',
      contact: '',
      desc: '',
      imgs: []
    }
  },
  changeDate: function (e) {
    console.log('选择时间:', e.detail.value)
    const regex = /(?!-)[^-]+(?=-|$)/g;
    //  var Data = e.detail.value.match(regex);
    //  console.log(e.detail.value)
    //  console.log(typeof(e.detail.value))
    this.setData({
      lost_data: e.detail.value.match(regex)
    })
  },
  handelInput: function (e) {
    const id = 'name'
    const value = e.detail.value
    const obj = {}
    obj['info.' + id] = value
    // console.log(e.detail.value)
    this.setData(obj)
  },
  handelInpu_place: function (e) {
    const id = 'place'
    const value = e.detail.value
    const obj = {}
    obj['info.' + id] = value
    // console.log(e.detail.value)
    this.setData(obj)
  },
  handelInpu_desc: function (e) {
    const id = 'desc'
    const value = e.detail.value
    const obj = {}
    obj['info.' + id] = value
    // console.log(e.detail.value)
    this.setData(obj)
  },
  handelInput_contact: function (e) {
    const id = 'contact'
    const value = e.detail.value
    const obj = {}
    obj['info.' + id] = value
    // console.log(e.detail.value)
    this.setData(obj)
  },
  selcetPics: function (e) {
    console.log(3 - this.data.tmpImgs.length);

    if (this.data.tmpImgs.length < 3) {
      wx.chooseImage({
        count: 3 - this.data.tmpImgs.length,
        success: (res) => {
          console.log(res)
          if (res.tempFilePaths.length > 0) {
            this.setData({
              tmpImgs: [...this.data.tmpImgs, ...res.tempFilePaths]
            })
          }
        },
      })
    }
  },
  delPic: function (e) {
    const index = e.currentTarget.dataset.index
    const list = [...this.data.tmpImgs]
    list.splice(index, 1)
    this.setData({
      tmpImgs: list
    })
  },
  async save() {
    if (!this.data.info.name) {
      return wx.showToast({
        title: '丢的什么东西',
        icon: 'none'
      })
    }
    if (!this.data.info.place) {
      return wx.showToast({
        title: '在哪里丢的',
        icon: 'none'
      })
    }
    if (this.data.info.contact.length != 11) {
      return wx.showToast({
        title: '电话号码是多少',
        icon: 'none'
      })
    }
    if (this.data.tmpImgs.length === 0) {
      return wx.showToast({
        title: '好歹放张图片',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '别急，正在上传中',
        // icon: 'none'
      })
      let list = []
      for (let i = 0, len = this.data.tmpImgs.length; i < len; i++) {
        let item = this.data.tmpImgs[i]
        // console.log(item)
        const fileArr = item.split('/')
        // console.log(fileArr)
        const filename = fileArr[fileArr.length - 1]
        let res = null
        try {
          res = await wx.cloud.uploadFile({
            cloudPath: 'lostAndFound/uploads/' + (new Date()).getFullYear() + '/' + filename,
            filePath: item,
            //   success:res=>{
            //     res.fileID
            //   },
            //   fail:console.error
          })
        } catch (err) {
          wx.hideLoading()
          wx.showToast({
            title: '图片上传失败1',
            icon: 'none'
          })
          console.log(err)
          return
        }
        console.log(res.statusCode)
        if (res.statusCode === 204) {
          list.push(res.fileID)
        } else {
          console.log(res.statusCode)
          wx.hideLoading()
          return wx.showToast({
            title: '图片上传失败2',
            icon: 'none'
          })
        }
      }
      // console.log(list)
      this.setData({
        'info.imgs': list
      })
      // wx.hid
    }
    wx.showLoading({
      title: '正在保存呢..',
    })

    const db = wx.cloud.database()
    const res = await db.collection('Lost').add({
      data: this.data.info
    })
    wx.hideLoading()
    if (res) {
      console.log(res)
      wx.showToast({
        title: '保存成功了',
      })
      wx.switchTab({
        url: '/pages/index/index',
      })
      return
    } else {
      return wx.showToast({
        title: '保存失败...',
        icon: 'none'
      })
    }
  },
  async PessonlyInfo() {
    const db = wx.cloud.database();
    let user;
    try {
      user = await db.collection('users').get()
    } catch (err) {
      wx.showToast({
        title: '个人信息加载失败',
        icon: 'none'
      })
      wx.navigateBack()
    }
    console.log(user)
    if (user.data.length > 0) {

    }
  },


  onLoad: function () {

  }


})