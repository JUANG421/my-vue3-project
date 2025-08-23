<template>
  <view class="conflict-resolution-page">
    <view class="page-header">
      <view class="header-title">心禾伴沟通调节助手</view>
      <view class="header-subtitle">专业沟通冲突解决方案</view>
    </view>

    <view class="content-container">
      <!-- 冲突描述输入区域 -->
      <view class="input-section card">
        <view class="section-title">
          <text class="title-icon">📝</text>
          <text>请描述冲突或上传图片</text>
        </view>
        <view class="input-container">
          <textarea 
            class="input-box" 
            v-model="conflictDescription"
            placeholder="请详细描述您遇到的沟通冲突情况，或者点击上传相关文件..."
            :maxlength="500"
            show-confirm-bar="false"
            @focus="handleInputFocus"
          />
          
          <view class="upload-section">
            <button class="upload-btn" @click="chooseImage">
              📷 上传图片
            </button>
            
            <view class="upload-preview" v-if="uploadedImage" @click="previewImage">
              <image class="preview-image" :src="uploadedImage" mode="aspectFill" />
              <view class="file-info">
                <text class="file-name">{{ imageFileName }}</text>
                <text class="file-size">{{ imageFileSize }}</text>
              </view>
              <button class="remove-upload" @click="removeImage">×</button>
            </view>
          </view>
        </view>
      </view>

      <!-- 关系选择区域 -->
      <view class="relationship-section card">
        <view class="section-title">
          <text class="title-icon">👥</text>
          <text>请选择需要解决的冲突关系</text>
        </view>
        <view class="button-grid">
          <button 
            v-for="item in relationshipOptions" 
            :key="item.value"
            class="btn"
            :class="{ selected: selectedRelationship === item.value }"
            @click="selectRelationship(item.value)"
          >
            {{ item.label }}
          </button>
        </view>
      </view>

      <!-- 情绪强度选择 -->
      <view class="emotion-section card">
        <view class="section-title">
          <text class="title-icon">😊</text>
          <text>请选择当前的情绪强度</text>
        </view>
        <view class="emotion-buttons">
          <button 
            v-for="item in emotionOptions" 
            :key="item.value"
            class="emotion-btn"
            :class="[`level${item.value}`, { selected: selectedEmotion === item.value }]"
            @click="selectEmotion(item.value)"
          >
            {{ item.label }}
          </button>
        </view>
      </view>

      <!-- 生成结果按钮 -->
      <button class="generate-btn" @click="generateResult" :disabled="!canSubmit">
        {{ isGenerating ? '生成中...' : '生成结果' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const conflictDescription = ref('')
const selectedRelationship = ref('')
const selectedEmotion = ref('')
const uploadedImage = ref('')
const imageFileName = ref('')
const imageFileSize = ref('')
const isGenerating = ref(false)

const relationshipOptions = [
  { label: '家人', value: 'family' },
  { label: '校园', value: 'campus' },
  { label: '同事', value: 'colleague' },
  { label: '邻居', value: 'neighbor' },
  { label: '朋友', value: 'friend' },
  { label: '自动识别', value: 'auto' }
]

const emotionOptions = [
  { label: '1级', value: 1 },
  { label: '2级', value: 2 },
  { label: '3级', value: 3 },
  { label: '4级', value: 4 }
]

const canSubmit = computed(() => {
  return conflictDescription.value.trim() && selectedRelationship.value && selectedEmotion.value
})

const selectRelationship = (value) => {
  selectedRelationship.value = value
  
  // 添加点击反馈 - 下按效果
  const btn = event.target
  btn.style.transform = 'scale(0.98) translateY(1px)'
  btn.style.transition = 'transform 0.2s ease'
  setTimeout(() => {
    btn.style.transform = ''
  }, 200)
}

const selectEmotion = (value) => {
  selectedEmotion.value = value
  
  // 添加点击反馈
  const btn = event.target
  btn.style.transform = 'scale(0.95)'
  setTimeout(() => {
    btn.style.transform = ''
  }, 150)
}

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      const fileSize = res.tempFiles[0].size
      
      if (fileSize > 5 * 1024 * 1024) {
        uni.showToast({
          title: '图片文件大小不能超过5MB',
          icon: 'none'
        })
        return
      }
      
      uploadedImage.value = tempFilePath
      imageFileName.value = `图片_${Date.now()}`
      imageFileSize.value = formatFileSize(fileSize)
      
      showUploadSuccess()
    }
  })
}

const previewImage = () => {
  if (uploadedImage.value) {
    uni.previewImage({
      urls: [uploadedImage.value],
      current: uploadedImage.value
    })
  }
}

const removeImage = () => {
  uploadedImage.value = ''
  imageFileName.value = ''
  imageFileSize.value = ''
}

