document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const captureFullBtn = document.getElementById('capture-full');
    const captureElementBtn = document.getElementById('capture-element');
    const useCorsCheckbox = document.getElementById('use-cors');
    const scaleInput = document.getElementById('scale');
    const captureArea = document.getElementById('capture-area');
    const screenshotResult = document.getElementById('screenshot-result');
    
    // 截取整个页面
    captureFullBtn.addEventListener('click', function() {
        const options = getOptions();
        
        // 显示加载提示
        showLoading();
        
        html2canvas(document.body, options).then(canvas => {
            displayResult(canvas, '整个页面');
        }).catch(error => {
            console.error('截图失败:', error);
            showError('截图失败，请查看控制台获取详细错误信息');
        });
    });
    
    // 截取特定元素
    captureElementBtn.addEventListener('click', function() {
        const options = getOptions();
        
        // 显示加载提示
        showLoading();
        
        html2canvas(captureArea, options).then(canvas => {
            displayResult(canvas, '内容区域');
        }).catch(error => {
            console.error('截图失败:', error);
            showError('截图失败，请查看控制台获取详细错误信息');
        });
    });
    
    // 获取配置选项
    function getOptions() {
        return {
            scale: parseFloat(scaleInput.value) || 2,
            useCORS: useCorsCheckbox.checked,
            allowTaint: !useCorsCheckbox.checked,
            backgroundColor: '#ffffff',
            logging: true
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
    
    // 显示截图结果
    function displayResult(canvas, title) {
        // 清空之前的结果
        screenshotResult.innerHTML = '';
        
        // 创建包装容器
        const resultWrapper = document.createElement('div');
        resultWrapper.classList.add('screenshot-item');
        
        // 添加标题
        const resultTitle = document.createElement('h4');
        resultTitle.textContent = `${title}截图`;
        resultWrapper.appendChild(resultTitle);
        
        // 添加时间戳
        const timestamp = document.createElement('p');
        timestamp.textContent = `时间: ${new Date().toLocaleString()}`;
        timestamp.classList.add('timestamp');
        resultWrapper.appendChild(timestamp);
        
        // 添加Canvas
        resultWrapper.appendChild(canvas);
        
        // 创建下载链接
        const downloadLink = document.createElement('a');
        downloadLink.textContent = '下载截图';
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = `screenshot-${Date.now()}.png`;
        resultWrapper.appendChild(downloadLink);
        
        // 添加到结果容器
        screenshotResult.appendChild(resultWrapper);
    }
});
