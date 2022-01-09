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
                <el-form-item label="合同名称：">
                  <el-input v-model="queryForm.name" size="mini"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同编号：">
                  <el-input v-model="queryForm.code" size="mini"/>
                </el-form-item>
              </el-col>
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
              <el-col :span="3">
                <el-form-item>
                  <el-checkbox v-model="queryForm.executing" size="mini">只显示执行中的合同</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="second-row">
              <el-row :gutter="20">
                <el-col :span="13">
                  <el-form-item label="签订日期从:">
                    <el-date-picker
                        v-model="queryForm.dateRange"
                        type="daterange"

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
                    :row-style="{height: '40px'}"
                    :cell-style="{padding: '0'}">
            <el-table-column label="序号" prop="index" width="50px" fixed align="center"></el-table-column>
            <af-table-column label="合同名称" prop="name" show-overflow-tooltip fixed>
              <template v-slot="scope">
                <el-link @click="detailPurchase(scope.row.contract_id)">{{ scope.row.name }}</el-link>
              </template>
            </af-table-column>
            <el-table-column label="供应商" prop="supplier" show-overflow-tooltip fixed></el-table-column>
            <el-table-column label="合同编号" prop="contract_id" show-overflow-tooltip fixed></el-table-column>
            <el-table-column label="签订日期" prop="date" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="签订地点" prop="place" show-overflow-tooltip></el-table-column>
            <el-table-column label="合同金额" prop="money" width="80px" show-overflow-tooltip></el-table-column>
            <el-table-column label="合同附件" prop="appendix" width="80px" show-overflow-tooltip align="center">
              <template v-slot="scope">
                <el-button icon="el-icon-document" size="mini" type="primary"
                           @click="appendixDialog(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column label="合同状态" prop="state" width="80px" show-overflow-tooltip></el-table-column>
            <el-table-column label="备注" prop="remarks" width="150px" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="180px" fixed="right" align="center">
              <template v-slot="scope">
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
                      size="mini"
                      @click="editPurchase(scope.row.contract_id)"
                  />
                </el-tooltip>

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
                      size="mini"
                      @click="deletePurchase(scope.row.contract_id)"
                  />
                </el-tooltip>


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
                      size="mini"
                      @click="stopPurchase(scope.row.contract_id)"
                  />
                </el-tooltip>

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
    <el-dialog title="新增采购合同" :visible.sync="addPurchaseDialogVisible" :close-on-click-modal="false">
      <div class="scroll">
        <el-scrollbar>
          <el-form label-position="right" label-width="90px" size="mini">
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>合同基础信息</span></div>
            <el-form-item label="合同名称:">
              <el-input></el-input>
            </el-form-item>
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
              <el-table :data="addPurchaseForm.detail" border
                        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                        :row-style="{height: '40px'}"
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPurchaseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddPurchase">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改采购合同" :visible.sync="editPurchaseDialogVisible" :close-on-click-modal="false">
      <div class="scroll">
        <el-scrollbar>
          <el-form label-position="right" label-width="90px" size="mini">
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>合同基础信息</span></div>
            <el-form-item label="合同名称:">
              <el-input></el-input>
            </el-form-item>
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
              <el-table :data="editPurchaseForm.detail" border
                        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                        :row-style="{height: '40px'}"
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPurchaseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditPurchase">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看合同详情" :visible.sync="detailPurchaseDialogVisible" :close-on-click-modal="false">
      <div class="scroll">
        <el-scrollbar>
          <el-form label-position="right" label-width="90px" size="mini">
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>合同基础信息</span></div>
            <el-form-item label="合同名称:">
              <span></span>
            </el-form-item>
            <el-form-item label="合同编号:">
              <span></span>
            </el-form-item>
            <el-form-item label="供应商:">
              <span></span>
            </el-form-item>
            <el-form-item label="签订日期:">
              <span></span>
            </el-form-item>
            <el-form-item label="签订地点:">
              <span></span>
            </el-form-item>
            <el-form-item label="备注:">
              <span></span>
            </el-form-item>
            <el-form-item label="附件:">
              <span></span>
            </el-form-item>
            <el-divider/>
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>物资明细</span></div>
            <div>
              <el-table :data="detailPurchaseForm.detail" border
                        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                        :row-style="{height: '40px'}"
                        :cell-style="{padding: '0'}">
                <el-table-column label="序号" prop="date" width="40px" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="物资名称" prop="date" show-overflow-tooltip></el-table-column>
                <el-table-column label="代号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="规格型号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="执行标准" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="单位" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="数量" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="单价" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="已送货数量" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="金额" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="date" width="100px" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
            <el-divider/>
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>送货明细</span></div>
            <div>
              <el-table :data="detailPurchaseForm.deliver" border
                        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                        :row-style="{height: '40px'}"
                        :cell-style="{padding: '0'}">
                <el-table-column label="序号" prop="date" width="40px" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="入库日期" prop="date" show-overflow-tooltip></el-table-column>
                <el-table-column label="物资名称" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="代号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="规格型号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="单位" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="入库数量" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="库管员" prop="date" width="100px" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
            <el-divider/>
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>发票明细</span></div>
            <div>
              <el-table :data="detailPurchaseForm.invoice" border
                        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                        :row-style="{height: '40px'}"
                        :cell-style="{padding: '0'}">
                <el-table-column label="序号" prop="date" width="40px" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="发票代码" prop="date" show-overflow-tooltip></el-table-column>
                <el-table-column label="发票号码" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="开票日期" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="金额（含税）" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="发票图片" prop="date" width="100px" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </el-form>

        </el-scrollbar>
      </div>
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
      }, // 查询表单
      addPurchaseForm:{
        name: null,
        code: null,
        supplier: null,
        detail:[],
      },// 添加合同表单
      editPurchaseForm:{
        name: null,
        code: null,
        supplier: null,
        detail:[],
      },//修改合同表单
      detailPurchaseForm:{
        name: null,
        code: null,
        supplier: null,
        detail:[],
        deliver:[],
        invoice:[],
      },//合同详情表单
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

      supplierList:[],// 供应商列表
      appendixDialogVisible: false,  // 附件弹窗显示
      addPurchaseDialogVisible: false,  // 新增合同弹窗显示
      editPurchaseDialogVisible: false,  // 编辑合同弹窗显示
      detailPurchaseDialogVisible: false,  // 合同详情弹窗显示
      total: 0,  // 表格数据条数
      totalMoney: 100,// 总金额
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
      // const {data: res} = await this.$http.get('test/', {params: this.queryForm})
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
    // 附件
    appendixDialog(row) {
      this.appendixDialogVisible = true
    },
    // 新增采购合同
    addPurchase() {
      this.addPurchaseDialogVisible = true
    },
    // 提交新增合同
    submitAddPurchase(){},
    // 采购合同详细信息
    detailPurchase(contract_id) {
      this.detailPurchaseDialogVisible = true
    },
    // 编辑采购合同
    editPurchase(contract_id) {
      this.editPurchaseDialogVisible = true
    },
    // 提交修改合同
    submitEditPurchase(){},
    // 删除采购合同
    deletePurchase(contract_id) {
    },
    // 终止采购合同
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
  height: 60vh;
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