// 输入框交互
const handleInputFocus = () => {
  const inputBox = document.querySelector('.input-box')
  if (inputBox) {
    inputBox.style.borderColor = '#6c757d'
    inputBox.style.background = '#f8f9fa'
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const showUploadSuccess = () => {
  uni.showToast({
    title: '图片上传成功',
    icon: 'success',
    duration: 2000
  })
}

const generateResult = async () => {
  if (!canSubmit.value) {
    uni.showToast({
      title: '请完善所有必填信息',
      icon: 'none'
    })
    return
  }

  isGenerating.value = true

  try {
    const submitData = {
      conflictDescription: conflictDescription.value.trim(),
      relationship: selectedRelationship.value,
      emotion: selectedEmotion.value,
      image: uploadedImage.value || null
    }

    console.log('提交数据:', submitData)

    await new Promise(resolve => setTimeout(resolve, 2000))

    uni.showModal({
      title: '分析完成',
      content: `冲突描述：${submitData.conflictDescription}\n关系类型：${relationshipOptions.find(item => item.value === submitData.relationship)?.label}\n情绪强度：${submitData.emotion}级\n\n正在为您生成专业的沟通调节建议...`,
      showCancel: false,
      confirmText: '确定'
    })

    resetForm()

  } catch (error) {
    console.error('生成结果失败:', error)
    uni.showToast({
      title: '生成失败，请重试',
      icon: 'none'
    })
  } finally {
    isGenerating.value = false
  }
}

const resetForm = () => {
  conflictDescription.value = ''
  selectedRelationship.value = ''
  selectedEmotion.value = ''
  uploadedImage.value = ''
  imageFileName.value = ''
  imageFileSize.value = ''
}

// 页面加载动画
onMounted(() => {
  document.body.style.opacity = '0'
  document.body.style.transition = 'opacity 0.8s ease'
  setTimeout(() => {
    document.body.style.opacity = '1'
  }, 100)
})
</script>

<style scoped>
.conflict-resolution-page {
  height: 100vh;
  background: white;
  padding: 0;
  overflow: hidden;
}

.page-header {
  background: linear-gradient(135deg, #87ceeb 0%, #ffffff 100%);
  color: #333;
  padding: 45px 20px 27px;
  text-align: center;
  position: relative;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.header-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.header-subtitle {
  font-size: 16px;
  opacity: 0.9;
  font-weight: 300;
}

.content-container {
  padding: 12px;
  background: white;
  height: calc(100vh - 120px);
  overflow: hidden;
}

.input-section,
.relationship-section,
.emotion-section {
  margin-bottom: 8px;
}

.relationship-section {
  margin-top: -13px;
}

.emotion-section {
  margin-top: -13px;
}

/* 卡片式布局 */
.card {
  background: white;
  border-radius: 12px;
  padding: 10px;
  border: none;
  position: relative;
  overflow: hidden;
}



.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.title-icon {
  font-size: 15px;
}

.input-container {
  position: relative;
  display: flex;
  justify-content: center;
}

.input-box {
  width: 370px;
  height: 120px;
  background: #f8f9fa !important;
  border: 2px dashed #dee2e6 !important;
  border-radius: 8px;
  padding: 12px;
  padding-bottom: 35px;
  font-size: 15px;
  color: #6c757d;
  box-sizing: border-box;
  transition: all 0.3s ease;
  cursor: pointer;
}

.input-box:hover {
  border-color: #adb5bd;
  background: #e9ecef;
}

.input-box:focus {
  border-color: #6c757d;
  background: #f8f9fa;
  outline: none;
}

.button-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.btn {
  width: 95px;
  height: 40px;
  padding: 0;
  border: 2px solid #000000;
  background: white;
  color: #333;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn:hover {
  background: #e9ecef;
  border-color: #6c757d;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn.selected {
  background: #000000;
  color: white;
  border-color: #000000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transform: translateY(1px);
}

.emotion-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px;
  justify-content: start;
  padding-right: 20px;
  margin-left: -10px;
}

.emotion-btn {
  width: 80px;
  height: 40px;
  padding: 0;
  border: 2px solid #000000;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.emotion-btn.level1 {
  background: #e3f2fd;
  color: #1976d2;
}

.emotion-btn.level2 {
  background: #e8f5e8;
  color: #388e3c;
}

.emotion-btn.level3 {
  background: #fff3e0;
  color: #f57c00;
}

.emotion-btn.level4 {
  background: #ffebee;
  color: #d32f2f;
}

.emotion-btn.selected {
  border-color: #000000;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.upload-section {
  position: absolute;
  bottom: 4px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  width: auto;
}

.upload-btn {
  padding: 8px 16px;
  background: #adb5bd;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 3px;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-left: 5px;
  height: 36px;
}

.upload-btn:hover {
  background: #6c757d;
  transform: translateY(-1px);
}

.upload-btn:active {
  transform: translateY(0);
}

.upload-preview {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 5px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  flex: 1;
}

.preview-image {
  width: 24px;
  height: 24px;
  border-radius: 3px;
}

.file-info {
  font-size: 9px;
  color: #666;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-name,
.file-size {
  line-height: 1.2;
}

.remove-upload {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.generate-btn {
  width: 333px;
  height: 55px;
  padding: 0;
  background: #2c2c2c !important;
  color: white !important;
  border: 2px solid #2c2c2c !important;
  border-radius: 16px;
  font-size: 17px;
  font-weight: 600;
  margin-top: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  letter-spacing: 2px;
}

.generate-btn:hover {
  background: #333333;
  transform: translateY(-1px);
}

.generate-btn:active {
  transform: translateY(0);
}

.generate-btn:disabled {
  background: #ccc;
  color: #999;
}

@media (max-width: 375px) {
  .button-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .emotion-buttons {
    grid-template-columns: 1fr 1fr;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.6s ease forwards;
}

.input-section { animation-delay: 0.1s; }
.relationship-section { animation-delay: 0.2s; }
.emotion-section { animation-delay: 0.3s; }
</style>
