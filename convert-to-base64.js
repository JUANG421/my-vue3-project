const fs = require('fs');
const path = require('path');

try {
    console.log('正在读取图片文件...');
    const imagePath = path.join(__dirname, 'ui.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const mimeType = 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    console.log('图片转换完成，Base64长度:', dataUrl.length);

    // 读取原始HTML文件
    const originalHtml = fs.readFileSync('login-page.html', 'utf8');
    
    // 替换背景图片URL为Base64
    const base64Html = originalHtml.replace(
        "background: url('ui.jpg') no-repeat center center;",
        `background: url('${dataUrl}') no-repeat center center;`
    );

    // 保存Base64版本的HTML
    fs.writeFileSync('login-page-base64.html', base64Html);
    console.log('✅ Base64版本已生成: login-page-base64.html');
    console.log('📁 文件大小:', (fs.statSync('login-page-base64.html').size / 1024 / 1024).toFixed(2), 'MB');
    console.log('🎯 现在可以直接双击打开，图片100%显示！');

} catch (error) {
    console.error('❌ 错误:', error.message);
    console.log('请确保 ui.jpg 文件存在且可读');
} 