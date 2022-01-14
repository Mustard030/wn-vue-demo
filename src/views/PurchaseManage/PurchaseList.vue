<template>
  <div style="height: 100%;">
    <el-card style="height: 100%">
      <div slot="header">
        <span>采购合同信息</span>
      </div>
      <div class="main-container">
        <!--搜索区-->
        <div class="search-box">
          <el-form label-position="right" label-width="90px">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="合同名称：">
                  <el-input v-model="queryForm.name" size="mini" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同编号：">
                  <el-input v-model="queryForm.code" size="mini" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="供应商：">
                  <el-select v-model="queryForm.supplier" filterable clearable placeholder="请选择" size="mini">
                    <el-option
                        v-for="item in supplierList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        size="mini">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-checkbox v-model="queryForm.executing" size="mini" class="purbox">只显示执行中的合同</el-checkbox>
              </el-col>
            </el-row>
            <div class="second-row">
              <el-row :gutter="20">
                <el-col :span="13">
                  <el-form-item label="签订日期从:">
                    <el-date-picker
                        v-model="queryForm.dateRange"
                        clearable
                        type="daterange"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        size="mini">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="3">
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="query" size="mini">查询</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-circle-plus" @click="addPurchase" size="mini">新增</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
        <!--表单区域-->
        <div class="table-box">
          <el-table :data="tableData" border height="60vh"
                    :header-cell-style="{textAlign:'center',background:'#F3F4F7',color:'#555'}"
                    :row-style="{height: '40px'}"
                    :cell-style="{padding: '0'}">
            <el-table-column label="序号" prop="index" width="50px" fixed align="center"></el-table-column>
            <af-table-column label="合同名称" prop="name" show-overflow-tooltip fixed>
              <template v-slot="scope">
                <el-link @click="detailPurchase(scope.row.contract_id)">{{ scope.row.name }}</el-link>
              </template>
            </af-table-column>
            <el-table-column label="合同编号" prop="id" show-overflow-tooltip fixed></el-table-column>
            <el-table-column label="供应商" prop="supplier" show-overflow-tooltip fixed></el-table-column>
            <el-table-column label="签订日期" prop="date" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="签订地点" prop="place" show-overflow-tooltip></el-table-column>
            <el-table-column label="合同金额" prop="money" width="80px" show-overflow-tooltip></el-table-column>
            <el-table-column label="合同状态" prop="state" width="80px" show-overflow-tooltip></el-table-column>
            <el-table-column label="备注" prop="remarks" width="150px" show-overflow-tooltip></el-table-column>
            <el-table-column label="合同附件" prop="appendix" width="80px" show-overflow-tooltip align="center">
              <template v-slot="scope">
                <el-button icon="el-icon-document" size="mini" type="primary"
                           @click="appendixDialog(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180px" fixed="right" align="center">
              <template v-slot="scope">
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="更改"
                    placement="top"
                    :enterable="false"
                >
                  <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="editPurchase(scope.row.contract_id)"
                  />
                </el-tooltip>

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
                      size="mini"
                      @click="deletePurchase(scope.row.contract_id)"
                  />
                </el-tooltip>


                <el-tooltip
                    class="item"
                    effect="dark"
                    content="终止"
                    placement="top"
                    :enterable="false"
                >
                  <el-button
                      type="danger"
                      icon="el-icon-switch-button"
                      size="mini"
                      @click="stopPurchase(scope.row.contract_id)"
                  />
                </el-tooltip>

              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页区域-->
        <div class="page-box">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryForm.pagenum"
              :page-sizes="[20, 40, 60, 80, 100]"
              :page-size="queryForm.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
          />
        </div>
      </div>
    </el-card>

    <!--  弹窗区域  -->
    <el-dialog title="合同附件列表" :visible.sync="appendixDialogVisible" :close-on-click-modal="false">
    </el-dialog>
    <el-dialog title="新增采购合同" :visible.sync="addPurchaseDialogVisible" :close-on-click-modal="false"
               customClass="customWidthwide">
      <div class="scroll">
        <el-scrollbar class="scrollbar">
          <el-form :model="addPurchaseForm" ref="addPurchaseFormRefs" :rules="formRules" label-position="right"
                   label-width="90px" size="mini">
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>合同基础信息</span></div>
            <el-row :gutter="20">
              <el-col :span="15">
                <el-form-item label="合同名称:" prop="name">
                  <el-input v-model="addPurchaseForm.name" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同编号:" prop="code">
                  <el-input v-model="addPurchaseForm.code" clearable/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="供应商:" prop="supplier">
                  <el-select filterable clearable v-model="addPurchaseForm.supplier">
                    <el-option
                        v-for="item in supplierList"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="签订日期:">
                  <el-date-picker
                      v-model="addPurchaseForm.date"
                      clearable
                      type="date"
                      placeholder="签订日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="签订地点:">
                  <el-input v-model="addPurchaseForm.place" clearable/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="备注:">
                  <el-input
                      v-model="addPurchaseForm.remarks"
                      type="textarea"
                      autosize
                      clearable
                      placeholder="请输入备注内容">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="附件:">
              <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <!--                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </el-form-item>
            <el-divider/>
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>物资明细</span>
              <el-button style="margin-left:30px" size="mini" @click="addMaterial">添加物资</el-button>
              <span style="float:right;margin-right: 50px">总金额: {{ addPurchaseForm.totalMoney }}</span>
            </div>
            <div>
              <el-table :data="addPurchaseForm.detail" border
                        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                        :row-style="{height: '40px'}"
                        :cell-style="{padding: '0'}">
                <el-table-column label="序号" prop="index" width="50px" type="index" :index="indexMethod" align="center"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="物资名称" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="代号" prop="code" width="80px" show-overflow-tooltip></el-table-column>
                <el-table-column label="规格型号" prop="standards" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="执行标准" prop="exe_standard" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="单位" prop="unit" width="60px" align="center" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{ unitName(scope.row.unit) }}
                  </template>
                </el-table-column>
                <el-table-column label="数量" prop="num" width="60px" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="单价" prop="price" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="金额" prop="totalPrice" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="remarks" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="100px">
                  <template v-slot="scope">
                    <el-button type="text">更改</el-button>
                    <el-button type="text">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddPurchase">确 定</el-button>
        <el-button @click="cancelAddPurchase">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改采购合同" :visible.sync="editPurchaseDialogVisible" :close-on-click-modal="false"
               customClass="customWidthwide">
      <div class="scroll">
        <el-scrollbar>
          <el-form label-position="right" label-width="90px" size="mini" ref="editForm" :rules="formRules">
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>合同基础信息</span></div>
            <el-row :gutter="20">
              <el-col :span="15">
                <el-form-item label="合同名称:" prop="name">
                  <el-input v-model="editPurchaseForm.name"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同编号:" prop="code">
                  <el-input v-model="editPurchaseForm.code"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="供应商:" prop="supplier">
                  <el-select filterable clearable v-model="editPurchaseForm.supplier">
                    <el-option
                        v-for="item in supplierList"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="签订日期:" prop="date">
                  <el-date-picker
                      v-model="editPurchaseForm.date"
                      type="date"
                      placeholder="签订日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="签订地点:" prop="place">
                  <el-input v-model="editPurchaseForm.place"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="23">
                <el-form-item label="备注:" prop="remarks">
                  <el-input
                      v-model="editPurchaseForm.remarks"
                      type="textarea"
                      autosize
                      placeholder="请输入备注内容"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="附件:">
              <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <!--                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </el-form-item>
            <el-divider/>
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>物资明细</span>
              <el-button style="margin-left:30px" size="mini">添加物资</el-button>
              <span style="float:right;margin-right: 50px">总金额: </span><el-input v-model="editPurchaseForm.totalMoney" :value="purchaseTotalPrice"></el-input>
            </div>
            <div>
              <el-table :data="editPurchaseForm.detail" border
                        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                        :row-style="{height: '40px'}"
                        :cell-style="{padding: '0'}">
                <el-table-column label="序号" prop="date" width="80px" show-overflow-tooltip></el-table-column>
                <el-table-column label="物资名称" prop="date" show-overflow-tooltip></el-table-column>
                <el-table-column label="代号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="规格型号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="执行标准" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="单位" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="数量" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="单价" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="金额" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" prop="date" width="100px" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPurchaseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditPurchase">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看合同详情" :visible.sync="detailPurchaseDialogVisible" :close-on-click-modal="false"
               customClass="customWidthwide">
      <div class="scroll">
        <el-scrollbar>
          <el-form label-position="right" label-width="90px" size="mini">
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>合同基础信息</span></div>
            <el-form-item label="合同名称:">
              <span>{{ detailPurchaseForm.name }}</span>
            </el-form-item>
            <el-form-item label="合同编号:">
              <span>{{ detailPurchaseForm.code }}</span>
            </el-form-item>
            <!--            <el-form-item label="供应商:">-->
            <!--              <span></span>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="签订日期:">-->
            <!--              <span></span>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="签订地点:">-->
            <!--              <span></span>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="备注:">-->
            <!--              <span></span>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="附件:">-->
            <!--              <span></span>-->
            <!--            </el-form-item>-->
            <el-divider/>
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>物资明细</span></div>
            <div>
              <el-table :data="detailPurchaseForm.detail" border
                        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                        :row-style="{height: '40px'}"
                        :cell-style="{padding: '0'}">
                <el-table-column label="序号" prop="date" width="40px" align="center"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="物资名称" prop="date" show-overflow-tooltip></el-table-column>
                <el-table-column label="代号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="规格型号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="执行标准" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="单位" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="数量" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="单价" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="已送货数量" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="金额" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="date" width="100px" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
            <el-divider/>
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>送货明细</span></div>
            <div>
              <el-table :data="detailPurchaseForm.deliver" border
                        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                        :row-style="{height: '40px'}"
                        :cell-style="{padding: '0'}">
                <el-table-column label="序号" prop="date" width="40px" align="center"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="入库日期" prop="date" show-overflow-tooltip></el-table-column>
                <el-table-column label="物资名称" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="代号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="规格型号" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="单位" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="入库数量" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="库管员" prop="date" width="100px" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
            <el-divider/>
            <div style="margin-bottom: 20px"><span style="color:red">*</span><span>发票明细</span></div>
            <div>
              <el-table :data="detailPurchaseForm.invoice" border
                        :header-cell-style="{background:'#F3F4F7',color:'#555'}"
                        :row-style="{height: '40px'}"
                        :cell-style="{padding: '0'}">
                <el-table-column label="序号" prop="date" width="40px" align="center"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="发票代码" prop="date" show-overflow-tooltip></el-table-column>
                <el-table-column label="发票号码" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="开票日期" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="金额" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="date" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="发票图片" prop="date" width="100px" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </el-form>
        </el-scrollbar>
      </div>
    </el-dialog>


    <el-dialog title="添加物资" :visible.sync="addMaterialDialogVisible" :close-on-click-modal="false">
      <el-form :model="addMaterialForm" label-position="right" label-width="90px" size="mini" ref="addMaterialFormRefs"
               :rules="materialFormRules">
        <el-row>
          <el-col :span="15">
            <el-form-item label="物资名称" prop="name">
              <el-input v-model="addMaterialForm.name" @change="searchCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代号" prop="code">
              <el-select v-model="addMaterialForm.code" @change="fillOtherInfo" filterable clearable>
                <el-option
                    v-for="item in codeList"
                    :key="item.code"
                    :label="item.code"
                    :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="规格型号" prop="standards">
              <el-input v-model="addMaterialForm.standards"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="执行标准" prop="exe_standard">
              <el-input v-model="addMaterialForm.exe_standard"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="addMaterialForm.unit" filterable clearable size="mini">
                <el-option
                    v-for="item in unitList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="数量" prop="num">
              <el-input v-model.number="addMaterialForm.num"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价" prop="price">
              <el-input v-model.number="addMaterialForm.price"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额" prop="totalPrice">
              <el-input v-model.number="addMaterialForm.totalPrice" :value="oneMaterialTotalPrice" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="备注:">
              <el-input
                  v-model="addMaterialForm.remarks"
                  type="textarea"
                  autosize
                  clearable
                  placeholder="请输入备注内容">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddMaterial">确 定</el-button>
        <el-button @click="cancelAddMaterial">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改物资" :visible.sync="editMaterialDialogVisible" :close-on-click-modal="false">
      <el-form :model="editMaterialForm" ref="editMaterialForm" :rules="materialFormRules" label-position="right" label-width="90px" size="mini">
        <el-row>
          <el-col :span="15">
            <el-form-item label="物资名称" prop="name">
              <el-input v-model="editMaterialForm.name" @change="searchCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代号" prop="code">
              <el-select v-model="editMaterialForm.code" @change="fillOtherInfo" filterable clearable>
                <el-option
                    v-for="item in codeList"
                    :key="item.code"
                    :label="item.code"
                    :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="规格型号" prop="standards">
              <el-input v-model="editMaterialForm.standards"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="执行标准" prop="exe_standard">
              <el-input v-model="editMaterialForm.exe_standard"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="editMaterialForm.unit" filterable clearable size="mini">
                <el-option
                    v-for="item in unitList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="数量" prop="num">
              <el-input v-model.number="editMaterialForm.num"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价" prop="price">
              <el-input v-model.number="editMaterialForm.price"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额" prop="totalPrice">
              <el-input v-model.number="editMaterialForm.totalPrice" :value="oneMaterialTotalPrice" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="备注:">
              <el-input
                  v-model="editMaterialForm.remarks"
                  type="textarea"
                  autosize
                  clearable
                  placeholder="请输入备注内容">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditMaterial">确 定</el-button>
        <el-button @click="editMaterialDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PurchaseList",
  data() {
    return {
      // 表单
      queryForm: {
        supplier: "", // 供应商
        code: "", // 合同编号
        name: "", // 合同名称
        dateRange: [], // 日期范围
        executing: false, // 只显示执行中的合同
        pagenum: 1, // 页数
        pagesize: 20, // 每页大小
      }, // 查询表单
      addPurchaseForm: {
        name: null,
        code: null,
        date: null,
        place: null,
        supplier: null,
        remarks: null,
        appendix: [],
        detail: [],
        totalMoney: 0,// 总金额
      },// 添加合同表单
      editPurchaseForm: {
        name: null,
        code: null,
        date: null,
        place: null,
        supplier: null,
        remarks: null,
        appendix: [],
        detail: [],
      },//修改合同表单
      detailPurchaseForm: {
        name: null,
        code: null,
        supplier: null,
        detail: [],
        deliver: [],
        invoice: [],
      },//合同详情表单
      addMaterialForm: {
        name: null,
        code: null,
        standards: null,
        exe_standard: null,
        unit: null,
        num: null,
        price: null,
        totalPrice: null,
        remarks:null,
      }, // 添加物资表单
      editMaterialForm: {
        name: null,
        code: null,
        standards: null,
        exe_standard: null,
        unit: null,
        num: null,
        price: null,
        totalPrice: null,
        remarks:null,
      }, // 修改物资表单
      // 信息
      codeList: [],// 添加物资时根据名称返回的代号及其他信息列表
      unitList: [],// 单位表
      supplierList: [
        {name: "123"},
        {name: "123456"}
      ],// 供应商列表
      tableData: [],// 主体数据
      total: 0,  // 表格数据条数
      // 表单规则
      formRules: {
        name: [{required: true, message: '请填写名称', trigger: 'blur'}],
        code: [{required: true, message: '请填写编号', trigger: 'blur'}],
        supplier: [{required: true, message: '请选择供应商', trigger: 'blur'}],
      },// 表单规则
      materialFormRules: {}, // 物资表单规则
      // 杂项
      appendixDialogVisible: false,  // 附件弹窗显示
      addPurchaseDialogVisible: false,  // 新增合同弹窗显示
      editPurchaseDialogVisible: false,  // 编辑合同弹窗显示
      detailPurchaseDialogVisible: false,  // 合同详情弹窗显示
      addMaterialDialogVisible: false,  // 添加物资
      editMaterialDialogVisible: false,  // 修改物资
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  created() {
    this.getPurchaseList()
    this.getSuppliers()
    this.getUnitList()
  },
  mounted() {
  },

  methods: {
    // 点击查询按钮
    async query() {
      this.queryForm.pagenum = 1
      await this.getPurchaseList()
    },
    // 查询合同列表
    async getPurchaseList() {
      let queryForm = {...this.queryForm, action: 'list_contract_filter'}
      const {data: res} = await this.$http.get('purchase/contract/', {params: queryForm})
      res.retlist.forEach((item, index) => {
        item['index'] = index + 1
      })
      this.tableData = res.retlist
      this.total = res.total
    },
    // 更改页大小
    async handleSizeChange(pageSize) {
      this.queryForm.pagesize = pageSize
      await this.getPurchaseList()
    },
    // 更改页数
    async handleCurrentChange(currentPage) {
      this.queryForm.pagenum = currentPage
      await this.getPurchaseList()
    },
    // 查看合同附件
    appendixDialog(row) {
      this.appendixDialogVisible = true
    },
    // 新增采购合同
    addPurchase() {
      this.addPurchaseDialogVisible = true
    },
    // 取消新增合同
    cancelAddPurchase() {
      this.addPurchaseDialogVisible = false
      this.$refs.addPurchaseFormRefs.resetFields()
    },
    // 提交新增合同
    submitAddPurchase() {
    },
    // 采购合同详细信息
    async detailPurchase(contract_id) {
      const {data: res} = await this.$http.get('purchase/contract/', {
        params: {
          action: 'list_contract_detail',
          id: contract_id
        }
      })
      console.log(res)
      this.detailPurchaseDialogVisible = true
    },
    // 编辑采购合同
    editPurchase(contract_id) {
      this.editPurchaseDialogVisible = true
    },
    // 提交修改合同
    submitEditPurchase() {
    },
    // 删除采购合同
    deletePurchase(contract_id) {
    },
    // 终止采购合同
    stopPurchase(contract_id) {
    },
    // 查询供应商
    async getSuppliers() {
      const {data: res} = await this.$http.get('company/supplier/')
      if (res.ret === 0) {
        this.supplierList = res.retlist
      } else {
        this.$message.error("查询不到供应商")
      }
    },
    // 添加物资
    addMaterial() {
      this.addMaterialDialogVisible = true
    },
    // 提交添加物资
    submitAddMaterial() {
      this.addMaterialDialogVisible = false
      this.addPurchaseForm.detail.push({...this.addMaterialForm})
      this.addPurchaseForm.totalMoney = this.purchaseTotalPrice(this.addPurchaseForm)
      this.$refs.addMaterialFormRefs.resetFields()
    },
    // 取消添加物资
    cancelAddMaterial() {
      this.addMaterialDialogVisible = false
      this.$refs.addMaterialFormRefs.resetFields()
    },
    // 修改物资
    editMaterial() {

    },
    // 提交修改物资
    submitEditMaterial() {
      this.editPurchaseForm.totalMoney = this.purchaseTotalPrice(this.editPurchaseForm)
    },
    // 删除物资
    deleteMaterial() {
    },
    // 获取单位列表
    async getUnitList() {
      const {data: res} = await this.$http.get('material/mater_mg/', {params: {action: 'list_unit'}})
      if (res.ret === 0) {
        this.unitList = res.retlist
      } else {
        this.$message.error("获取不到单位")
      }
    },
    // 输入物资名称搜索代号
    searchCode() {
    },
    // 根据选择代号填入其他信息
    fillOtherInfo() {
    },
    // 获取序号
    indexMethod(index) {
      return index + 1;
    },
    // 合同物资总金额
    purchaseTotalPrice(form){
      let arrnum = []
      for(let item of form.detail){
        arrnum.push(item.totalPrice)
      }
      return arrnum.reduce((prev, cur, index, arr) => {
        return prev + cur
      }, 0)
    },
  },
  computed: {
    // 单个物资总金额
    oneMaterialTotalPrice() {
      this.addMaterialForm.totalPrice = this.addMaterialForm.num * this.addMaterialForm.price
    },

    // 单位id名称转换
    unitName() {
      return function (unitID) {
        for (let item of this.unitList) {
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
.second-row {
  display: flex;
}

.main-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.table-box {
  height: 100%;
}

.main-container {
  display: flex;
  flex-direction: column;
}

.search-box .el-form .el-row .el-col {
  height: 40px;
}

.card-body {
  flex: 1;
  overflow: auto;
  min-height: 0;
}

.scroll {
  height: 550px;
}

.el-scrollbar {
  height: 100%;
}

.el-select {
  width: 100%;
}

.purbox {
  margin-top: 10px;
  margin-left: 10px;
}
</style>
<style>
.customWidthwide {
  width: 1200px;
}

/*签订日期宽度*/
.el-date-editor .el-input__inner {
  width: 230px;
}

.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
