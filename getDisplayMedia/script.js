document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const startCaptureBtn = document.getElementById('start-capture');
    const takeScreenshotBtn = document.getElementById('take-screenshot');
    const stopCaptureBtn = document.getElementById('stop-capture');
    const useAudioCheckbox = document.getElementById('use-audio');
    const imageFormatSelect = document.getElementById('image-format');
    const jpegQualityInput = document.getElementById('jpeg-quality');
    const previewVideo = document.getElementById('preview-video');
    const introMessage = document.getElementById('intro-message');
    const screenshotResult = document.getElementById('screenshot-result');
    
    // 保存媒体流的引用
    let mediaStream = null;
    
    // 开始屏幕捕获
    startCaptureBtn.addEventListener('click', async function() {
        try {
            // 设置捕获选项
            const displayMediaOptions = {
                video: {
                    cursor: 'always',
                    displaySurface: 'monitor'
                },
                audio: useAudioCheckbox.checked ? {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } : false,
                selfBrowserSurface: 'include',
                systemAudio: useAudioCheckbox.checked ? 'include' : 'exclude',
            };
            
            // 请求屏幕共享
            mediaStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
            
            // 显示预览
            previewVideo.srcObject = mediaStream;
            previewVideo.style.display = 'block';
            introMessage.style.display = 'none';
            
            // 启用相关按钮
            takeScreenshotBtn.disabled = false;
            stopCaptureBtn.disabled = false;
            startCaptureBtn.disabled = true;
            
            // 监听流结束
            mediaStream.getTracks()[0].addEventListener('ended', handleStreamEnded);
            
            // 显示状态
            addStatusMessage('捕获中', true);
            
        } catch (error) {
            console.error('Error starting capture:', error);
            showError('无法启动屏幕捕获: ' + (error.message || '用户拒绝访问或浏览器不支持'));
        }
    });
    
    // 截取当前画面
    takeScreenshotBtn.addEventListener('click', function() {
        if (!mediaStream || mediaStream.getVideoTracks().length === 0) {
            showError('没有活动的视频流');
            return;
        }
        
        try {
            // 创建临时画布
            const canvas = document.createElement('canvas');
            canvas.width = previewVideo.videoWidth;
            canvas.height = previewVideo.videoHeight;
            
            // 绘制视频帧
            const ctx = canvas.getContext('2d');
            ctx.drawImage(previewVideo, 0, 0, canvas.width, canvas.height);
            
            // 获取图片格式和质量
            const format = imageFormatSelect.value;
            const quality = format === 'jpeg' ? jpegQualityInput.value / 100 : undefined;
            
            // 转换为图像
            const dataUrl = canvas.toDataURL(`image/${format}`, quality);
            
            // 显示结果
            displayScreenshotResult(dataUrl, format);
            
        } catch (error) {
            console.error('Error taking screenshot:', error);
            showError('截图失败: ' + error.message);
        }
    });
    
    // 停止捕获
    stopCaptureBtn.addEventListener('click', function() {
        stopCapture();
    });
    
    // 处理流结束
    function handleStreamEnded() {
        stopCapture();
    }
    
    // 停止捕获
    function stopCapture() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
        
        previewVideo.srcObject = null;
        previewVideo.style.display = 'none';
        introMessage.style.display = 'flex';
        
        takeScreenshotBtn.disabled = true;
        stopCaptureBtn.disabled = true;
        startCaptureBtn.disabled = false;
        
        removeStatusMessage();
    }
    
    // 显示截图结果
    function displayScreenshotResult(dataUrl, format) {
        // 创建结果项容器
        const resultItem = document.createElement('div');
        resultItem.classList.add('screenshot-item');
        
        // 添加标题
        const title = document.createElement('h4');
        title.textContent = `屏幕截图 (${format.toUpperCase()})`;
        resultItem.appendChild(title);
        
        // 添加时间戳
        const timestamp = document.createElement('div');
        timestamp.textContent = `时间: ${new Date().toLocaleString()}`;
        timestamp.classList.add('timestamp');
        resultItem.appendChild(timestamp);
        
        // 添加尺寸信息
        const img = new Image();
        img.onload = function() {
            const dimensions = document.createElement('div');
            dimensions.textContent = `尺寸: ${img.naturalWidth} × ${img.naturalHeight} 像素`;
            dimensions.classList.add('timestamp');
            timestamp.after(dimensions);
        };
        
        // 添加图片
        img.src = dataUrl;
        img.alt = '屏幕截图';
        img.classList.add('screenshot-image');
        resultItem.appendChild(img);
        
        // 添加下载按钮
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('screenshot-actions');
        
        const downloadLink = document.createElement('a');
        downloadLink.textContent = '下载截图';
        downloadLink.className = 'download-btn';
        downloadLink.href = dataUrl;
        downloadLink.download = `screenshot-${Date.now()}.${format}`;
        actionsDiv.appendChild(downloadLink);
        
        resultItem.appendChild(actionsDiv);
        
        // 添加至结果容器（在顶部）
        screenshotResult.insertBefore(resultItem, screenshotResult.firstChild);
    }
    
    // 显示错误信息
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error');
        errorDiv.textContent = message;
        
        screenshotResult.insertBefore(errorDiv, screenshotResult.firstChild);
        
        // 自动移除错误信息
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // 添加状态信息
    function addStatusMessage(message, active) {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'capture-status';
        statusDiv.classList.add('capture-status');
        statusDiv.classList.add(active ? 'active' : 'inactive');
        statusDiv.textContent = message;
        
        previewVideo.parentElement.appendChild(statusDiv);
    }
    
    // 移除状态信息
    function removeStatusMessage() {
        const statusDiv = document.getElementById('capture-status');
        if (statusDiv) statusDiv.remove();
    }
    
    // 检查浏览器支持
    function checkBrowserSupport() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            startCaptureBtn.disabled = true;
            showError('您的浏览器不支持屏幕捕获API (getDisplayMedia)。请使用较新版本的Chrome、Edge或Firefox浏览器。');
        }
    }
    
    // 初始化
    checkBrowserSupport();
    
    // 监听JPEG质量选项显示/隐藏
    imageFormatSelect.addEventListener('change', function() {
        document.getElementById('jpeg-quality').parentNode.style.display = 
            this.value === 'jpeg' ? 'flex' : 'none';
    });
    
    // 初始触发一次格式变更事件
    imageFormatSelect.dispatchEvent(new Event('change'));
});
