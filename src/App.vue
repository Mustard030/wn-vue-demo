<template>
  <div id="app" style="min-width: 1200px;height: 100%;">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
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
.el-link.el-link--default{
  color: #ffffff;
}
.el-link.el-link--default:hover{
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


</style>
