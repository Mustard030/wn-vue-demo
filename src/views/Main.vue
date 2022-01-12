<template>
  <div style="height:100%;">
    <el-container class="home-container">
      <el-header>
        <span style="-webkit-user-select:none;user-select:none;">重庆威能 | 物资管理系统</span>
        <div>
          <el-link icon="el-icon-s-home" :underline="false" @click="$router.push('/Home')">首页</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link icon="el-icon-s-tools" :underline="false">修改密码</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link icon="el-icon-error" :underline="false">退出</el-link>
        </div>
      </el-header>
      <el-container>
        <el-aside :style="{width:switchCollapseWidth}">
          <el-menu router :collapse="isCollapse" class="el-menu-vertical-demo">
            <el-menu-item @click="switchCollapse">
              <i class="el-icon-s-unfold" v-if="isCollapse" style="text-align: right"></i>
              <i class="el-icon-s-fold" v-else></i>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i><span slot="title">物资信息管理</span>
              </template>
              <el-menu-item index="Material">原材料信息管理</el-menu-item>
              <el-menu-item index="ProdInfo">产品信息管理</el-menu-item>
              <el-menu-item index="Stock">库点管理</el-menu-item>
              <el-menu-item index="Stock">设置库点物资库存预警值</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-menu"></i><span slot="title">采购管理</span></template>
              <el-menu-item index="PurchaseList">采购合同管理</el-menu-item>
              <el-menu-item index="2-1">合同价格变更管理</el-menu-item>
              <el-menu-item index="2-2">发票管理</el-menu-item>
              <el-menu-item index="2-2">送货通知单管理</el-menu-item>
              <el-menu-item index="2-2">预送货通知单管理</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><i class="el-icon-menu"></i><span slot="title">客户/供应商管理</span></template>
              <el-menu-item index="3-1">客户信息管理</el-menu-item>
              <el-menu-item index="3-2">供应商信息管理</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title"><i class="el-icon-menu"></i><span slot="title">销售管理</span></template>
              <el-menu-item index="3-1">销售合同管理</el-menu-item>
              <el-menu-item index="3-2">销售合同价格变更管理</el-menu-item>
              <el-menu-item index="3-1">发货通知单管理</el-menu-item>
              <el-menu-item index="3-2">开票申请管理</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title"><i class="el-icon-menu"></i><span slot="title">仓库管理</span></template>
              <el-menu-item index="3-1">材料入库管理</el-menu-item>
              <el-menu-item index="3-2">成品入库管理</el-menu-item>
              <el-menu-item index="3-1">生产领料管理</el-menu-item>
              <el-menu-item index="3-2">产品发货管理</el-menu-item>
              <el-menu-item index="3-1">物资移库管理</el-menu-item>
              <el-menu-item index="3-2">库存盘点管理</el-menu-item>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title"><i class="el-icon-menu"></i><span slot="title">综合查询</span></template>
              <!-- <el-menu-item-group title="物资信息、出入库及库存查询"> -->
              <el-menu-item index="3-1">物资信息查询</el-menu-item>
              <el-menu-item index="3-2">物资库存统计查询</el-menu-item>
              <el-menu-item index="3-1">物资采购入库统计查询</el-menu-item>
              <el-menu-item index="3-1">产品销售出库统计查询</el-menu-item>
              <el-menu-item index="3-2">物资移库统计查询</el-menu-item>
              <!-- </el-menu-item-group>
              <el-menu-item-group title="采购合同及执行情况统计查询"> -->
              <el-menu-item index="3-1">采购合同价格变更统计查询</el-menu-item>
              <el-menu-item index="3-1">按供应商查询合同执行情况</el-menu-item>
              <el-menu-item index="3-2">按物资查询合同执行情况</el-menu-item>
              <!-- </el-menu-item-group>
              <el-menu-item-group title="销售合同及执行情况统计查询"> -->
              <el-menu-item index="3-1">销售合同价格变更统计查询</el-menu-item>
              <el-menu-item index="3-1">按客户查询合同执行情况</el-menu-item>
              <el-menu-item index="3-2">按产品查询合同执行情况</el-menu-item>
              <!-- </el-menu-item-group> -->
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- <el-main style="height:100%;"> -->
        <!-- <el-main :style="{left:mainleftSize}"> -->
        <el-main :style="{marginLeft:mainleftSize}">
          <!-- <el-main :style="{width:switchCollapseMainWidth}"> -->
          <!-- <el-main> -->
          <!--          <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">-->
          <!--            <el-tab-pane-->
          <!--                v-for="(item, index) in editableTabs"-->
          <!--                :key="item.name"-->
          <!--                :label="item.title"-->
          <!--                :name="item.name"-->
          <!--            >-->
          <keep-alive>
            <router-view/>
          </keep-alive>
          <!--            </el-tab-pane>-->
          <!--          </el-tabs>-->

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      isCollapse: false,
      mainleftSize: "200px"
    }
  },
  methods: {
    switchCollapse() {
      this.isCollapse = !this.isCollapse
    },
    switchCollapseWidth() {
      if (this.isCollapse) {
        return '64px'
      }
      return '200px'
    },
  },
  watch: {
    isCollapse() {
      if (!this.isCollapse) {
        this.mainleftSize = "200px"
        // console.log('右')
      }
      else{
        this.mainleftSize = "64px"
        // console.log('左')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
}

.home-container {
  height: 100%;
}

.el-header {
  background-color: #409EFF;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  color: #ffffff;
  align-items: center;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;

  > div {
    display: flex;
    align-items: center;

  }
}

.el-link.el-link--default {
  color: #ffffff;
}

.el-link.el-link--default:hover {
  color: #ffffff;
}

.el-aside {
  background-color: #EAEDF1;
  // min-height: 100%;
  height: 100%;
  position: fixed;
  z-index: 8;
  // top: 60px;
  left: 0;
  margin-top: 60px;
  overflow-y: auto;
  overflow-x: hidden;
}

.el-main {
  height: 100%;
  background-color: #EAEDF1;
  // height: calc(100vh - 60px);
  padding: 10px;
  position: relative;
  top: 0;
  margin-top: 60px;
  overflow-y: scroll;
}

.el-menu {
  border-right: none;
  // min-height: 100%;
  height: 100%;
  position: fixed;
  z-index: 8;
  top: 60px;
  left: 0;
  // padding-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}
.el-link{
  -webkit-user-select:none;
  user-select:none;
}
// .el-submenu .el-menu-item {
//   padding: 0 20px!important;
// }
.el-submenu span {
  font-size: 15px;
  // font-weight: 700!important;
}
</style>