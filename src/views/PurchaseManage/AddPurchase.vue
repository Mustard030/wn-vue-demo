<template>
  <div class="main-container">
    <div class="card-body">
      <el-card>
        <div slot="header" class="clearfix">
          <span>新增采购合同</span>
<!--          <el-button style="float: left; padding: 3px 0" type="text">保存</el-button>-->
        </div>
        <div class="scroll">
          <el-scrollbar>
            <el-form label-position="right" label-width="90px">
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>合同基础信息</span></div>
              <el-form-item label="合同编号:">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="供应商:">
                <el-select filterable clearable>
                  <el-option
                      v-for="item in supplierList"
                      :key="item.value"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="合同名称:">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="签订日期:">
                <el-date-picker
                    type="date"
                    placeholder="签订日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="签订地点:">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="备注:">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入备注内容">
                </el-input>
              </el-form-item>
              <el-form-item label="附件:">
                <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    multiple
                    :limit="3"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
<!--                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
              <el-divider/>
              <div style="margin-bottom: 20px"><span style="color:red">*</span><span>物资明细</span>
                <el-button style="margin-left:30px">添加物资</el-button>
                <span style="float:right;margin-right: 50px">总金额: {{ totalMoney }}</span>
              </div>
              <div>
                <el-table :data="tableData" border
                          :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                          :row-style="{height: '60px'}"
                          :cell-style="{padding: '0'}">
                  <el-table-column label="序号" prop="date" width="80px" show-overflow-tooltip></el-table-column>
                  <el-table-column label="物资名称" prop="date" show-overflow-tooltip></el-table-column>
                  <el-table-column label="代号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                  <el-table-column label="规格型号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                  <el-table-column label="执行标准" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                  <el-table-column label="单位" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                  <el-table-column label="数量" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                  <el-table-column label="单价" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                  <el-table-column label="金额" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                  <el-table-column label="备注" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                  <el-table-column label="操作" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </el-form>
          </el-scrollbar>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddPurchase",
  data(){
    return {
      totalMoney: 100,
      tableData:[
        {},{},{},{}
      ],
    }}
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
}

.card-body {
  flex: 0;
  overflow: auto;
  min-height: 0;
}
.scroll{
  height: 78vh;
}
.el-scrollbar {
  height: 100%;
}
.el-scrollbar__wrap{
  overflow-x: hidden;
}
.el-select {
  width: 100%;
}
</style>