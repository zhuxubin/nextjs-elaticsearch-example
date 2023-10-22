# 使用官方的Elasticsearch镜像作为基础镜像
FROM elasticsearch:7.17.7

# 安装IK分词器插件
ENV IK_RELEASE=https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.17.7/elasticsearch-analysis-ik-7.17.7.zip
RUN /usr/share/elasticsearch/bin/elasticsearch-plugin install --batch $IK_RELEASE