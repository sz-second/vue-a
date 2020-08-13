import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  /*
  获取订单分页列表(带搜索)
  GET /admin/product/baseTrademark/{page}/{limit}

  */
  getPageList (page, limit) {
    return request({
      url: `${api_name}/baseTrademark/${page}/${limit}`,
      method: 'get',

    })
  },
  //POST /admin/product/baseTrademark/save
  ///admin/product/baseTrademark/update
  addOrUpdate (trademark) {
    if (trademark.id) {
      return request({
        url: `${api_name}/baseTrademark/update`,
        method: 'PUT',
        data: trademark
      })
    } else {
      return request({
        url: `${api_name}/baseTrademark/save`,
        method: 'post',
        data:trademark
      })
    }
   
  },
  ///admin/product/baseTrademark/remove/{id}
  delete (id) {
    return request({
      url: `${api_name}/baseTrademark/remove/${id}`,
      method: 'delete',
    
    })
  },
  
  getAll(){
    return request({
      url:'/admin/product/baseTrademark/getTrademarkList',
      method:'get'
    })
  }
}
