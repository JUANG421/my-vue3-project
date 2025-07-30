<template>
  <view class="login-container">
    <!-- 背景图片 -->
    <image class="bg-image" src="/static/images/ui.jpg" mode="aspectFill"></image>
    
    <!-- 登录表单 -->
    <view class="login-form">
      <view class="form-group">
        <input 
          type="text" 
          class="form-input" 
          v-model="formData.username" 
          placeholder="请输入账号" 
          :focus="focusUsername"
          @focus="onFocus('username')"
          @blur="onBlur('username')"
        />
      </view>
      
      <view class="form-group">
        <input 
          :type="passwordVisible ? 'text' : 'password'" 
          class="form-input" 
          v-model="formData.password" 
          placeholder="请输入密码" 
          :focus="focusPassword"
          @focus="onFocus('password')"
          @blur="onBlur('password')"
        />
        <text 
          class="password-toggle" 
          @tap="togglePasswordVisibility"
        >
          {{ passwordVisible ? '🙈' : '👁️' }}
        </text>
      </view>
      
      <button 
        class="login-btn" 
        :disabled="loading" 
        @tap="handleLogin"
      >
        <text v-if="!loading" class="login-text">登录</text>
        <view v-else class="loading"></view>
      </button>
    </view>
    
    <!-- 底部链接 -->
    <view class="links-container">
      <text class="forgot-password" @tap="handleForgotPassword">忘记密码？</text>
      <view class="divider"></view>
      <text class="register-link" @tap="handleRegister">注册账号</text>
    </view>
    
    <!-- 成功提示 -->
    <view v-if="showSuccess" class="success-message">
      登录成功！欢迎使用心禾伴
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 响应式数据
const formData = reactive({
  username: '',
  password: ''
})

const passwordVisible = ref(false)
const loading = ref(false)
const showSuccess = ref(false)
const focusUsername = ref(false)
const focusPassword = ref(false)

// 切换密码可见性
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

// 输入框聚焦
const onFocus = (field) => {
  if (field === 'username') {
    focusUsername.value = true
  } else if (field === 'password') {
    focusPassword.value = true
  }
}

// 输入框失焦
const onBlur = (field) => {
  if (field === 'username') {
    focusUsername.value = false
  } else if (field === 'password') {
    focusPassword.value = false
  }
}

// 处理登录
const handleLogin = async () => {
  if (!formData.username || !formData.password) {
    uni.showToast({
      title: '请输入账号和密码',
      icon: 'none'
    })
    return
  }
  
  loading.value = true
  
  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 登录成功
    showSuccess.value = true
    
    // 3秒后跳转或重置
    setTimeout(() => {
      showSuccess.value = false
      loading.value = false
      formData.username = ''
      formData.password = ''
      
      // 跳转到首页
      uni.switchTab({
        url: '/pages/index/index'
      })
    }, 3000)
    
  } catch (error) {
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none'
    })
    loading.value = false
  }
}

// 忘记密码
const handleForgotPassword = () => {
  uni.showModal({
    title: '提示',
    content: '请联系管理员重置密码',
    showCancel: false
  })
}

// 注册账号
const handleRegister = () => {
  uni.navigateTo({
    url: '/pages/register/register'
  })
}
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.login-form {
  position: absolute;
  left: 50%;
  top: 75%;
  transform: translate(-50%, -50%);
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 5;
}

.form-group {
  position: relative;
}

.form-input {
  width: 90%;
  margin: 0 auto;
  padding: 14px 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.2);
  color: #2c3e50;
  transition: all 0.3s ease;
  outline: none;
  backdrop-filter: blur(10px);
}

.form-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  background: rgba(255, 255, 255, 0.3);
}

.form-input::placeholder {
  color: rgba(44, 62, 80, 0.7);
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(44, 62, 80, 0.6);
  font-size: 18px;
  padding: 4px;
}

.login-btn {
  width: 90%;
  margin: 0 auto;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  border: none;
  padding: 12.8px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn[disabled] {
  opacity: 0.7;
}

.login-text {
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

.links-container {
  position: absolute;
  left: 50%;
  top: calc(75% + 128px);
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 15px;
}

.forgot-password {
  color: rgba(173, 216, 230, 0.9);
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-password:active {
  color: #ADD8E6;
}

.divider {
  width: 1px;
  height: 14px;
  background: rgba(173, 216, 230, 0.6);
}

.register-link {
  color: rgba(173, 216, 230, 0.9);
  font-size: 14px;
  transition: color 0.3s ease;
}

.register-link:active {
  color: #ADD8E6;
}

.success-message {
  position: absolute;
  left: 50%;
  top: calc(75% + 170px);
  transform: translateX(-50%);
  z-index: 5;
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  animation: slideIn 0.3s ease;
  backdrop-filter: blur(10px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 900px) {
  .login-form {
    width: 90%;
    max-width: 400px;
  }
  
  .links-container {
    width: 90%;
    max-width: 400px;
    justify-content: center;
  }
  
  .success-message {
    width: 90%;
    max-width: 400px;
  }
}

/* 移动端优化 */
@media (max-width: 480px) {
  .login-form {
    width: 95%;
    padding: 0 10px;
  }
  
  .form-input {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .login-btn {
    padding: 14px;
    font-size: 14px;
  }
  
  .links-container {
    width: 95%;
    gap: 10px;
  }
  
  .forgot-password,
  .register-link {
    font-size: 13px;
  }
}
</style> 