import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  /*
  /admin/product/getCategory1
getCategory1

GET /admin/product/getCategory2/{category1Id}
getCategory2

GET /admin/product/getCategory3/{category2Id}
getCategory3
GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
attrInfoList



  */
  getList (category1Id, category2Id, category3Id) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: 'get',

    })
  },
  //POST /admin/product/baseTrademark/save
  ///admin/product/baseTrademark/update
  // / admin / product / saveAttrInfo
  addOrUpdate (attr) {
      return request({
        url: `${api_name}/saveAttrInfo`,
        method: 'post',
        data: attr
      })
    

  },
  ///admin/product/baseTrademark/remove/{id}
  delete (id) {
    return request({
      url: `${api_name}/deleteAttr/${id}`,
      method: 'delete',

    })
  }
}
