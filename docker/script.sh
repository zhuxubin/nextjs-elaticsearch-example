#!/bin/bash

# 启动docker-compose
docker-compose up -d

# 等待所有容器启动完毕
while [[ $(docker-compose ps -q | wc -l) -lt $(docker-compose config --services | wc -l) ]]; do
  sleep 1
done

# 等待Elasticsearch容器启动
until $(curl --output /dev/null --silent --head --fail http://localhost:9200); do
    echo "等待Elasticsearch容器启动....." 
    sleep 1
done

# 等待一段时间，确保容器已经启动
sleep 10

# 安装依赖
pip3 install requests faker

# 执行Python脚本
python3 elasticsearch_data_fill.py
