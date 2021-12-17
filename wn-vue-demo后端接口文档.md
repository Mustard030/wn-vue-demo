# 后端接口文档

> Host：http://127.0.0.1:8090/

## 原材料信息关系模块

### 列出按照过滤条件的原材料信息

请求地址：material/mater_mg/

请求方法：GET

参数：URL携带参数

| 参数     | 参数类型 | 说明                             | 是否必填             |
| -------- | -------- | -------------------------------- | -------------------- |
| action   | str      | 操作名称                         | list_material_filter |
| pagesize | int      | 页面大小                         | 是                   |
| pagenum  | int      | 页数                             | 是                   |
| keywords | str      | 搜索关键字，关键字之间用空格分开 | 否                   |

响应内容

> HTTP/1.1 200 OK
>
> Content-Type: application/json

```json
{'ret': 0,
 'retlist': [{'code': 'JD-6(干)',
              'exe_standard': '',
              'id': 1,
              'name': '苯酚',
              'remarks': '',
              'standards': 'JD-6(水)',
              'unit__name': '吨'}]
 'total':1       #返回的材料数
}

{'ret': 1, 'retlist': [], 'total': 0}   #返回空

{'ret': 2, 'msg': f'未知错误\n{traceback.format_exc()}'} #返回未知错误
```

