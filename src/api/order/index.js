import request from '@/utils/request'

// const api_name = '/admin/order'

export default {
  /*
  获取订单分页列表(带搜索)
  */
  getPageList(page, limit) {
    return request({
      url: `/dev-api/admin/order/${page}/${limit}`,
      method: 'get',
  
    })
  }
}
