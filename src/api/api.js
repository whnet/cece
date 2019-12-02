import ajax from '../libs/ajax'


// 关于老师的相关接口
const teacherbandan = (params) => { return ajax.get(`/teacher/`, params) }
const teacher = (params) => { return ajax.get(`/teacher/`, params) }
const teacherDetail = (id) => { return ajax.get(`/teacher/${id}` + '/') }
const updateInfo = (id) => { return ajax.get(`/updateteacher/`) }
const addOrUpdateTeacher = (params, id) => {
  if(id){
    return ajax.patch(`/updateteacher/${id}/`, params)
  }else{
    return ajax.post(`/updateteacher/`, params)
  }
}
const catogary = () => { return ajax.get(`/catogary/`) }

// 广告接口
const advertisement = (params) => { return ajax.get(`/advertisement/`, { params: params }) }
// 积分接口
const jifen = (type, data) => {
  if(type == 'post' && data ){
    return ajax.post(`/jifen/`, data)
  }else{
    return ajax.get(`/jifen/`, { params: data })
  }
}
// 收入接口
const income = (type, data) => {
  if(type == 'post' && data ){
    return ajax.post(`/income/`, data)
  }else{
    return ajax.get(`/income/`, { params: data })
  }
}
//服务项目，更新及删除操作
const service = (data, type, id) => {
  if(type == 'post' && data ){
    return ajax.post(`/service/`, data)
  }else if(type == 'delete' && id){
    return ajax.delete(`/service/${id}/`)
  }else if(type == 'put' && id && data){
    return ajax.put(`/service/${id}/`, data)
  }else{
    return ajax.get(`/service/`, { params: data })
  }
}
//逛一逛,闪测接口
const shop = (params) => { return ajax.get(`/shop/`, { params: params }) }
const shopDetail = (shopId) => { return ajax.get(`/shop/${shopId}` + '/') }
const shoptags = () => { return ajax.get(`/shoptags/?status=1`) }
const project = (data, type, id) => {
  if(type == 'post' && data ){
    return ajax.post(`/shop/`, data)
  }else if(type == 'delete' && id){
    return ajax.delete(`/shop/${id}/`)
  }else if(type == 'put' && id && data){
    return ajax.put(`/shop/${id}/`, data)
  }else{
    return ajax.get(`/shop/`, { params: data })
  }
}

//订单接口
const orders = (params) => { return ajax.get(`/orders/`, { params: params }) }
const ciciouuml = (id) => { return ajax.get(`/ciciouuml/${id}/`) }
const orderdetail = (id) => { return ajax.get(`/orders/${id}/`) }
const order = (params, id) => {  return ajax.patch(`/orders/${id}/`, params) }

//注册、登录接口
const register = (params) => { return ajax.post(`/register/`, params) }
const login = (params) => { return ajax.post(`/login/`, params) }

// 想查询指定用户的ID 更新用户信息
const userInfo = (id) => { return ajax.get(`/users/${id}/`) }
const updateUserInfo = (id, params) => { return ajax.put(`/users/${id}/`, params) }
const ziliao = (id) =>{return ajax.get(`/ziliao/${id}`)} //单独写一个获取个人信息

const wechatAuth = () => { return ajax.get(`/auth/`) }
const wechatInfo = (params) => { return ajax.get(`/info/`, { params: params }) }

// 聊天内容的获取
const getChat = (id) => { return ajax.get(`/chat/${id}` + '/') }
const sendChat = (id, params) => { return ajax.put(`/chat/${id}` + `/`, params) }

// 微信支付
const wechatpay = (params) => { return ajax.post(`/wechatpay/`, params) }

// jssdk
const jssdk = (params) => {return ajax.post(`/jssdk/`,params)}
// 推广信息
const share = () => {return ajax.get(`/share/`)}
const shareorder = () => {return ajax.get(`/shareorder/`)}

// 融云token POST 方式 参数：userId 、userName 、avatar
const rongyun = (params) => { return ajax.post(`/rongyun/`, params) }
const downrongyun = (params) => { return ajax.post(`/downrongyun/`, params) }
const chatlogs = (id,params) => { return ajax.put(`/chatlogs/${id}/`, params) }
// 生成七牛云的token
const qiniu = (params) => { return ajax.post(`/qiniu/`, params) }

// 文件上传接口，可以考虑把图片上传迁移到七牛云上
const upload = (params) => { return ajax.post(`/upload/`, params)}
const upg = (params) => { return ajax.post(`/upg/`, params)}

// 提交订单评论
const comment = (id, params) => { return ajax.put(`/comments/${id}` + `/`, params) }
//获得评论
const comments = (id,type,all=0) => {
  if(id && type){
    return ajax.get(`/comments/?${type}=${id}&type=${type}&all=${all}`)
  }else{
    return ajax.get(`/comments/`)
  }
}
// 感谢
const ganxie = (params) => { return ajax.post(`/ganxie/`, params) }
const ganxieStatus = (tid,mid,oid) => { return ajax.get(`/ganxie/?tid=${tid}&mid=${mid}&oid=${oid}`,) }
//微信公众号通知
const notifyWechat = (params) =>{ return ajax.post(`/notifyWechat/`, params) }
// 资金管理:退款、打款
const tuikuan = () =>{ return ajax.get(`/tuikuan/`)}
const dakuan = () =>{ return ajax.get(`/dakuan/`)}
const withdraw= (params) =>{ return ajax.post(`/withdraw/`, params)}
const havewithdraw= () =>{ return ajax.get(`/withdraw/`)}

const List = {
  teacher,
  teacherbandan,
  updateInfo,
  addOrUpdateTeacher,
  teacherDetail,
  catogary,
  advertisement,
  shop,
  shoptags,
  shopDetail,
  order,
  orders,
  orderdetail,
  register,
  login,
  userInfo,
  wechatAuth,
  wechatInfo,
  getChat,
  sendChat,
  wechatpay,
  rongyun,
  qiniu,
  service,
  updateUserInfo,
  comment,
  comments,
  ganxie,
  ganxieStatus,
  upload,
  upg,
  jssdk,
  share,
  shareorder,
  project,
  jifen,
  income,
  ziliao,
  notifyWechat,
  tuikuan,
  dakuan,
  withdraw,
  havewithdraw,
  downrongyun,
  chatlogs,
  ciciouuml
}

export default List
