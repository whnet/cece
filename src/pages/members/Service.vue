<template>
  <div class="ui-page-group">
            <div class="tag_box ui-cell-noborder"  id="header">
              <div class="tag_title">服务项目，点击 + 号新增项目</div>
              <div class="ui-cell-noborder ui-cell-primary">
                <div class="add" @click="addService()"><i class="iconfont icon-bangbangce-zengjia"></i></div>
              </div>
            </div>
              <ul class="tag_list" :style="{'height': msgContent}" id="all">
                <li class="list-li" v-for="(item, i) in service" :key="i" v-if="service.length">
                  <div>
                    <div class="title-price">
                      <flexbox>
                        <flexbox-item :span="8"> <input  class="title" type="text" placeholder="项目名称" v-model="item.title"></flexbox-item>
                        <flexbox-item><input class="price" type="tel" placeholder="价格" v-model.number="item.price"></flexbox-item>
                      </flexbox>
                    </div>
                    <div>
                      <div class="item-des" v-model="item.des">{{item.des}}</div>
                    </div>
                  </div>
                  <div class="handle"  v-if="item.sort > 1">
                    <flexbox>
                      <flexbox-item :span="1/3">
                        <div class="oph" @click="editProject(item.title, item.price, item.des, item.id, item.cover, item.big)">编辑</div>
                      </flexbox-item>
                      <flexbox-item :span="1/3">
                        <div class="oph" style="color:#848486">已设置套餐</div>
                      </flexbox-item :span="1/3">
                      <flexbox-item>
                        <div class="oph" @click="queryDelService(item.id)">删除</div>
                      </flexbox-item>
                    </flexbox>
                  </div>
                  <div class="handle"  v-else>
                    <flexbox>
                      <flexbox-item :span="1/3">
                        <div class="oph" @click="editProject(item.title, item.price, item.des, item.id, item.cover, item.big)">编辑</div>
                      </flexbox-item>
                      <flexbox-item :span="1/3">
                        <div class="oph" @click="taocan(item.title, item.id)">套餐</div>
                      </flexbox-item :span="1/3">
                      <flexbox-item>
                        <div class="oph" @click="queryDelService(item.id)">删除 </div>
                      </flexbox-item>
                    </flexbox>
                  </div>
                </li>
                <div id="loadMore"></div>
              </ul>
      <!--页面内容结束-->
    <!--新增弹出框-->
    <div :style="{ display: addProjectInfo }">
      <div class="fade"></div>
      <div class="succ-pop">
        <p class="tctitle">新增项目</p>
        <div class="content">
          <label class="titles">名称</label>
          <input class="tc_ingput project"  type="text" v-model="addTitle" placeholder="名称">
          <label class="titles">价格</label>
          <input class="tc_ingput price"  type="text" v-model="addPrice" placeholder="价格">
          <label class="titles">介绍</label>
          <textarea class="tc_ingput project-detail" maxlength="300"
                    v-model="addDetail" placeholder="介绍，最多300个字">
          </textarea>
        </div>
        <div class="button">
          <span class="cancel" @click="cancelAddProject()">取消</span>
          <span class="query" @click="queryAddProject()">确认</span>
        </div>
      </div>
    </div>
    <!--新增弹出框 END-->
    <!--修改弹出框-->
    <div :style="{ display: editProjectInfo }">
      <div class="fade"></div>
      <div class="succ-pop">
        <p class="tctitle">编辑项目</p>
        <div class="content">
          <label class="titles">名称</label>
          <input class="tc_ingput project"  type="text" v-model="editTitle" placeholder="名称">
          <label class="titles">价格</label>
          <input class="tc_ingput price"  type="text" v-model="editPrice" placeholder="价格">
          <label class="titles">介绍</label>
          <textarea class="tc_ingput project-detail" maxlength="300" v-model="editDetail"
                    placeholder="介绍，最多300个字">

          </textarea>
        </div>
        <div class="button">
          <span class="cancel" @click="cancelProject()">取消</span>
          <span class="query" @click="queryProject()">确认</span>
        </div>
      </div>
    </div>
    <!--修改弹出框END-->
    <!--设置套餐-->
    <div :style="{ display: display }">
      <div class="fade"></div>
      <div class="succ-pop">
        <div class="content">
          <p class="tctitle">设置套餐</p>
          <span class="tips">默认为三次打包</span>
          <input class="tc_ingput price"  type="text" maxlength="5" v-model="tcPrice" placeholder="套餐价格" >
          <input class="tc_ingput" type="text" maxlength="300" v-model="tcDes" placeholder="套餐介绍">
        </div>
        <div class="button">
          <span class="cancel" @click="cancel()">取消</span>
          <span class="query" @click="query()">确认</span>
        </div>
      </div>
    </div>
    <!--设置套餐-->
    <!--删除确认框-->
    <div :style="{ display: delProjectInfo }">
      <div class="fade"></div>
      <div class="succ-pop">
        <div class="content">
          <p class="tctitle">删除项目</p>
          <div class="query-delete">是否确认删除？</div>
        </div>
        <div class="button">
          <span class="cancel" @click="CancelDelProject()">取消</span>
          <span class="query" @click="queryDelProject()">确认</span>
        </div>
      </div>
    </div>
    <!--删除确认框END-->
    <sharenone></sharenone>
  </div>
