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
          <el-menu unique-opened router :collapse="isCollapse" class="el-menu-vertical-demo">
            <el-menu-item @click="switchCollapse">
              <i class="el-icon-s-unfold" v-if="isCollapse" style="text-align: right"></i>
              <i class="el-icon-s-fold" v-else></i>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-menu"></i><span slot="title">物资信息管理</span></template>
              <el-menu-item index="Material">原材料信息管理</el-menu-item>
              <el-menu-item index="ProdInfo">产品信息管理</el-menu-item>
              <el-menu-item index="Stock">库点管理</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-menu"></i><span slot="title">采购管理</span></template>
              <el-menu-item index="PurchaseList">采购合同管理</el-menu-item>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="2-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><i class="el-icon-setting"></i><span slot="title">导航三</span></template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="3-1">选项1</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="3-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="3-4">
                <template slot="title">选项4</template>
                <el-menu-item index="3-4-1">选项4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main style="height:100%;">
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
      isCollapse: false
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
}

.el-main {
  height: 100%;
  background-color: #EAEDF1;
}

.el-menu {
  border-right: none;
  min-height: 100%;
}
.el-link{
  -webkit-user-select:none;
  user-select:none;
}
</style>