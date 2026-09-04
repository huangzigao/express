# 数据关系草图

## User

- `id`
- `email`
- `passwordHash`
- `createdAt`
- `updatedAt`

## Task

- `id`
- `userId`
- `categoryId`
- `title`
- `description`
- `status`
- `priority`
- `dueAt`
- `createdAt`
- `updatedAt`

## Category

- `id`
- `userId`
- `name`
- `createdAt`
- `updatedAt`

## 关系

```text
User 1 ---- N Task
User 1 ---- N Category
Category 1 ---- N Task
```

## 约束

- `User.email` 唯一。
- `Category` 在同一个用户下名称唯一。
- `Task.userId` 必须指向存在的 `User`。
- `Task.categoryId` 可以为空，非空时必须指向当前用户拥有的 `Category`。
- 用户删除时，需要明确处理其任务和分类。
- 分类删除时，需要明确处理已关联任务。
