// pages/userLogin/login.js
const app = getApp()

Page({
  data: {

  },

  doLogin: function(e) {
    var formObj = e.detail.value;
    var username = formObj.username;
    var password = formObj.password;

    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    } else {
      wx.showLoading({
        title: '请等待...',
      });
      wx.request({
        url: app.serverUrl + '/login',
        method: 'POST',
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res.data);
          var status = res.data.status;
          if (status == 200) {
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 3000
            })
            app.userInfo = res.data.data;
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },

  goRegisterPage: function() {
    wx.navigateTo({
      url: '../userRegist/regist',
    })
  }
})