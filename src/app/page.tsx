"use client";
import { Button, List, AutoComplete, message } from "antd";
import { useState } from "react";
import { CloseSquareFilled } from "@ant-design/icons";
import { useSpring, animated, SpringValue } from "@react-spring/web";

export default function Home() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [list, setList] = useState<string[]>([]);
  const [searchConfirmed, setSearchConfirmed] = useState(false);

  const searchAnimation = useSpring({
    top: searchConfirmed ? "10px" : "50%",
    transform: searchConfirmed ? "translate(-50%, 0)" : "translate(-50%, -50%)",
  });


  const onChange = (data: string) => {
    setValue(data);
  };

  const handleSearch = async (search: string) => {
    const res = await fetch(`/api/es/suggest?q=${search}`, {
      method: "GET",
    }).then((response) => response.json());

    // 处理返回的数据并更新选项
    const newOptions = res.map((item: any) => ({
      value: item,
    }));
    setOptions(newOptions);
  };

  const handleConfirm = async () => {
    const res = await fetch(`/api/es/search?q=${value}`, {
      method: "GET",
    }).then((response) => response.json());
    setList(res);
    setSearchConfirmed(true);
  };

  return (
    <div className="p-10">
      <animated.div
        style={{
          position: "absolute",
          left: "50%",
          ...searchAnimation,
        }}
      >
        {/* 搜索框 */}
        <div className="flex items-center">
          <AutoComplete
            className="w-[500px] h-[45px] my-[10px]"
            value={value}
            options={options}
            // onSelect={onSelect}
            onSearch={(text) => handleSearch(text)}
            onChange={onChange}
            placeholder="请输入搜索关键字"
            allowClear={{ clearIcon: <CloseSquareFilled /> }}
          />
          <Button
            type="primary"
            className="mx-1 h-[40px]"
            onClick={handleConfirm}
          >
            搜索
          </Button>
        </div>
      </animated.div>

      {/* 数据展示列表 */}
      {list.length > 0 && (
        <List
          className="mt-11"
          pagination={{
            pageSize: 10,
          }}
          header={<div>搜索结果展示</div>}
          bordered
          dataSource={list}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={<div dangerouslySetInnerHTML={{ __html: item.content }} />} />
              {/* <div dangerouslySetInnerHTML={{ __html: item.content }} /> */}
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
