<template>
  <div class="container" style="height: 100%;">
    <el-card style="height: 100%">
      <div slot="header">
        <span>原材料信息管理</span>
      </div>

      <div class="main-container">
        <!-- 搜索区 -->
        <div class="search-box">
          <el-form label-position="right" label-width="50px">
            <el-row :gutter="20">
              <el-col :span="5">
                <el-form-item label="名称:">
                  <el-input v-model="queryForm.name" clearable size="mini"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="代号:">
                  <el-input v-model="queryForm.code" clearable size="mini"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-checkbox v-model="queryForm.isProduct" size="mini">仅显示可作为成品使用的原材料</el-checkbox>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" icon="el-icon-search" @click="getMaterialList" size="mini">查询</el-button>
                <el-button type="primary" icon="el-icon-circle-plus" @click="addFormVisible=true" size="mini">新增
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 原材料列表区 -->
        <div class="table-box">
          <el-table :data="tableData" border height="60vh"
                    :header-cell-style="{textAlign:'center',background:'#F3F4F7',color:'#555'}"
                    :row-style="{height: '40px'}"
                    :cell-style="{padding: '0'}"
          >
            <el-table-column label="序号" prop="index" width="50px" fixed align="center"></el-table-column>
            <af-table-column label="名称" prop="name" show-overflow-tooltip fixed>
              <template v-slot="scope">
                <el-link>{{ scope.row.name }}</el-link>
              </template>
            </af-table-column>
            <el-table-column label="代号" prop="code" width="100px" show-overflow-tooltip fixed></el-table-column>
            <el-table-column label="规格型号" prop="standards" width="100px" show-overflow-tooltip>
              <template v-slot="scope">
                <el-input v-model="scope.row.standards" v-if="scope.row.edit" size="small"></el-input>
                <span v-else>{{ scope.row.standards }}</span>
              </template>
            </el-table-column>
            <el-table-column label="执行标准" prop="exe_standard" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="unitID" width="60px" show-overflow-tooltip align="center">
              <template v-slot="scope">
                <span>{{ unitName(scope.row.unitID) }}</span>
              </template>
            </el-table-column>
            <af-table-column label="对应成品名称" prop="proID" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ proName(scope.row.proID) }}</span>
              </template>
            </af-table-column>
            <el-table-column label="备注" prop="remarks" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="120px">
              <template v-slot="scope">
                <!-- 修改按钮 -->
                <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="openEditForm(scope.row)"
                >
                </el-button>
                <!-- 删除按钮 -->
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteConfirm(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页区域 -->
        <div class="page-box">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryForm.pagenum"
              :page-sizes="[20, 40, 60, 80, 100]"
              :page-size="queryForm.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!--  弹窗区  -->
    <el-dialog title="新增原材料" :visible.sync="addFormVisible" :close-on-click-modal="false" customClass="customWidth">
      <el-form :model="addForm.data" label-width="80px" label-position="right" ref="addForm" :rules="formRules" size="mini">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.data.name" size="mini"/>
        </el-form-item>
        <el-form-item label="代号" prop="code">
          <el-input v-model="addForm.data.code" size="mini"/>
        </el-form-item>
        <el-form-item label="规格型号" prop="standards">
          <el-input v-model="addForm.data.standards" size="mini"/>
        </el-form-item>
        <el-form-item label="执行标准" prop="exe_standard">
          <el-input v-model="addForm.data.exe_standard" size="mini"/>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="addForm.data.unit" filterable clearable size="mini">
            <el-option
                v-for="item in unitData"
                :key="item.value"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="pro">
          <el-checkbox v-model="addForm.data.is_product" @change="clearPro">此物料可作为成品使用</el-checkbox>
          <el-select v-model="addForm.data.pro" filterable clearable :disabled="!addForm.data.is_product" size="mini">
            <el-option
                v-for="item in unbindproductData"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
              type="textarea"
              :rows="2"
              v-model="addForm.data.remarks"
              size="mini"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddMaterial">确 定</el-button>
        <el-button @click="cancelAdd">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改原材料" :visible.sync="editFormVisible" :close-on-click-modal="false" customClass="customWidth">
      <el-form :model="editForm" label-width="80px" label-position="right" ref="editForm" :rules="formRules" size="mini">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
          <!--          <span>{{ editForm.name }}</span>-->
        </el-form-item>
        <el-form-item label="代号" prop="code">
          <el-input v-model="editForm.code"></el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="standards">
          <el-input v-model="editForm.standards"></el-input>
        </el-form-item>
        <el-form-item label="执行标准" prop="exe_standard">
          <el-input v-model="editForm.exe_standard"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="editForm.unit" filterable clearable>
            <el-option
                v-for="item in unitData"
                :key="item.value"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="pro">
          <el-checkbox v-model="editForm.is_product" @change="clearPro">此物料可作为成品使用</el-checkbox>
          <el-select v-model="editForm.pro" filterable clearable :disabled="!editForm.is_product">
            <el-option
                v-for="item in editUnbindProductData"
                :key="item.value"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
              type="textarea"
              :rows="2"
              v-model="editForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEdit">确 定</el-button>
        <el-button @click="editFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "Material",

  data() {
    return {
      // 添加表单显示
      addFormVisible: false,
      // 修改表单显示
      editFormVisible: false,
      // 数据总数
      total: 0,
      // 查询表单
      queryForm: {
        name: "",
        code: "",
        isProduct: false,
        pagenum: 1,
        pagesize: 20,
      },
      // 添加表单
      addForm: {
        action: "add_material",
        data: {
          name: null,
          code: null,
          standards: null,
          exe_standard: null,
          unit: null,
          is_product: false,
          pro: null,
          remarks: null,
        }
      },
      // 修改表单
      editForm: {
        action: "edit_material",
        id: 0,
        name: null,
        code: null,
        standards: null,
        exe_standard: null,
        unit: null,
        is_product: false,
        pro: null,
        remarks: null,
      },
      // 表单规则
      formRules: {
        name: [{required: true, message: '请填写名称', trigger: 'blur'}],
        unit: [{required: true, message: '请选择单位', trigger: 'blur'}],
      },
      // 返回数据
      tableData: [],
      // 单位列表
      unitData: [],
      // 成品列表
      productData: [],
      // 未绑定成品列表
      unbindproductData: [],
      // 编辑用未绑定成品列表
      editUnbindProductData: [],
    }
  },
  created() {
    this.getMaterialList()
    this.getUnitData()
    this.getUnbindProData()
    this.getAllProData()
  },
  methods: {
    // 提交添加原材料
    submitAddMaterial() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        const {data: res} = await this.$http.post('material/mater_mg/', this.addForm)
        if (res.ret === 0) {
          this.$message.success("添加成功")
          this.$refs.addForm.resetFields()
          this.addFormVisible = false
          await this.getMaterialList()
          await this.getUnbindProData()
        }else if (res.ret === 1){
          this.$message.error(res.msg)
        }
      })
    },
    // 取消添加原材料
    cancelAdd() {
      this.addFormVisible = false
      this.$refs.addForm.resetFields()
    },
    // 打开修改表单
    openEditForm(row) {
      this.editForm.id = row.id
      this.editForm.name = row.name
      this.editForm.code = row.code
      this.editForm.standards = row.standards
      this.editForm.exe_standard = row.exe_standard
      this.editForm.unit = row.unitID
      this.editForm.is_product = row.proID !== ''
      this.editForm.pro = row.proID
      this.editForm.remarks = row.remarks
      this.editFormVisible = true
      this.refreshEditUnbindProductData(row.proID)
    },
    // 更改编辑用未绑定成品列表
    refreshEditUnbindProductData(proID) {
      this.editUnbindProductData = []
      for (let item of this.unbindproductData) {
        this.editUnbindProductData.push(item)
      }

      for (let item of this.productData) {
        if (item.id === proID) {
          this.editUnbindProductData.push(item)
        }
      }
    },
    // 提交修改
    submitEdit() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return
        let form = {
          action: "edit_material",
          id: this.editForm.id,
          newdata: {
            code: this.editForm.code,
            standards: this.editForm.standards,
            exe_standard: this.editForm.exe_standard,
            unit: this.editForm.unit,
            pro: this.editForm.pro,
            remarks: this.editForm.remarks
          }
        }
        const {data: res} = await this.$http.put('material/mater_mg/', form)
        if (res.ret === 0) {
          this.$message.success("修改成功")
          this.editFormVisible = false
        } else if (res.ret === 1) {
          await this.$confirm(res.msg, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).catch(err => console.log(err))
        } else {
          this.$message.error("无法预计的错误")
        }
        await this.getUnbindProData()
        await this.getAllProData()
        await this.getMaterialList()
      })
    },
    //删除确认
    async deleteConfirm(row) {
      const confirm = await this.$confirm(`确定要删除名称为“${row.name}”，代号为“${row.code}”的原材料信息？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        cancelButtonClass: 'ccbtn',
        confirmButtonClass: 'ccbtn',

      }).catch(err => console.log(err))

      if (confirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const {data: res} = await this.$http.delete('material/mater_mg/', {
        params: {
          action: "del_material",
          id: row.id
        }
      })
      if (res.ret === 0) {
        this.$message.success("删除成功")
        await this.getMaterialList()
        await this.getUnbindProData()
      } else {
        this.$message.error(res.msg)
      }

    },
    // 获取原材料列表（提交查询）
    async getMaterialList() {
      let queryForm = {...this.queryForm, action: "list_material_filter"}
      let {data: res} = await this.$http.get('material/mater_mg/', {params: queryForm})
      res.retlist.forEach((item, index) => {
        item['index'] = index + 1
      })
      if (res.ret === 0 || res.ret === 1) {
        this.tableData = res.retlist
        this.total = res.total
      } else {
        this.$message.error("发生错误，可以在控制台查看")
        console.log(res.msg)
      }

    },
    // 获取单位表
    async getUnitData() {
      const {data} = await this.$http.get('material/mater_mg/', {params: {action: 'list_unit'}})
      if (data.ret === 0) {
        this.unitData = data.retlist
      } else {
        this.unitData = []
        this.$message.error("单位列表获取失败")
      }
    },
    // 获取未绑定成品表
    async getUnbindProData() {
      const {data: res} = await this.$http.get('material/mater_mg/', {params: {action: "list_pro"}})
      if (res.ret === 0) {
        this.unbindproductData = res.retlist
      } else {
        this.unbindproductData = []
        this.$message.error("获取未绑定成品列表失败")
      }
    },
    // 获取全部成品表
    async getAllProData() {
      const {data: res} = await this.$http.get('material/mater_mg/', {params: {action: "list_product"}})
      if (res.ret === 0) {
        this.productData = res.retlist
      } else {
        this.productData = []
        this.$message.error("获取全部成品列表失败")
      }
    },
    // 改变分页大小
    async handleSizeChange(pageSize) {
      this.queryForm.pagesize = pageSize
      await this.getMaterialList()
    },
    // 改变页码
    async handleCurrentChange(currentPage) {
      this.queryForm.pagenum = currentPage
      await this.getMaterialList()
    },
    // 取消是成品时清除成品字段
    clearPro(value) {
      if (!value) {
        this.addForm.data.pro = ''
        this.editForm.pro = ''
      }
    }
  },
  computed: {
    proName() {
      return function (proID) {
        for (let item of this.productData) {
          if (item.id === proID) {
            return item.name
          }
        }
      }
    },
    unitName() {
      return function (unitID) {
        for (let item of this.unitData) {
          if (item.id === unitID) {
            return item.name
          }
        }
      }
    },
  },
}
</script>

<style scoped>
.el-col > .el-checkbox {
  margin-top: 10px;
}

.el-col > .el-button {
  margin-top: 5px;
}

.el-form-item__content > .el-checkbox {
  margin-right: 20px;
}

.el-form-item {
  margin-bottom: 13px;
}

.container {
  height: 100%;
}

.el-card {
  height: 100%;
  box-sizing: border-box;
  position: relative;
}

.main-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.table-box {
  flex: 1;
  /*height: 100%;*/
}


</style>
<style>
.customWidth {
  width: 600px;
}
</style>