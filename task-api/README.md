# Task API

基于 Node.js、Express 和 MySQL 的任务管理 REST API。

## 项目目标

支持用户认证、个人任务管理、任务分类、查询筛选、参数校验和接口测试。

## 当前进度

Day Four：完成 Express 应用主结构、路由挂载、健康检查和基础启动链路整理。

当前阶段已完成基础应用入口、统一 `/api/v1` 路由前缀、健康检查、404 响应和接口测试骨架，暂不接入数据库、认证和任务业务。

## 文档

- `docs/requirements.md`：项目需求和功能范围。
- `docs/data-relations.md`：用户、任务和分类的数据关系。
- `docs/api-conventions.md`：接口版本、响应格式和状态码约定。
- `docs/technical-selection.md`：技术栈和依赖选择。

## 技术方案

- 运行环境：Node.js
- Web 框架：Express
- 数据库：MySQL
- 数据访问：Prisma
- 参数校验：Zod
- 身份认证：JWT
- 密码处理：bcrypt
- 测试：Jest + Supertest
- 日志：Pino
- 安全：Helmet + CORS
- 代码规范：ESLint + Prettier

## 下一步

进入 Day Five，开始数据库连接与数据访问层设计。
