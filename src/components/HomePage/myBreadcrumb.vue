<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/Home' }" key="home">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in path" :key="item">{{ item }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "my-breadcrumb",
  props:{
    path: Array
  }
}
</script>

<style scoped>

</style>
