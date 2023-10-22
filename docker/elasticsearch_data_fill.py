import json
from faker import Faker
import requests

# Elasticsearch服务器的URL
ELASTICSEARCH_URL = "http://localhost:9200"

# 定义索引映射
INDEX_MAPPING = {
  "mappings": {
    "properties": {
      "id": {"type": "integer"},
      "title": {"type": "text", "analyzer": "ik_smart"},
      "title_suggest": {"type": "completion", "analyzer": "ik_smart"},
      "date": {"type": "date"},
      "content": {"type": "text", "analyzer": "ik_smart"},
      "created_at": {"type": "date"},
      "updated_at": {"type": "date"},
      "views": {"type": "integer"}
    }
  }
}

print("开始创建索引.....")
# 创建索引
response = requests.put(f"{ELASTICSEARCH_URL}/articles", json=INDEX_MAPPING)

print("开始填充数据.....")

fake = Faker("zh_CN")
bulk_data = ""
for i in range(1, 1001):
    title = fake.sentence(nb_words=15, variable_nb_words=True)
    title_suggest = title
    date = fake.date()
    content = fake.sentence()
    created_at = fake.date_time_this_year()
    updated_at = fake.date_time_between_dates(datetime_start=created_at)
    views = fake.random_int(0, 1000)

    data = {
        "index": {"_index": "articles", "_id": i},
        "id": i,
        "title": title,
        "title_suggest": title_suggest,
        "date": date,
        "content": content,
        "created_at": created_at.isoformat(),
        "updated_at": updated_at.isoformat(),
        "views": views
    }

    bulk_data += json.dumps(data) + "\n"

# 使用bulk API批量导入数据
response = requests.post(f"{ELASTICSEARCH_URL}/_bulk", headers={"Content-Type": "application/json"}, data=bulk_data)
response.raise_for_status()

print("数据填充完成。")