</template>

<script>
  import cookie from '../../../static/js/cookie'
  import { Flexbox, FlexboxItem, Divider, Confirm, Group, XButton, TransferDomDirective as TransferDom} from 'vux'
  export default {
    name: 'Service',
    data () {
      return {
        addProjectInfo: 'none',
        msgContent:0,
        list: [],
        service: [],
        display: 'none',
        editProjectInfo: 'none',
        content: '',
        tcPrice: '',
        tcDes: '',
        title: '',
        id:0,
        tid:0,
        listId: [],
        priceList: [],
        minprice: 0,
        addTitle:'',
        addPrice:'',
        addDetail:'',
        editTitle:'',
        editPrice:'',
        editDetail:'',
        editId:0,
        delId:0,
        delProjectInfo:'none'
      }
    },
    directives: {
      TransferDom
    },
    components: {
      XButton,
      Flexbox,
      FlexboxItem
    },
    mounted () {
      let header = document.getElementById('header').offsetHeight
      window.msgContent = document.documentElement.clientHeight
      this.msgContent = (window.msgContent - header) + 'px'
      if(cookie.getCookie('mid') == null){
        this.getWechatAuth()
      }
      this.Service()
    },
    created () {
      if(cookie.getCookie('mid') == null){
        this.getWechatAuth()
      }
      // this.Service()
    },
    methods: {
      CancelDelProject () {
        this.delProjectInfo = 'none'
      },
      queryDelService (id) {
        this.delProjectInfo = 'block';
        this.delId = id
      },
      queryDelProject(){
        this.delService(this.delId)
      },
      cancel () {
        this.display = 'none'
      },
      editProject (title,price,detail,id) {
        this.editProjectInfo = 'block'
        this.editTitle = title
        this.editPrice = price
        this.editDetail = detail
        this.editId = id
      },
      cancelProject () {
        this.editProjectInfo = 'none'
        document.body.style.position='static';
      },
      queryProject () {
        this.editService(this.editTitle, this.editPrice, this.editDetail, this.editId)
        document.body.style.position='static';
      },
      editService (title, price, des, id) {
        // 更新操作
        let type = 'put'
        let data = {
          "title": title,
          "price": price,
          "des": des,
        }
        if(price < 1){
          this.$vux.toast.text('最低价格不能小于1元1')
          return false
        }
        return this.$api.service(data, type, id).then(res => {
          this.service = this.service.concat(res.data)
          this.Service()
          this.editProjectInfo = 'none'
          this.$vux.toast.text('编辑成功')
          this.defaultSetting()
        })
      },
      query (title, price, des) {
        let type = 'post'
        let data = {
          "title": this.title+"(套餐)",
          "sort": 3,
          "price": this.tcPrice,
          "des": this.tcDes,
          "belong": this.id,
          "mid": cookie.getCookie('mid'),
          "tid": cookie.getCookie('tid'),
        }

        return this.$api.service(data, type, 0).then(res => {
          this.service = this.service.concat(res.data)
          this.$vux.toast.text('添加套餐成功')
          this.Service()
          this.display = 'none'
        }).catch(err => {
          this.$vux.toast.text('错误')
          return err
        })
      },
      canselServic (i) {
        this.list.splice(i, 1)
        this.$vux.toast.text('已取消')
      },
      addService () {
        this.addProjectInfo = 'block';
        document.body.style.position='fixed';
        document.body.style.width='100%';
        let arr = []
        this.list.unshift(arr)
      },
      getWechatAuth: function () {
        return this.$api.wechatAuth().then(res => {
          window.location.href = res.data.result
        }).catch(err => {
          return err
        })
      },
      delService (id) {
        let type = 'delete'
        return this.$api.service(0, type, id).then(res => {
          this.Service()
          this.$vux.toast.text('删除成功')
          this.delProjectInfo = 'none'
        }).catch(err => {
          this.$vux.toast.text(err)
          return err
        })
      },
      cancelAddProject () {
        this.addProjectInfo = 'none'
        document.body.style.position='static';
      },
      queryAddProject () {
        this.saveService(this.addTitle, this.addPrice, this.addDetail)
        document.body.style.position='static';
      },
      saveService (title, price, des) {
        // 新增项目
        let type = 'post'
        let data = {
          "title": title,
          "sort": 1,
          "price": price,
          "des": des,
          "belong": this.id,
          "mid": cookie.getCookie('mid'),
          "tid": cookie.getCookie('tid'),
        }
        if(price < 1){
          this.$vux.toast.text('最低价格不能小于1元2')
          return false
        }
        return this.$api.service(data, type, 0).then(res => {
          this.service = this.service.concat(res.data)
          this.Service()
          this.$vux.toast.text('新增成功')
          this.addProjectInfo = 'none'
          document.body.style.position='static';
          this.defaultSetting()
        }).catch(err => {
          this.$vux.toast.text(err)
          return err
        })
      },
      defaultSetting(){
        //初始化
        this.addTitle=''
        this.addPrice=''
        this.addDetail=''
        this.editTitle=''
        this.editPrice=''
        this.editId=0
        this.delId=0
        //初始化
      },
      Service(){
        let that = this;
        that.tid = cookie.getCookie('tid')
        layui.use('flow', function(){
          let flow = layui.flow;
          let $ = layui.jquery
            ,element = layui.element;
          flow.load({
            elem: '#all' //流加载容器
            ,isAuto:true
            ,scrollElem: '#all' //滚动条所在元素，一般不用填，此处只是演示需要。
            ,loadMore:'#loadMore'
            ,done: function(page, next){
              //todo
              that.$api.service({'page': page,'m':that.tid},0,0).then(res => {
                let result = res.data.results
                if(page == 1){
                  that.service = []
                }
                that.service = that.service.concat(result)
                next('', page < Math.ceil(res.data.count / 10 ));
              })
            }
          });
        });
      },
      Servicetest(){
        // 获得服务的列表
        let tid = cookie.getCookie('tid')
        this.tid = tid
        if(tid){
          return this.$api.service(0,0,tid).then(res => {
              let data = res.data.results
              let arr = []
              let priceList = []
              this.service = data
              for (var i=0;i<data.length;i++){
                 arr.push(Number(data[i].belong))
                 priceList.push(Number(data[i].price))
              }
              this.priceList = priceList
              this.listId = arr
              let array = priceList
              this.minprice = Math.min.apply(null, array)
              if(data.length > 0){
                // 更新成功后找到最小的价格进行更新
                let datas = {
                  "price": this.minprice,
                }
                return this.$api.addOrUpdateTeacher(datas, this.tid).then(res => {
                })
                // 更新成功后找到最小的价格进行更新END
              }
          })
        }else{
          this.$vux.toast.text('还不是老师')
        }
      },
       taocan(title, id) {
        this.tcPrice = ''
        this.tcDes = ''
        this.display = 'block'
        this.title = title
        this.id = id
      },
      findId: function (id) {
        return this.listId.indexOf(id)
      }
    },
  }
