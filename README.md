## 新版 (无 logo)

npm install // 安装项目依赖
npm start // 运行项目

###### 启动项目

`npm start` 或者 `npm run dev`

###### 启动项目后自动打开浏览器(传入 --o 参数)

`npm start --o` 或者`npm start --open`

###### 打包项目

`npm run build`

###### 提交代码格式

- feat: 新增 feature
- fix: 修复 bug
- docs: 仅仅修改了文档，比如 README, CHANGELOG, CONTRIBUTE 等等
- style: 仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑
- refactor: 代码重构，没有加新功能或者修复 bug
- perf: 优化相关，比如提升性能、体验
- test: 测试用例，包括单元测试、集成测试等
- chore: 改变构建流程、或者增加依赖库、工具等
- revert: 回滚到上一个版本

### 目录结构

```
├── README.md                    // 项目描述
├── build                        // 部署环境包
├── node_modules                 // 环境依赖包
├── public                       // 开发环境入口及静态资源
│   ├── dataBase                 // 异步加载数据
│   │   ├── local_language       // 语言本地化数据
│   │   ├── config_demo.json     // 视频编辑项目配置数据
│   │   └── media_format.json    // 上传文件格式限制
│   ├── images                   // 静态图片及文字转语音默认人声
│   ├── manifest.json            // 网页图标json文件
│   └── index.html               // 主页
├── src                          // 生产目录
│   ├── channel                  // 发送请求
│   ├── components               // 各种组件
│   ├── css                      // 样式
│   ├── database                 // 基础数据库
│   ├── home                     // 登陆页面
│   ├── images                   // 图片资源
│   ├── module                   // online页面的公共组件
│   ├── page                     // 各个模块页面
│   │   ├── online               // 快编编辑器主页面
│   │       ├── Colophon         // 历史版本
│   │       ├── Crop             // 素材裁剪
│   │       ├── Issue            // 项目发布
│   │       ├── OnlineTop        // 头部操作栏
│   │       ├── OperationBar     // 工具栏
│   │       ├── Record           // 录音
│   │       ├── SourceList       // 素材列表 左侧导航
│   │       ├── trackDetail      // 轨道上的操作（添加素材，加载素材）
│   │       └── UnitDetail       // 素材的高级操作
│   ├── images                   // 静态图片及文字转语音默认人声
│   ├── manifest.json            // 网页图标json文件
│   └── index.html               // 主页
│   ├── routes                   // 配置二级路由
│   ├── utils                    // 公共方法
│   ├── app.js                   // 页面架子
│   ├── index.js                 // 编译入口
│   └── route.js                 // 路由配置总入口
├── .babelrc                     // babel配置文件
├── .editorconfig                // 编辑器配置
├── .env.*                       // 配置全局变量 根据打包命令配置环境
├── .eslintignore                // eslint忽略文件配置
├── .eslintrc                    // eslint配置文件
├── .gitignore                   // git忽略文件配置
├── config-overrides.js          // react-app-rewired配置文件
├── jsconfig.json                // vscode路径配置
├── m3u8.html                    // 直播dom
├── package.json                 // 项目配置文件
└── webpack.config.js            // webpack配置文件
```
