# API 约定

## 版本前缀

所有接口统一使用：

```text
/api/v1
```

## 成功响应

```json
{
  "success": true,
  "data": {},
  "meta": null
}
```

## 列表响应

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

## 错误响应

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数校验失败",
    "details": []
  }
}
```

## 初步状态码约定

- `200`：查询或修改成功。
- `201`：创建成功。
- `204`：删除成功且无响应体。
- `400`：请求格式或参数错误。
- `401`：未登录或身份凭证无效。
- `403`：没有访问资源的权限。
- `404`：资源不存在。
- `409`：资源冲突，例如邮箱重复。
- `500`：服务器内部错误。

## 认证约定

受保护接口使用请求头：

```text
Authorization: Bearer <token>
```
