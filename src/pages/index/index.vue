<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
      <text class="login-status">登录状态: {{ loginStatus }}</text>
    </view>
    
    <!-- 功能导航按钮 -->
    <view class="nav-buttons">
      <button class="nav-btn primary" @click="goToConflictResolution">
        🧠 沟通调节助手
      </button>
      <button class="nav-btn secondary" @click="showComingSoon">
        📊 情绪分析
      </button>
      <button class="nav-btn secondary" @click="showComingSoon">
        💬 对话练习
      </button>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="logout-btn" @click="handleLogout">
        🚪 退出登录
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '欢迎使用心禾伴',
      loginStatus: '检查中...',
    }
  },
  onLoad() {
    this.checkLoginStatus()
  },
  onShow() {
    // 每次页面显示时都检查登录状态
    this.checkLoginStatus()
  },
  methods: {
    checkLoginStatus() {
      // 检查是否已登录
      try {
        const isLoggedIn = uni.getStorageSync('isLoggedIn')
        console.log('登录状态检查:', isLoggedIn)
        
        if (!isLoggedIn) {
          console.log('未登录，跳转到登录页面')
          this.loginStatus = '未登录'
          // 未登录，跳转到登录页面
          uni.redirectTo({
            url: '/pages/login/login'
          })
        } else {
          console.log('已登录，显示首页')
          this.loginStatus = '已登录'
        }
      } catch (error) {
        console.error('检查登录状态失败:', error)
        this.loginStatus = '检查失败'
        // 如果检查失败，也跳转到登录页面
        uni.redirectTo({
          url: '/pages/login/login'
        })
      }
    },
    goToConflictResolution() {
      uni.navigateTo({
        url: '/pages/conflict-resolution/conflict-resolution'
      })
    },
    showComingSoon() {
      uni.showToast({
        title: '功能开发中，敬请期待',
        icon: 'none'
      })
    },
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除登录状态
            uni.removeStorageSync('isLoggedIn')
            uni.removeStorageSync('username')
            
            // 跳转到登录页面
            uni.redirectTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  },
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
  margin-bottom: 20rpx;
}

.login-status {
  font-size: 24rpx;
  color: #666;
  background: #f0f0f0;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
}

.nav-buttons {
  margin-top: 100rpx;
  width: 100%;
  padding: 0 40rpx;
}

.nav-btn {
  width: 100%;
  height: 100rpx;
  margin-bottom: 30rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}

.nav-btn.primary {
  background: linear-gradient(135deg, #87ceeb 0%, #5f9ea0 100%);
  color: white;
  box-shadow: 0 8rpx 20rpx rgba(135, 206, 235, 0.3);
}

.nav-btn.secondary {
  background: #f8f9fa;
  color: #333;
  border: 2rpx solid #dee2e6;
}

.nav-btn:active {
  transform: scale(0.98);
}

.logout-section {
  margin-top: 60rpx;
  width: 100%;
  padding: 0 40rpx;
}

.logout-btn {
  width: 100%;
  height: 80rpx;
  background: #f8f9fa;
  color: #666;
  border: 2rpx solid #dee2e6;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
}

.logout-btn:active {
  transform: scale(0.98);
  background: #e9ecef;
}
</style>
