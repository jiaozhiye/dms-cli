## API

### JsonToExcel

| 参数         | 说明                                                | 类型        | 默认值 |
| ------------ | --------------------------------------------------- | ----------- | ------ |
| initialValue | 导出的数据数组，必要参数                            | array       | -      |
| fields       | 导出的字段集合，必要参数，格式 { 列标题: 数据 key } | object      | -      |
| fileType     | 导出文件的 MIME 类型                                | xlsx \| csv | xlsx   |
| fileName     | 导出的文件名                                        | string      | -      |
| fetch        | 导出的接口配置，[配置项](#fetch)                    | object      | -      |
| formatHandle | 格式化数据的附加方法，通常用于处理字段翻译          | func        | -      |

### 事件

| 事件名称 | 说明           | 回调参数 |
| -------- | -------------- | -------- |
| success  | 导出成功后触发 | -        |
| error    | 导出失败时触发 | -        |

### fetch

| 参数    | 说明                                | 类型   | 默认值 |
| ------- | ----------------------------------- | ------ | ------ |
| api     | 请求的接口，必要参数                | func   | -      |
| params  | 请求的参数                          | object | -      |
| dataKey | 数据的 key，支持 `a.b.c` 的路径写法 | string | -      |

### 示例

```bash
# template
<template>
  <json-to-excel type="primary" :initialValue="json_data" :fields="json_fields" fileName="导出文件.xlsx">导出</json-to-excel>
</template>

# js
export default {
  data() {
    return {
      json_fields: {
        'Complete name': 'name',
        City: 'city',
        Telephone: 'phone.mobile',
        'Telephone 2': {
          field: 'phone.landline',
          callback: value => {
            return `Landline Phone - ${value}`;
          }
        }
      },
      json_data: [
        {
          name: 'Tony Peña',
          city: 'New York',
          country: 'United States',
          birthdate: '1978-03-15',
          phone: {
            mobile: '15417543010',
            landline: '(541) 754-3010'
          }
        },
        {
          name: 'Thessaloniki',
          city: 'Athens',
          country: 'Greece',
          birthdate: '1987-11-23',
          phone: {
            mobile: '18552755071',
            landline: '(2741) 2621-244'
          }
        }
      ]
    };
  }
};
```
