<template>
  <div>
    <!-- 面包屑导航栏 -->
    <my-breadcrumb :path="['物资信息管理','原材料信息管理']"></my-breadcrumb>

    <el-card>
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="6"><el-input v-model="queryForm.keyword" clearable><template slot="prepend">名称或代号:</template></el-input></el-col>
        <el-col :span="6"><el-checkbox v-model="queryForm.isProduct">仅显示可作为成品使用的原材料</el-checkbox></el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search">查询</el-button>
          <el-button type="primary" icon="el-icon-circle-plus" @click="addMaterial">新增</el-button>
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
        <el-table-column label="名称" prop="itemName" fixed show-overflow-tooltip></el-table-column>
        <el-table-column label="代号" prop="itemClass" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column label="规格型号" prop="merchantName" show-overflow-tooltip></el-table-column>
        <el-table-column label="执行标准" prop="sales" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column label="单位" prop="reserve" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column label="对应成品名称" prop="price" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column label="备注" prop="unit" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="150px" fixed="right">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
                :enterable="false"
            >
              <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="editItem(scope.row)"
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
                v-for="item in options"
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
      total:0,
      // 查询表单
      queryForm:{
        keyword:null,
        isProduct:false,
        currentPage:1,
        pageSize:10,
      },
      // 添加表单
      addForm:{
        name:null,
        code:null,
        type:null,
        exeStandard:null,
        unit:null,
        isProduct:false,
        productName:null,
        remarks:null,
      },
      // 返回数据
      tableData: [],
    }
  },
  created() {
    this.getMaterialList()
  },
  methods: {
    addMaterial(){
      // 打开新增表单
      this.addFormVisible = true
    //  网络请求
    },
    submitAddMaterial(){
    //提交后处理
    },
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
    async getMaterialList(){
      let data = []
      for(let i=1;i<=20;i++){
        data.push(
            {
              id:i,
            }
        )
      }
      data.forEach((item)=>{
        item['edit'] = false
      })
      console.log(data)
      this.tableData = data
    },
    editing(){
      this.tableData.forEach((item)=>{
        if(item.edit === true){return true}
      })
      return false
    },
    async handleSizeChange(pageSize){
      if (this.editing){
        this.$confirm(`您有条目正在编辑，是否先去保存变更?`, '提示', {
          confirmButtonText: '先去保存',
          cancelButtonText: '直接跳转',
          type: 'warning'
        }).then(() => {
          //确认方法
          return true
        }).catch(() => {
          // 取消删除方法
          this.$message({
            type: 'info',
            message: '取消删除'
          });
        });
      }
      this.queryForm.pageSize = pageSize
      await this.getMaterialList()
    },
    async handleCurrentChange(currentPage){
      this.queryForm.pageSize = currentPage
      await this.getMaterialList()
    },
    editItem(row){
      row.edit = !row.edit
    },
  }
}
</script>

<style scoped>
.el-checkbox{
  margin-top: 10px;
}
</style>
