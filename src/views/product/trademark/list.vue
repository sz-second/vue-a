<template>
  <div>
    <el-button type="success" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
    <el-table border stripe :data="trademarkList" style="width: 100% ;margin:20px 0">
      <el-table-column align="center" label="序号" type="index" width="80"></el-table-column>

      <el-table-column prop="tmName" label="品牌" width="width"></el-table-column>

      <el-table-column label="品牌LoGo" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" style="height:80px;" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
          >删除</el-button>
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
      @current-change="getPageList"
    ></el-pagination>

    <!-- <el-button type="text" @click="dialogFormVisible = true">添加</el-button> -->

    <el-dialog title="收货地址" :visible.sync="isShowDialog">
      <el-form :model="form">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LoGo" :label-width="formLabelWidth">
          <!-- <el-select v-model="form.region" placeholder="请选择活动区域"> -->
          <!-- <el-option label="区域一" value="shanghai"></el-option> -->
          <!-- <el-option label="区域二" value="beijing"></el-option> -->
          <!-- </el-select> -->

          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrupdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      formLabelWidth: '100px',
      isShowDialog: false,
      form: {
        tmName: '',
        logoUrl: '', //上传成功收集返回的图片路径 并且在页面上进行展示
      },
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    async getPageList(page = 1) {
      this.page = page
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      )
      if (result.code === 200) {
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    },
    showAddDialog() {
      this.form = {
        tmName: '',
        logoUrl: '',
      }
      this.isShowDialog = true
    },
    showUpdateDialog(trademark) {
      this.form = { ...trademark }
      this.isShowDialog = true
    },

    handleLogoSuccess(res, file) {
      this.form.logoUrl = res.data
    },
    beforeLogoUpload(file) {
      const typeArr = ['image/jpeg', 'image/png']
      const isJPGOrpng = typeArr.indexOf(file.type) !== -1
      const isLt500k = file.size / 1024 < 500

      if (!isJPGOrpng) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt500k) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPGOrpng && isLt500k
    },
    async addOrupdateTrademark() {
      const trademark = this.form

      const result = await this.$API.trademark.addOrUpdate(trademark)
      if (result.code === 200) {
        this.$message.success(`${trademark.id ? '添加' : '修改'}成功`)
        this.getPageList(trademark.id ? this.page : 1)
        this.isShowDialog = false
      } else {
        this.$message.error(`${trademark.id ? '添加' : '修改'}失败`)
      }
    },
    deleteTrademark(trademark) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const result = await this.$API.trademark.delete(trademark.id)
          if (result.code === 200) {
            this.$message.success('删除成功')
            this.getPageList(
              this.trademarkList.length ? this.page : this.page - 1
            )
          }else{
             this.$message.success('删除失败')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
