//app.js
App({
  globalData: {
    userInfo: {}
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'findlost-3gxnjxpi30eec72b',
      })
    }
    wx.hideTabBar()

  },
  editTabbar: function () {
    //隐藏系统tabbar
    wx.hideTabBar()
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  async login(successCallBack, noAuthCallBack) {
    let userInfo = wx.getStorageSync('userinfo')
    const plogin = new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                resolve(res.userInfo)
              },
              fail: err => {
                console.log(err)
                wx.showToast({
                  title: '获取个人信息失败，请重启小程序再试',
                  icon: 'loading'
                })
                reject(err)
              }
            })
          } else {
            reject('还未授权')
          }
        }
      })
    })

    if (!userInfo) {
      try {
        userInfo = await plogin
      } catch (e) {
        console.log(e)
        noAuthCallBack && noAuthCallBack()
        return
      }
    }
    if (userInfo) {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          $url: 'login',
          userInfo
        },
        success: res => {
          console.log('[云函数] [user] : ', res)
          successCallBack && successCallBack(userInfo)
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
          wx.showToast({
            title: '登陆失败，请检查微信版本是否为最新',
            icon: 'loading'
          })
        }
      })
      wx.setStorageSync('userinfo', userInfo)
      return userInfo
    }
  },
  globalData: {
    userInfo: null,
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#333333",
      "selectedColor": "#26C55E",
      "list": [{
          "pagePath": "/pages/index/index",
          "iconPath": "icon/icon_home.png",
          "selectedIconPath": "icon/icon_home_HL.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/middle/middle",
          "iconPath": "icon/icon_release.png",
          "isSpecial": true,
          "text": "发布"
        },
        {
          "pagePath": "/pages/mine/mine",
          "iconPath": "icon/icon_mine.png",
          "selectedIconPath": "icon/icon_mine_HL.png",
          "text": "我的"
        }
      ]
    }
  }
})