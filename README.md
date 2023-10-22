使用Next.js 13集成Ant Design，并使用Elasticsearch实现一个案例.

## Getting Started
首先安装docker和Elaticsearch等相关环境数据
- 本地机器启动docker环境
- 进入docker目录，执行script.sh 脚本，进行elasticsearch和kibana容器的安装，并且填充一些测试数据

然后启动Next.js项目
```bash
npm install
npm run dev
```

进行测试
- 在浏览器打开[http://localhost:3000](http://localhost:3000) 就能看到页面信息
- 搜索提示

![搜索提示](/doc/WX20231022-155852.png)

- 搜索结果列表，并且关键字高亮

![搜索提示](/doc/WX20231022-160000.png)

## Learn More
更多从基础概念可看.

