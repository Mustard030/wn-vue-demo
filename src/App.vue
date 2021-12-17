<template>
  <div id="app">
    <el-container>
      <el-header>威能物资管理系统</el-header>
      <el-container>
        <el-aside :width="switchCollapseWidth">
          <el-menu unique-opened router :collapse="isCollapse" class="el-menu-vertical-demo">
            <el-menu-item @click="switchCollapse">
              <i class="el-icon-s-unfold" v-if="isCollapse" style="text-align: right"></i>
              <i class="el-icon-s-fold" v-else></i>
            </el-menu-item>
            <el-menu-item index="Home"><i class="el-icon-s-home"></i><span>首页</span></el-menu-item>
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-menu"></i><span slot="title">物资信息管理</span></template>
              <el-menu-item index="Material">原材料信息管理</el-menu-item>
              <el-menu-item index="ProdInfo">产品信息管理</el-menu-item>
              <el-menu-item index="Stock">库点管理</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-menu"></i><span slot="title">导航二</span></template>
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
        <el-main>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
    <!-- 路由占位符 -->

  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      isCollapse: false
    }
  },
  methods: {
    switchCollapse() {
      this.isCollapse = !this.isCollapse
      return this.isCollapse
    },
    switchCollapseWidth() {
      if (this.isCollapse) {
        return '64px'
      }
      return '200px'
    },
  },
  computed: {

  }
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
}

.headtool {
  cursor: pointer;
}

.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
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

.el-aside {
  background-color: #EAEDF1;
}

.el-main {
  background-color: #EAEDF1;
}

.el-menu {
  border-right: none;
}

#username {
  margin-right: 20px;
  font-size: 15px;
}

#ava {
  margin-right: 15px;
}
</style>