</script>

<style scoped>
  @import '../../../static/bc/css/etui.css';
  @import '../../../static/bc/css/common.css';
  @import '../../../static/bc/css/edit_birthdate.css';
  .title{
    width:100%;
  }
  .success{
    color:#1EADAD;
  }
  .forbid{
    color: grey;
  },
  .tc {
    color: #848486;
  }
  li.ui-cell-noborder{
    height:140px;
    margin-bottom: 10px;
    background: #fff;
  }
  .option{
    margin:0;
    padding:0;
    position: absolute;
    top: 100px;
    width:100%;
    left:0;
    display: inherit;
    border-top: 1px solid #f2f2f2;
  }
  .project-title{
    position:absolute;
    top:0;
    left: 0%;
  }
  .project-price{
    position:absolute;
    top:0;
    left: 50%;
  }
  .nomessage{
    padding:50% 0;
    text-align: center;
  }
  .mb10 {
    margin-bottom: 4.5rem;
  }
  .price{
    width:100%;
  }
  .edit{
    border-radius: 0px;
    border:none;
  }
  .two{
    width:50%;
  }
  .three{
    width:33%;
  }
  .add{
    width:50%;
  }
  .input-detail{
    width:100%;
    border:none;
  }
  .detail{
    width: 100%;
    position: absolute;
    top: 36px;
    left: 0;
    padding: 0 10px;
    border-top: 1px solid #f2f2f2;
  }
  .tag_ingput{
    border:none;
  }
  /*灰色遮罩层*/
  .tctitle {
    text-align: center;
    font-size: 16px;
    margin:0px 0;
  }
  .fade{
    width:100%;
    height:100%;
    background:rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99;
  }
  /*弹出层*/
  .succ-pop{
    width: 100%;
    height: auto;
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 0%;
    z-index: 999;
    border-radius: 5px;
    padding: 10px 20px;
  }
  .succ-pop h3.title{
    text-align: center;
    font-size: 22px;
    color: #ce002c;
  }

  .tc_ingput{
    font-size: 14px;
    border:1px solid #f2f2f2;
    margin-bottom:1rem
  }
  .cancel {
    float:left;
    width:46%;
    text-align:center;
    padding:10px;
    background: #f2f2f2;
  }
  .query{
    float: right;
    width: 46%;
    text-align: center;
    padding: 10px;
    color: #fff;
    background: #6db57b;
  }
  .tag_item{
    height: 1.8rem;
    line-height: 1.8rem;
  }
  input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
  }/* chrome */
  input[type="number"]{
    -moz-appearance:textfield;/* firefox */
  }
  #all{
    overflow:scroll;
  }
  .list-li{
    margin-bottom: 10px;
    background: #fff;
  }
  .item-des{
    min-height:60px;
    padding: 10px 15px;
  }
  .big-cover{
    margin-bottom: 10px;
  }
  .big-cover img{
    height:100px;
  }
  .oph{
    text-align:center;
    color: #1EADAD;
  }
  .btn{
    margin-left: 10px;
  }
  .handle{
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #ebeef5;
  }
  .project-detail{
    height:100px;
    margin-bottom:15px;
    border: 1px solid rgb(235, 238, 245);
  }
  .tips{
    display: block;
    text-align: center;
    margin:0rem auto 0.5rem auto;
  }
</style>
