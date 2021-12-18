<template>
  <div>
    <!-- 面包屑导航栏 -->
    <my-breadcrumb :path="['物资信息管理','原材料信息管理']"></my-breadcrumb>

    <el-card>
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="queryForm.keywords" clearable>
            <template slot="prepend">名称或代号:</template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="queryForm.isProduct">仅显示可作为成品使用的原材料</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search" @click="getMaterialList">查询</el-button>
          <el-button type="primary" icon="el-icon-circle-plus" @click="addFormVisible=true">新增</el-button>
        </el-col>
      </el-row>

      <!-- 原材料列表区 -->
      <el-table :data="tableData" border stripe height="700">

        <el-table-column label="序号" prop="index" width="85px" show-overflow-tooltip></el-table-column>
        <el-table-column label="名称" prop="name" width="150px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="代号" prop="code" width="100px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-input v-model="scope.row.code" v-if="scope.row.edit" size="small"></el-input>
            <span v-else>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格型号" prop="standards" width="100px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-input v-model="scope.row.standards" v-if="scope.row.edit" size="small"></el-input>
            <span v-else>{{ scope.row.standards }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行标准" prop="exe_standard" width="100px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-input v-model="scope.row.exe_standard" v-if="scope.row.edit" size="small"></el-input>
            <span v-else>{{ scope.row.exe_standard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit" width="100px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-select v-model="scope.row.unit__name" filterable v-if="scope.row.edit" size="small">
              <el-option
                  v-for="item in unitData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.unit__name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="对应成品名称" prop="pro__name" width="100px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-input v-model="scope.row.pro__name" v-if="scope.row.edit" size="small"></el-input>
            <span v-else>{{ scope.row.pro__name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remarks" show-overflow-tooltip>
          <template v-slot="scope">
            <el-input v-model="scope.row.remarks" v-if="scope.row.edit" size="small"></el-input>
            <span v-else>{{ scope.row.remarks }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
                :enterable="false"
                v-if="!scope.row.edit"
                :key="scope.row.id"
            >
              <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="editItem(scope.row)"
              >
              </el-button>
            </el-tooltip>
            <!--完成修改-->
            <el-tooltip
                class="item"
                effect="dark"
                content="提交"
                placement="top"
                :enterable="false"
                v-if="scope.row.edit"
                :key="scope.row.id"
            >
              <el-button
                  type="success"
                  icon="el-icon-check"
                  size="small"
                  @click="submitEdit(scope.row)"
              >
              </el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
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
                  @click="deleteConfirm(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryForm.pagenum"
          :page-sizes="[10, 20, 50]"
          :page-size="queryForm.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          hide-on-single-page
      >
      </el-pagination>
    </el-card>

    <el-dialog title="添加原材料或成品" :visible.sync="addFormVisible">
      <el-form :model="addForm.data" label-width="80px" label-position="right" ref="addForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.data.name"></el-input>
        </el-form-item>
        <el-form-item label="代号" prop="code">
          <el-input v-model="addForm.data.code"></el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="standards">
          <el-input v-model="addForm.data.standards"></el-input>
        </el-form-item>
        <el-form-item label="执行标准" prop="exe_standard">
          <el-input v-model="addForm.data.exe_standard"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="addForm.data.unit" filterable>
            <el-option
                v-for="item in unitData"
                :key="item.value"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="is_product">
          <el-checkbox v-model="addForm.data.is_product" >此物料可作为成品使用</el-checkbox>
        </el-form-item>
        <el-form-item label="产品名称" prop="pro">
          <el-select v-model="addForm.data.pro" filterable :disabled="!addForm.is_product">
            <el-option
                v-for="item in productData"
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
              v-model="addForm.data.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddMaterial">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from "../HomePage/myBreadcrumb";

export default {
  name: "Material",
  components: {MyBreadcrumb},

  data() {
    return {
      // 添加表单显示
      addFormVisible: false,
      // 数据总数
      total: 0,
      // 查询表单
      queryForm: {
        keywords: null,
        isProduct: false,
        pagenum: 1,
        pagesize: 10,
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
          is_product:false,
          pro: null,
          remarks: null,
        }
      },
      // 返回数据
      tableData: [],
      // 单位列表
      unitData: [],
      // 成品列表
      productData: [],
    }
  },
  created() {
    this.getMaterialList()
    this.getUnitData()
    this.getProData()
  },
  methods: {
    // 提交添加原材料
    async submitAddMaterial() {
      const {data:res} = await this.$http.post('material/mater_mg/',this.addForm)
      if (res.ret === 0){
        this.$message.success("添加成功")
        this.$refs.addForm.resetFields()
        this.addFormVisible = false
        await this.getMaterialList()
        await this.getProData()
      }
    },
    // 提交修改
    async submitEdit(row) {
      let modifyForm = {
        action: "modify_material",
        id: row.id,
        newdata: {
          code: row.code,
          standards: row.standards,
          exe_standard: row.exe_standard,
          unit: row.unit__name,
          pro: row.pro__name,
          remarks: row.remarks
        }
      }
      const {data: res} = await this.$http.put('material/mater_mg/', modifyForm)
      if (res.ret === 0){
        row.edit = !row.edit
        this.$message.success("修改成功")
      }else if(res.ret === 1){
        await this.$confirm(res.msg, '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).catch(err => console.log(err))
      }else{
        this.$message.error("无法预计的错误")
      }
    },
    //删除确认
    async deleteConfirm(deleteId) {
      const confirm = await this.$confirm(`此操作将永久删除该条目, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => console.log(err))

      if (confirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const {data: res} = await this.$http.delete('material/mater_mg/', {params: {action:"del_material", id: deleteId}})
      if (res.ret === 0) {
        this.$message.success("删除成功")
        await this.getMaterialList()
      }else{
        this.$message.error(res.msg)
      }
    },
    // 获取原材料列表（提交查询）
    async getMaterialList() {
      let queryForm = {...this.queryForm, action: "list_material_filter"}
      const {data: res} = await this.$http.get('material/mater_mg/', {params: queryForm})
      res.retlist.forEach((item, index) => {
        item['edit'] = false
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
      }else{
        this.unitData = []
        this.$message.error("单位列表获取失败")
      }
    },
    // 获取成品表
    async getProData(){
      const {data:res} = await this.$http.get('material/mater_mg/',{params:{action:"list_pro"}})
      if (res.ret === 0){
        this.productData = res.retlist
      }else{
        this.productData = []
        this.$message.error("获取成品列表失败")
      }
    },
    // 改变分页大小
    async handleSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize
      await this.getMaterialList()
    },
    // 改变页码
    async handleCurrentChange(currentPage) {
      this.queryForm.pageSize = currentPage
      await this.getMaterialList()
    },
    //编辑行
    editItem(row) {
      row.edit = !row.edit
    },

  },
  filters: {}

}
</script>

<style scoped>
.el-checkbox {
  margin-top: 10px;
}
</style>
