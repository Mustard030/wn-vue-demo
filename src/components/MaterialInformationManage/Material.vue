<template>
  <div>
    <!-- 面包屑导航栏 -->
    <my-breadcrumb :path="['物资信息管理','原材料信息管理']"></my-breadcrumb>

    <el-card>
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="6"><el-input><template slot="prepend">名称:</template></el-input></el-col>
        <el-col :span="6"><el-input><template slot="prepend">代号:</template></el-input></el-col>
        <el-col :span="6"><el-checkbox v-model="checked">仅显示可作为成品使用的原材料</el-checkbox></el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search">查询</el-button>
          <el-button type="primary" icon="el-icon-circle-plus" @click="addMaterial">新增</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区 -->
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
        <el-table-column label="序号" prop="id" width="85px" fixed></el-table-column>
        <el-table-column label="名称" prop="itemName" fixed></el-table-column>
        <el-table-column label="代号" prop="itemClass" width="100px"></el-table-column>
        <el-table-column label="规格型号" prop="merchantName"></el-table-column>
        <el-table-column label="执行标准" prop="sales" width="100px"></el-table-column>
        <el-table-column label="单位" prop="reserve" width="100px"></el-table-column>
        <el-table-column label="对应成品名称" prop="price" width="100px"></el-table-column>
        <el-table-column label="备注" prop="unit" width="100px"></el-table-column>
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
                  @click="goEditPage(scope.row.id)"
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

      <!-- 分页区域 -->
<!--          <el-pagination-->
<!--              @size-change="handleSizeChange"-->
<!--              @current-change="handleCurrentChange"-->
<!--              :current-page="queryInfo.pagenum"-->
<!--              :page-sizes="[10, 20, 50]"-->
<!--              :page-size="queryInfo.pagesize"-->
<!--              layout="total, sizes, prev, pager, next, jumper"-->
<!--              :total="total"-->
<!--          >-->
<!--          </el-pagination>-->
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
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.type"></el-input>
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
      addFormVisible: false,
      addForm:{
        name:null,
        code:null,

      },
      tableData: [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        },
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        }, {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 1
        },

      ],
    }
  },
  created() {
  },
  methods: {
    addMaterial(){
      this.addFormVisible = true

    },
    submitAddMaterial(){

    },
    deleteConfirm(deleteId) {
      this.$confirm(`此操作将永久删除该原材料${deleteId}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  }
}
</script>

<style scoped>
.el-checkbox{
  margin-top: 10px;
}
</style>
