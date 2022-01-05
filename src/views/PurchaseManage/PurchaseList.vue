<template>
  <div style="height: 100%;">
    <el-card style="height: 100%">
      <div slot="header">
        <span>采购合同信息</span>
      </div>
      <div class="main-container">
        <!--搜索区-->
        <div class="search-box">
          <el-form label-position="right" label-width="90px">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="供应商：">
                  <el-select v-model="queryForm.supplier" filterable clearable placeholder="请选择" size="mini">
                    <el-option
                        v-for="item in supplierList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        size="mini">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同编号：">
                  <el-input v-model="queryForm.code" size="mini"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同名称：">
                  <el-input v-model="queryForm.name" size="mini"/>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="second-row">
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item label="签订日期从:">
                    <el-date-picker
                        v-model="queryForm.dateRange"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        size="mini">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-checkbox v-model="queryForm.executing" size="mini">只显示执行中的合同</el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="getPurchaseList" size="small">查询</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-circle-plus" @click="" size="small">新增
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
        <!--表单区域-->
        <div class="table-box">
          <el-table :data="tableData" border stripe
                    :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                    :row-style="{height: '80px'}"
                    :cell-style="{padding: '0'}"
          >
            <el-table-column label="序号" prop="index" width="50px" show-overflow-tooltip></el-table-column>
            <el-table-column label="序号" prop="index" width="50px" show-overflow-tooltip></el-table-column>
            <el-table-column label="序号" prop="index" width="50px" show-overflow-tooltip></el-table-column>
            <el-table-column label="序号" prop="index" width="50px" show-overflow-tooltip></el-table-column>
            <el-table-column label="序号" prop="index" width="50px" show-overflow-tooltip></el-table-column>
            <el-table-column label="序号" prop="index" width="50px" show-overflow-tooltip></el-table-column>
            <el-table-column label="序号" prop="index" width="50px" show-overflow-tooltip></el-table-column>

          </el-table>
        </div>
        <!--分页区域-->
        <div class="page-box">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryForm.pagenum"
              :page-sizes="[15, 30, 50]"
              :page-size="queryForm.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "PurchaseList",
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      queryForm: {
        supplier: null, // 供应商
        code: null, // 合同编号
        name: null, // 合同名称
        dateRange: [], // 日期范围
        executing: false, // 只显示执行中的合同
        pagenum: 1, // 页数
        pagesize: 15, // 每页大小
      },
      tableData: [],
      total:0, // 表格数据条数
    }
  },
  created() {
    this.getPurchaseList()
  },
  mounted() {
  },

  methods: {
    async getPurchaseList(){
      console.log(this.queryForm)
      const {data: res} = await this.$http.get('purchase/contract/',{params:this.queryForm})
    },
    async handleSizeChange(){},
    async handleCurrentChange(){},

  },
  computed: {},

}
</script>

<style scoped>
.second-row {
  display: flex;
}
.main-container{
  display: flex;
  flex-direction: column;
  justify-content:space-between;
  height:100%;
}
.table-box {
  height: 100%;
}
</style>