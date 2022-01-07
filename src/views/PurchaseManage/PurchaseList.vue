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
                    <el-button type="primary" icon="el-icon-circle-plus" @click="addPurchase" size="small">新增
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
        <!--表单区域-->
        <div class="table-box">
          <el-table :data="tableData" border height="58vh"
                    :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                    :row-style="{height: '90px'}"
                    :cell-style="{padding: '0'}">
            <el-table-column label="序号" prop="index" width="50px" fixed align="center"></el-table-column>
            <el-table-column label="供应商" prop="supplier" show-overflow-tooltip fixed></el-table-column>
            <el-table-column label="合同编号" prop="contract_id" show-overflow-tooltip fixed></el-table-column>
            <el-table-column label="合同名称" prop="name" show-overflow-tooltip fixed>
              <template v-slot="scope">
                <el-link @click="detailPurchase">{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="签订日期" prop="date" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="签订地点" prop="place" show-overflow-tooltip></el-table-column>
            <el-table-column label="合同金额" prop="money" width="80px" show-overflow-tooltip></el-table-column>
            <el-table-column label="合同附件" prop="appendix" width="80px" show-overflow-tooltip align="center">
              <template v-slot="scope">
                <el-button icon="el-icon-document" size="small" type="primary" @click="appendixDialog(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column label="合同状态" prop="state" width="80px" show-overflow-tooltip></el-table-column>
            <el-table-column label="备注" prop="remarks" width="150px" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="120px" fixed="right" align="center">
              <template v-slot="scope">
                <el-row :gutter="24">
                  <el-col :span="10" style="margin-bottom:5px;">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="详细信息"
                        placement="top"
                        :enterable="false"
                    >
                      <el-button
                          type="warning"
                          icon="el-icon-document"
                          size="small"
                          @click="detailPurchase(scope.row.contract_id)"
                      />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="10">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="更改"
                        placement="top"
                        :enterable="false"
                    >
                      <el-button
                          type="primary"
                          icon="el-icon-edit"
                          size="small"
                          @click="editPurchase(scope.row.contract_id)"
                      />
                    </el-tooltip>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="10">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="删除"
                        placement="top"
                        :enterable="false"
                    >
                      <el-button
                          type="danger"
                          icon="el-icon-delete"
                          size="small"
                          @click="deletePurchase(scope.row.contract_id)"
                      />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="10">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="终止"
                        placement="top"
                        :enterable="false"
                    >
                      <el-button
                          type="danger"
                          icon="el-icon-switch-button"
                          size="small"
                          @click="stopPurchase(scope.row.contract_id)"
                      />
                    </el-tooltip>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>

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

    <!--  弹窗区域  -->
      <el-dialog title="合同附件列表" :visible.sync="appendixDialogVisible" :close-on-click-modal="false">

      </el-dialog>
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
      tableData: [
        {
          contract_id: 1,
          supplier: "supplier",
          name: "name",
          date: "2021-01-28",
          place: "地点",
          money: 10000,
          appendix: {
            name: "文件名",
            url: "文件路径"
          },
          remarks: "备注",
          state: "状态",
        },
        {
          contract_id: 2,
          supplier: "supplier",
          name: "name",
          date: "2021-01-28",
          place: "地点",
          money: 10000,
          appendix: {
            name: "文件名",
            url: "文件路径"
          },
          remarks: "备注",
          state: "状态",
        }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
      ],
      appendixDialogVisible:false,
      total: 0, // 表格数据条数
    }
  },
  created() {
    // this.getPurchaseList()
  },
  mounted() {
  },

  methods: {
    async getPurchaseList() {
      console.log(this.queryForm)
      const {data: res} = await this.$http.get('purchase/contract/', {params: this.queryForm})
      res.retlist.forEach((item, index) => {
        item['index'] = index + 1
      })
    },
    async handleSizeChange(pageSize) {
      this.queryForm.pagesize = pageSize
      await this.getPurchaseList()
    },
    async handleCurrentChange(currentPage) {
      this.queryForm.pagenum = currentPage
      await this.getPurchaseList()
    },
    appendixDialog(row){
      this.appendixDialogVisible = true
    },
    addPurchase() {
      this.$router.push({name: 'AddPurchase'})
    },
    detailPurchase(contract_id) {
    },
    editPurchase(contract_id) {
      this.$router.push({name: 'EditPurchase', params: {contract_id}})
    },
    deletePurchase(contract_id) {
    },
    stopPurchase(contract_id) {
    },

  },
  computed: {},

}
</script>

<style scoped>
.second-row {
  display: flex;
}

.main-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.table-box {
  height: 100%;
}

.cell .el-row {
  margin-bottom: 5px;
}

</style>