<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="spu名称">
        <el-input placeholder="请输入spu名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select placeholder="请输入品牌" v-model="spuInfo.tmId">
          <el-option 
          :label="tm.tmName"
          :value="tm.id"
         v-for="(tm) in trademarkList" :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input placeholder="请输入SPU描述" type="textarea" rows="4" v-model="spuInfo.description"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select  placeholder="还有几个没使用" v-model="unusedBaseSaleAttrIdAndName">
          <el-option 
          label=""
          v-for="(unusedBaseSaleAttr) in unusedBaseSaleAttrList" :key="unusedBaseSaleAttr.id"
          >选项</el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table border style="width: 100%; margin-top:20px">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>

          <el-table-column prop="prop" label="属性名" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="150"></el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible',false)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      category3Id: '',
      dialogImageUrl: '',
      dialogVisible: false,
      spuInfo: {
        spuName: '',
        tmId:"",
        description:"",
        spuSaleAttrList:[]
      },
      trademarkList: [],
      spuImageList: [],
      baseSaleAttrList: [],
    }
  },
  methods: {
    //要得数据需要发送四个请求
    //获取指定id的SPU信息

    async initUpdateSpuForm(spuId, category3Id) {
      this.category3Id = category3Id
      const result = await this.$API.spu.get(spuId)
      if (result.code === 200) {
        this.spuInfo = result.data
      }
      //获取对应的spu图片列表  因为图片列表数据并没有在spu详情里面，需要单独发请求
      ///admin/product/spuImageList/670
      const imageResult = await this.$API.sku.getSpuImageList(spuId)
      // console.log(this.$API.sku)
      if (imageResult.code === 200) {
        let spuImageList = imageResult.data
        //图片的数据列表保存起来，整理之后再给data当中图片列表，否则图片数据格式不对，upload没法显示
        // spuImageList.forEach((item) => {
        //   item.name = item.imgName;
        //   item.url = item.imgUrl;
       // })
        this.spuImageList = spuImageList
      }
      const trademarkResult = await this.$API.trademark.getAll()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }

      //所有的spu基础销售属性
      ///admin/product/baseSaleAttrList
      const baseSaleAttrResult = await this.$API.spu.getSaleList()
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data
      }
    },

    //有关照片墙的收集和展示
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
  },

  computed:{
    //计算输入框的值
    unusedBaseSaleAttrList(){
      this.baseSaleAttrList.split(":")   
       }
  }
}
</script>

<style scoped>
</style>
