const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png"
  },

  onLoad: function(params) {
    var that = this;
    var user = app.userInfo;
    wx.showLoading({
      title: '请等待...',
    });
    wx.request({
      url: app.serverUrl + '/user/query?userId=' + user.id,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        var data = res.data;
        if (data.status == 200) {
          var userInfo = data.data;
          var faceImage = that.data.faceUrl;
          if(userInfo.faceImage != null
              && userInfo.faceImage != ""
              && userInfo.faceImage != undefined) {
              faceImage = userInfo.faceImage;
          }
          that.setData({
            faceUrl: app.serverUrl + faceImage,
            nickname: userInfo.nickname,
            fansCount: userInfo.fansCount,
            followCount: userInfo.followCount,
            receivedLikeCount: userInfo.receivedLikeCount
          });
        }
      }
    });
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
      success: function(res) {
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
  },

  changeAvatar: function() {
    var oriThis = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function(res) {
        var tempFilePath = res.tempFilePaths;
        wx.showLoading({
          title: '上传中...'
        })

        var serverUrl = app.serverUrl;
        wx.uploadFile({
          url: serverUrl + '/user/uploadAvatar?userId=' + app.userInfo.id,
          filePath: tempFilePath[0],
          name: 'file',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            var data = JSON.parse(res.data);
            wx.hideLoading();
            if (data.status == 200) {
              wx.showToast({
                title: '上传成功',
                icon: 'success'
              })
              var imageUrl = data.data;
              oriThis.setData({
                faceUrl: serverUrl + imageUrl
              });
            } else if(data.status == 500) {
              wx.showToast({
                title: data.msg,
                icon: 'none'
              })
            }
          }
        })
      }
    })
  },

  uploadVideo: function() {
    wx.chooseVideo({
      sourceType: ['album'],
      maxDuration: 60,
      success(res) {
        var duration = res.duration;
        var width = res.width;
        var height = res.height;
        var tempVideoUrl = res.tempFilePath;
        var videoCoverUrl = res.thumbTempFilePath;
        if(duration > 15) {
          wx.showToast({
            title: '视频长度不能超过 15 秒',
            icon: 'none',
            duration: 3000
          })
        } else if(duration < 5) {
          wx.showToast({
            title: '视频长度不能少于 5 秒',
            icon: 'none',
            duration: 3000
          })
        } else {
          // navigate to bgm choosing page

        }
      }
    })
  } 
})