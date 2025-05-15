document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const captureFullBtn = document.getElementById('capture-full');
    const captureElementBtn = document.getElementById('capture-element');
    const useBgCheckbox = document.getElementById('use-bg');
    const scaleInput = document.getElementById('scale');
    const formatSelect = document.getElementById('format');
    const captureArea = document.getElementById('capture-area');
    const screenshotResult = document.getElementById('screenshot-result');
    
    // 截取整个页面
    captureFullBtn.addEventListener('click', function() {
        const options = getOptions();
        
        // 显示加载提示
        showLoading();
        
        captureElement(document.body, '整个页面', options);
    });
    
    // 截取特定元素
    captureElementBtn.addEventListener('click', function() {
        const options = getOptions();
        
        // 显示加载提示
        showLoading();
        
        captureElement(captureArea, '内容区域', options);
    });
    
    // 获取配置选项
    function getOptions() {
        return {
            scale: parseFloat(scaleInput.value) || 2,
            bgcolor: useBgCheckbox.checked ? '#ffffff' : null,
            format: formatSelect.value,
            quality: 0.95
        };
    }
    
    // 显示加载提示
    function showLoading() {
        screenshotResult.innerHTML = '<div class="loading">正在生成截图，请稍候...</div>';
    }
    
    // 显示错误信息
    function showError(message) {
        screenshotResult.innerHTML = `<div class="error">${message}</div>`;
    }
    
    // 截取元素
    function captureElement(element, title, options) {
        // 根据选择的格式使用不同的方法
        let capturePromise;
        
        switch (options.format) {
            case 'jpeg':
                capturePromise = domtoimage.toJpeg(element, {
                    quality: options.quality,
                    bgcolor: options.bgcolor,
                    scale: options.scale
                });
                break;
            case 'svg':
                capturePromise = domtoimage.toSvg(element, {
                    bgcolor: options.bgcolor,
                    scale: options.scale
                });
                break;
            case 'png':
            default:
                capturePromise = domtoimage.toPng(element, {
                    bgcolor: options.bgcolor,
                    scale: options.scale
                });
                break;
        }

        capturePromise.then(function(dataUrl) {
            displayResult(dataUrl, title, options.format);
        }).catch(function(error) {
            console.error('截图失败:', error);
            showError('截图失败，请查看控制台获取详细错误信息');
        });
    }
    
    // 显示截图结果
    function displayResult(dataUrl, title, format) {
        // 清空之前的结果
        screenshotResult.innerHTML = '';
        
        // 创建包装容器
        const resultWrapper = document.createElement('div');
        resultWrapper.classList.add('screenshot-item');
        
        // 添加标题
        const resultTitle = document.createElement('h4');
        resultTitle.textContent = `${title}截图 (${format.toUpperCase()})`;
        resultWrapper.appendChild(resultTitle);
        
        // 添加时间戳
        const timestamp = document.createElement('p');
        timestamp.textContent = `时间: ${new Date().toLocaleString()}`;
        timestamp.classList.add('timestamp');
        resultWrapper.appendChild(timestamp);
        
        // 添加图片（SVG格式也可以通过img标签展示）
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = `${title}截图`;
        resultWrapper.appendChild(img);
        
        // 创建下载链接
        const downloadLink = document.createElement('a');
        downloadLink.textContent = '下载截图';
        downloadLink.href = dataUrl;
        downloadLink.download = `screenshot-${Date.now()}.${format}`;
        resultWrapper.appendChild(downloadLink);
        
        // 添加到结果容器
        screenshotResult.appendChild(resultWrapper);
    }
});
