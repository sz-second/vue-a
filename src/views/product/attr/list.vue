<template>
  <div>
    <el-card>
      <CategorySelector @handlerCategory="handlerCategory"></CategorySelector>
    </el-card>
    <el-card>
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv">添加属性</el-button>
        <el-table border :data="attrList" style="width: 100%; margin:20px 0">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>

          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>

          <el-table-column label="属性列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag
                type="success"
                v-for="(attrValue) in row.attrValueList"
                :key="attrValue.id"
              >{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="changeattr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
                @click="deleteAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowList">
        <!-- 添加属性页面 -->
        <el-form :inline="true" :model="attrForm">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrForm.attrName"
        >添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>

        <el-table :data="attrForm.attrValueList" border style="width: 100% ; margin:20px 0">
          <el-table-column align="center" type="index" label="序号" width="width"></el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值"
                v-if="row.isEdit"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              ></el-input>

              <span
                v-else
                style="display:inline-block; width:100%; height:100%"
                @click="toEdit(row,$index)"
              >{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template>
              <!-- <el-button type="primary" icon="el-icon-edit"></el-button> -->
              <el-button type="danger" icon="el-icon-delete" title="删除"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="attrForm.attrValueList.length === 0"
          @click="saveAttr"
        >保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { title } from '../../../settings'
export default {
  name: 'AttrList',

  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      isShowList: true,

      attrForm: {
        attrName: '',
        attrValueList: [],
        valueName: '',
        categoryId: '',
        categoryLevel: 3,
      },
    }
  },
  methods: {
    async saveAttr() {
      //拿到参数数据
      let attr = this.attrForm
      //整理参数数据
      // 1、如果属性当中属性值列表没有属性值对象 不发请求
     
      // 2、如果属性值没有值 那就是空串，过滤掉这个属性值对象
      // 3、去除参数中多余的参数，比如自己加的isEdit
      // if (attrForm.attrValueList.length === 0) {
      //   this.$message.warning('请输入属性值')
      // }
      // filter 过滤数组 筛选
      // 暗含循环遍历 拿每一项去和最后的条件进行运算  如果最终返回的是true，则把这一项拿出去放到新的数组当中

      attr.attrValueList = attr.attrValueList.filter((item) => {
        if (item.valueName.trim() !== '') {
          delete item.isEdit
          return true
        }
      })
 if (attr.attrValueList.length === 0);return
      //发请求
      const result = await this.$API.attr.addOrUpdate(attr)

      if (result.code === 200) {
        //成功做什么
        this.getAttrList()
        this.isShowList = true
        this.$message.success('保存属性成功')
      } else {
        //失败做什么
        this.$message.error('保存属性失败')
      }
    },

    toEdit(row, index) {
      row.isEdit = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    toLook(row) {
      if (!row.valueName) return
      const isRepeat = this.attrForm.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === row.valueName
        }
      })
      if (isRepeat) {
        this.$message.warning('属性已存在')
        return
      }
      row.isEdit = false
    },
    //点击删除
    deleteAttr(row) {
      this.$API.attr.delete(row.id).then((response) => {
        if (response.code == 200) {
          this.$message.success('删除成功')
          this.getAttrList()
        } else {
          this.$message.success('删除失败')
        }
      })
    },
    //点击修改按钮
    changeattr(row) {
      this.attrForm = cloneDeep(row)
      this.isShowList = false
      this.attrForm.attrValueList.forEach((item) => {
        this.$set(item, 'isEdit', false)
      })
    },
    //点击添加按钮
    addAttrValue() {
      this.attrForm.attrValueList.push({
        id: '',
        attrId: this.attrForm.id,
        isEdit: true,
        valueName: '',
      })
    },
    showAddDiv() {
      this.attrForm = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      }
      this.isShowList = false
    },

    handlerCategory({ categoryId, level }) {
      //  console.log(categoryId, level)
      if (level === 1) {
        this.category1Id = categoryId
      } else if (level === 2) {
        this.category2Id = categoryId
      } else {
        this.category3Id = categoryId
        this.getAttrList()
      }
    },
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this
      
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      )
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    //添加修改
    // async addAttribute() {
    //   let attr = this.attrForm
    //   console.log(attr)
    //   const result = await this.$API.attr.addOrUpdate(attr)
    //   if (result.code === 200) {
    //     this.$message.success(`${attr.id ? '修改' : '添加'}成功`)
    //     this.isShowList = true

    //       attr.attrValueList = attr.attrValueList.filter(item => {
    //     if(item.valueName.trim() !== ''){
    //       delete item.isEdit
    //       return true
    //     }
    //   })

    //     this.getAttrList()
    //   }
    // },
  },
}
</script>
