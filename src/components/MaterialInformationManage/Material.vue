<template>
  <div>
    <!-- 面包屑导航栏 -->
    <my-breadcrumb :path="['物资信息管理','原材料信息管理']"></my-breadcrumb>

    <el-card>
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="queryForm.keyword" clearable>
            <template slot="prepend">名称或代号:</template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="queryForm.isProduct">仅显示可作为成品使用的原材料</el-checkbox>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search">查询</el-button>
          <el-button type="primary" icon="el-icon-circle-plus" @click="addFormVisible=true">新增</el-button>
        </el-col>
      </el-row>

      <!-- 原材料列表区 -->
      <el-table :data="tableData" border stripe max-height="700">
        <el-table-column type="expand" fixed>
          <template v-slot="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <div>
                <el-form-item label="详情页内容">
                  <div>
                    <p v-html="props.row.introduce"></p>
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="index" width="85px" fixed show-overflow-tooltip></el-table-column>
        <el-table-column label="名称" prop="name" width="150px" fixed show-overflow-tooltip>
          <template v-slot="scope">
            <el-input v-model="scope.row.name" v-if="scope.row.edit" size="small"></el-input>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代号" prop="code" width="100px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-input v-model="scope.row.code" v-if="scope.row.edit" size="small"></el-input>
            <span v-else>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格型号" prop="type" width="100px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-input v-model="scope.row.type" v-if="scope.row.edit" size="small"></el-input>
            <span v-else>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行标准" prop="exeStandard" width="100px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-input v-model="scope.row.exeStandard" v-if="scope.row.edit" size="small"></el-input>
            <span v-else>{{ scope.row.exeStandard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit" width="100px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-select v-model="scope.row.unit" filterable v-if="scope.row.edit" size="small">
              <el-option
                  v-for="item in unitData"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label">
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="对应成品名称" prop="productName" width="100px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-input v-model="scope.row.productName" v-if="scope.row.edit" size="small"></el-input>
            <span v-else>{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remarks" show-overflow-tooltip>
          <template v-slot="scope">
            <el-input v-model="scope.row.remarks" v-if="scope.row.edit" size="small"></el-input>
            <span v-else>{{ scope.row.remarks }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px" fixed="right">
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
          :current-page="queryForm.currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="queryForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="添加原材料或成品" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="80px" label-position="right">
        <el-form-item label="名称">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="代号">
          <el-input v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="执行标准">
          <el-input v-model="addForm.exeStandard"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="addForm.unit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="addForm.isProduct">此物料可作为成品使用</el-checkbox>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-select v-model="addForm.productName" filterable placeholder="成品选择" :disabled="!addForm.isProduct">
            <el-option
                v-for="item in productData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
              type="textarea"
              :rows="2"
              v-model="addForm.remarks"></el-input>
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
        keyword: null,
        isProduct: false,
        currentPage: 1,
        pageSize: 10,
      },
      // 添加表单
      addForm: {
        name: null,
        code: null,
        type: null,
        exeStandard: null,
        unit: null,
        isProduct: false,
        productName: null,
        remarks: null,
      },
      // 返回数据
      tableData: [],
      // 单位列表
      unitData: [
        {
          label: "斤",
          id: 1
        },
        {
          label: "吨",
          id: 2
        },
        {
          label: "袋",
          id: 3
        },
        {
          label: "箱",
          id: 4
        },
      ],
      // 成品列表
      productData: [],
    }
  },
  created() {
    this.getMaterialList()
  },
  methods: {
    // 添加原材料
    addMaterial() {
      // 打开新增表单
      this.addFormVisible = true
      //  网络请求
    },
    // 提交添加原材料
    submitAddMaterial() {
      //提交后处理
    },
    // 提交修改
    submitEdit(row){
      row.edit = !row.edit
      console.log("提交")
    },
    //删除确认
    deleteConfirm(deleteId) {
      this.$confirm(`此操作将永久删除该原材料${deleteId}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //确认删除方法
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        // 取消删除方法
        this.$message({
          type: 'info',
          message: '取消删除'
        });
      });
    },
    // 获取原材料列表（提交查询）
    async getMaterialList() {
      let data = []
      for (let i = 1; i <= 20; i++) {
        data.push(
            {
              id: i,
              name:"产品名",
              code:"产品代号",
              type:"规格型号",
              exeStandard:"执行标准",
              unit:"斤",
              productName:"成品名",
              remarks: "一些备注"
            }
        )
      }

      data.forEach((item, index) => {
        item['edit'] = false
        item['index'] = index + 1
      })
      this.tableData = data
      this.total = 100
    },
    // 检查是否正在编辑
    editing() {
      for(let item of this.tableData){
        if(item.edit === true){
          return true
        }
      }
      return false
    },
    // 改变分页大小
    async handleSizeChange(pageSize) {
      if (this.editing()) {
        this.$confirm(`您有条目正在编辑，是否先去保存变更?`, '提示', {
          confirmButtonText: '先去保存',
          cancelButtonText: '直接跳转',
          type: 'warning'
        }).then(() => {
          return false
        }).catch(() => {
          // 取消删除方法
          this.queryForm.pageSize = pageSize
          this.getMaterialList()
        });
      }
    },
    // 改变页码
    async handleCurrentChange(currentPage) {
      if (this.editing()) {
        this.$confirm(`您有条目正在编辑，是否先去保存变更?`, '提示', {
          confirmButtonText: '先去保存',
          cancelButtonText: '直接跳转',
          type: 'warning'
        }).then(() => {
          return false
        }).catch(() => {
          // 直接跳转
          this.queryForm.pageSize = currentPage
          this.getMaterialList()
        });
      }

    },
    //编辑行
    editItem(row) {
      row.edit = !row.edit
    },

  },

}
</script>

<style scoped>
.el-checkbox {
  margin-top: 10px;
}
</style>
