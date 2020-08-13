<template>
  <div>
    <el-card>
      <CategorySelector @handlerCategory="handlerCategory"></CategorySelector>
    </el-card>
    <el-card style="margin-top:20px">
      <div v-show="!isShowSpuForm">
        <!-- &&!isShowSkuForm" -->
        <el-button type="primary" icon="el-icon-plus" @click="showAddSpuForm">添加SPU</el-button>
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="width"></el-table-column>

          <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>

          <el-table-column prop="description" label="spu描述" width="width"></el-table-column>

          <el-table-column label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" icon="el-icon-plus" size="mini" title="输入spu" ></el-button>
              <el-button type="primary" icon="el-icon-edit" size="mini" title="修改spu" @click="showUpdateSpuForm(row.id)"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="查看所有spu"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align:center"
          background
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper, ->,  sizes, total"
          :total="total"
          @current-change="getSpuList"
        ></el-pagination>
      </div>
      <div>
        <SpuForm v-show="isShowSpuForm" 
        :visible.sync="isShowSpuForm"
         ref="spu"></SpuForm>

        <!-- <SkuForm v-show="isShowSkuForm"></SkuForm> -->
      </div>
    </el-card>
  </div>
</template>

<script>
import SpuForm from '@/views/product/components/SpuForm'
import SkuForm from '@/views/product/components/SkuForm'
export default {
  name: 'SpuList',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      spuList: [],
      page: 1,
      limit: 3,
      total: 0,
      isShowSpuForm: false,
    }
  },
  methods: {
    //点击修改按钮
  showUpdateSpuForm(spuId){
    //判断返回的标志
    this.spuId=spuId
   this .isShowSpuForm=true
   //通过ref传递categor3id
   console.log(spuId)
   this.$refs.spu.initUpdateSpuForm(spuId,this.category3Id)

  },
//点击添加
    showAddSpuForm() {
      this.isShowSpuForm = true
    },
    handlerCategory({ categoryId, level }) {
      // console.log(categoryId, level)
      if (level === 1) {
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []

        this.category1Id = categoryId
      } else if (level === 2) {
        this.category3Id = ''
        this.spuList = []

        this.category2Id = categoryId
      } else {
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    async getSpuList(page = 1) {
      this.page = page
      const result = await this.$API.spu.getList(
        this.page,
        this.limit,
        this.category3Id
        // console.log(page,limit,total)
      )
      if (result.code === 200) {
        let { records, total } = result.data
        this.spuList = records
        this.total = total
      }
    },
  },
  components: {
    SpuForm,
    SkuForm,
  },
}
</script>
