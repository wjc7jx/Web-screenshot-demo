# Web端截屏实现 (getDisplayMedia)

这是一个使用现代 Web API `getDisplayMedia` 实现屏幕捕获和截图功能的演示项目。

## 功能特点

- 捕获整个屏幕、应用程序窗口或浏览器标签
- 实时预览捕获的内容
- 随时截取当前画面
- 支持多种图像格式：PNG、JPEG
- 可调整JPEG图像质量
- 可选择是否包含系统音频
- 支持下载截图

## 使用说明

1. 打开 `index.html` 文件
2. 点击"开始屏幕捕获"按钮
3. 在系统弹出的对话框中选择要共享的内容（屏幕、窗口或标签页）
4. 选择内容后会开始实时预览
5. 点击"截取当前画面"按钮可保存当前屏幕状态
6. 截图结果会显示在页面下方，可点击"下载截图"保存
7. 点击"停止捕获"或系统托盘中的"停止共享"可结束捕获

## 技术说明

本示例使用了以下技术：

- HTML5
- CSS3
- JavaScript
- `navigator.mediaDevices.getDisplayMedia` API
- Canvas API 用于处理截图

## getDisplayMedia API 参数说明

- `video`: 控制视频捕获的选项
  - `cursor`: 鼠标光标是否显示 ('always'/'never'/'motion')
  - `displaySurface`: 首选的显示表面类型 ('monitor'/'window'/'browser')
- `audio`: 控制音频捕获的选项，设为 `false` 则不捕获音频
- `selfBrowserSurface`: 是否允许捕获自身浏览器窗口
- `systemAudio`: 是否包含系统音频

## 浏览器支持

此demo需要在支持 `getDisplayMedia` API 的现代浏览器中运行：

- Chrome 72+
- Edge 79+
- Firefox 66+
- Safari 13+

Internet Explorer 不支持此功能。

## 与其他截图方式的比较

### 相对于HTML2Canvas和dom-to-image-more的优势

- 可以捕获整个操作系统的屏幕，而不仅限于网页内容
- 可以捕获其他应用程序窗口
- 支持捕获动态内容和视频
- 可以同时捕获系统音频

### 局限性

- 需要用户明确授予屏幕共享权限
- 只能在安全上下文（HTTPS或localhost）中使用
- 不能自动化，必须由用户主动触发
- 无法直接捕获网页的DOM结构

## 安全注意事项

- 此API需要用户明确授权才能使用
- 只能在HTTPS或localhost环境下运行
- 用户可以随时通过浏览器界面取消屏幕共享
