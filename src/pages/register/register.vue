<template>
  <view class="register-container">
    <!-- 顶部背景图区域 -->
    <view class="header-section">
      <image class="header-bg" src="/static/images/register-bg.jpg" mode="aspectFill"></image>
    </view>
    
    <!-- 表单区域 -->
    <view class="form-section">
      <view class="form-title">注册账号</view>
      
      <view class="form">
        <view class="form-group">
          <text class="input-label">账号</text>
          <input 
            type="text" 
            class="form-input" 
            v-model="formData.username" 
            placeholder="请输入您的账号" 
          />
        </view>
        
        <view class="form-group">
          <text class="input-label">密码</text>
          <input 
            type="password" 
            class="form-input" 
            v-model="formData.password" 
            placeholder="请输入您的密码" 
          />
        </view>
        
        <view class="form-group">
          <text class="input-label">邮箱</text>
          <input 
            type="email" 
            class="form-input" 
            v-model="formData.email" 
            placeholder="请输入您的邮箱" 
          />
        </view>
        
        <button 
          class="register-btn" 
          :disabled="loading" 
          @tap="handleRegister"
        >
          <text v-if="!loading" class="register-text">注册</text>
          <view v-else class="loading"></view>
        </button>
        
        <view class="login-link-container">
          <text class="login-link" @tap="goToLogin">已有账号？立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 响应式数据
const formData = reactive({
  username: '',
  email: '',
  password: ''
})

const loading = ref(false)

// 处理注册
const handleRegister = async () => {
  if (!formData.username || !formData.email || !formData.password) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }
  
  // 简单的邮箱验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    uni.showToast({
      title: '请输入有效的邮箱地址',
      icon: 'none'
    })
    return
  }
  
  loading.value = true
  
  try {
    // 模拟注册请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    uni.showToast({
      title: '注册成功',
      icon: 'success'
    })
    
    // 跳转到登录页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    
  } catch (error) {
    uni.showToast({
      title: '注册失败，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 跳转到登录页
const goToLogin = () => {
  uni.reLaunch({
    url: '/pages/login/login'
  })
}
</script>

<style scoped>
.register-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}



/* 顶部背景图区域 */
.header-section {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40vh;
  z-index: 5;
  overflow: hidden;
}

.header-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 表单区域 */
.form-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 24px 20px;
  z-index: 5;
  min-height: 58vh;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  text-align: left;
  margin-bottom: 30px;
  margin-left: 7.5%;
}



.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.form-group {
  position: relative;
}

.input-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  margin-left: 7.5%;
}

.form-input {
  width: 85%;
  margin: 0 auto;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  background: #f5f5f5;
  color: #2c3e50;
  transition: all 0.3s ease;
  outline: none;
  display: block;
}

.form-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  background: #ffffff;
}

.form-input::placeholder {
  color: rgba(44, 62, 80, 0.7);
}



.register-btn {
  width: 85%;
  margin: 0 auto;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.register-btn:active {
  transform: translateY(0);
}

.register-btn[disabled] {
  opacity: 0.7;
}

.register-text {
  color: white;
}

.loading {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-link-container {
  text-align: center;
  margin-top: 20px;
}

.login-link {
  color: #4CAF50;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .header-section {
    height: 35vh;
  }
  
  .form-section {
    min-height: 63vh;
  }
}

/* 移动端优化 */
@media (max-width: 480px) {
  .header-section {
    height: 30vh;
  }
  
  .form-section {
    min-height: 68vh;
    padding: 20px 15px;
  }
  
  .form-title {
    font-size: 20px;
    margin-left: 5%;
  }
  
  .input-label {
    margin-left: 5%;
  }
  
  .form-input {
    width: 90%;
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .register-btn {
    width: 90%;
    padding: 14px;
    font-size: 14px;
  }
  
  .login-link {
    font-size: 13px;
  }
}
</style> 