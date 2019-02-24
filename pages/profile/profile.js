const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png"
  },

  onLoad: function(params) {

  },

  logout: function() {
    var user = app.userInfo;
    wx.showLoading({
      title: '请等待...',
    });
    wx.request({
      url: app.serverUrl + '/logout?userId=' + user.id,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        var status = res.data.status;
        if (status == 200) {
          wx.showToast({
            title: '注销成功',
            icon: 'success',
            duration: 3000
          });
          app.userInfo = null;
          wx.redirectTo({
            url: '../userLogin/login',
          })
        }
      }
    });
  }
})
