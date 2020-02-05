<h1 align="center">
  A Vue JsonToExcel Component by jzy
</h1>

#### JsonToExcel 组件调用

`组件的引用`

```bash
# main.js
import JsonToExcel from '@/components/JsonToExcel';
Vue.use(JsonToExcel);
```

`组件参数API`

- initialValue{Array|数据数组，必要参数}
- fields{Object|导出的字段集合，必要参数，{ 列标题: 数据 key, ... }}
- fileType{String|导出文件的 MIME 类型 xlsx/csv，默认值 xlsx}
- fileName{String|导出的文件名}
- fetch: {
  - &emsp;api: {Function|请求的接口函数}
  - &emsp;params: {Object|接口的默认参数}
  - &emsp;datakey: {String|服务端响应数据的数组列表的 key，支持路径操作('step1.step2.items')，不指定表示 res.data 就是数组数据}
- }
- formatHandle{Function|格式化数据的附加方法，通常用于处理字段翻译}
- onFinish{Function|到处成功的事件}
- onError{Function|导出失败的事件}

`示例代码`

```bash
# template
<template>
  <JsonToExcel size="small" type="primary" :initialValue="json_data" :fields="json_fields" fileName="导出文件.xlsx">导出</JsonToExcel>
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
  },
};
```
