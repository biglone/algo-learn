# Docker 部署

## 首次部署

```bash
cd /home/Biglone/workspace/algo-learn
# 会同时启动前端站点和 C++ 运行服务
docker compose up -d --build
```

## 日常更新

```bash
cd /home/Biglone/workspace/algo-learn
git pull
docker compose up -d --build
```

## 查看状态

```bash
docker compose ps
docker compose logs -f
```

## 停止服务

```bash
docker compose down
```
