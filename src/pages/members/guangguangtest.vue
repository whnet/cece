<template>
  <div class="ui-page-group">
    <div class="ui-page ui-page-current">
      <div class="ui-content">
        <div class="scroll_box">
          <div class="tag_content">
            <div class="tag_box ui-cell-noborder">
              <div class="tag_title">服务项目，点击 + 号新增项目</div>
              <div class="ui-cell-noborder ui-cell-primary">
                <div class="add" @click="addService()"><i class="iconfont icon-bangbangce-zengjia"></i></div>
              </div>
            </div>
            <div class="new_tag">
              <ul class="tag_list">
                <li class="ui-cell-noborder" v-for="(item, i) in list" :key="i" v-if="list.length">
                  <div class="project-title">
                    <input class="ui-search-input title" type="text"
                           placeholder="项目名称" v-model="item.title">
                  </div>
                  <div class="project-price">
                    <input class="ui-search-input price" type="tel" placeholder="价格" v-model.number="item.price">
                  </div>
                  <div class="detail">
                    <textarea style="height:60px" v-model="item.des" maxlength="300" placeholder="项目详情介绍，最多300个字"></textarea>
                  </div>
                  <div class="option">
                    <div class="edit two" @click="saveService(item.title, item.price, item.des, i)">保存</div>
                    <div class="edit two" @click="canselServic(i)">取消</div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="new_tag">
              <ul class="tag_list">
                <li class="ui-cell-noborder" v-for="(item, i) in service" :key="i" v-if="service.length">
                  <div class="project-title">
                    <input class="ui-search-input title" type="text"
                           placeholder="项目名称" v-model="item.title">
                  </div>
                  <div class="project-price">
                    <input class="ui-search-input price" type="tel" placeholder="价格" v-model.number="item.price">
                  </div>
                  <div class="detail">
                    <textarea style="height:60px" v-model="item.des" maxlength="300" placeholder="项目详情介绍，最多300个字"></textarea>
                  </div>
                  <div class="option">
                    <div class="edit two" @click="editProject(item.title, item.price, item.des, item.id)">编辑</div>
                    <div class="edit two" @click="queryDelService(item.id)">删除</div>
                  </div>
                  <div class="cover-img">
                    <div class="little-img">
                      <el-upload action="" drag
                                 :auto-upload="false" :show-file-list="false" :on-change='changeUpload'>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">点击上传封面图</div>
                      </el-upload>
                    </div>
                    <div class="big-img">
                      <el-upload action="" drag
                                 :auto-upload="false" :show-file-list="false" :on-change='changeUpload'>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">点击上传主图</div>
                      </el-upload>
                    </div>
                  </div>
                </li>
                <div v-if="service.length === 0 && tid" class="nomessage"  @click="addService()">暂无服务项目，点击添加</div>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!--页面内容结束-->
    </div>
    <div :style="{ display: display }">
      <div class="fade"></div>
      <div class="succ-pop">
        <div class="content">
          <p class="tctitle">设置套餐</p>
          <input class="tc_ingput price"  type="text" maxlength="5" v-model="tcPrice" placeholder="套餐价格" >
          <input class="tc_ingput" type="text" maxlength="300" v-model="tcDes" placeholder="套餐介绍">
        </div>
        <div class="button">
          <span class="cancel" @click="cancel()">取消</span>
          <span class="query" @click="query()">确认</span>
        </div>
      </div>
    </div>
    <!--修改弹出框-->
    <div :style="{ display: editProjectInfo }">
      <div class="fade"></div>
      <div class="succ-pop">
        <div class="content">
          <p class="tctitle">编辑项目</p>
          <input class="tc_ingput project"  type="text" v-model="editTitle" placeholder="项目名称">
          <input class="tc_ingput price"  type="text" v-model="editPrice" placeholder="项目价格">
          <input class="tc_ingput" type="text" maxlength="300" v-model="editDetail" placeholder="项目详情">
        </div>
        <div class="button">
          <span class="cancel" @click="cancelProject()">取消</span>
          <span class="query" @click="queryProject()">确认</span>
        </div>
      </div>
    </div>
    <!--修改弹出框-->
    <!--删除确认框-->
    <div :style="{ display: delProjectInfo }">
      <div class="fade"></div>
      <div class="succ-pop">
        <div class="content">
          <p class="tctitle">删除项目</p>
          <div style="text-align: center;height: 70px;line-height:50px;">是否确认删除？</div>
        </div>
        <div class="button">
          <span class="cancel" @click="CancelDelProject()">取消</span>
          <span class="query" @click="queryDelProject()">确认</span>
        </div>
      </div>
    </div>
    <!--删除确认框END-->
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
          ></vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div  class="cancel-cropper" @click="dialogVisible = false">取 消</div>
        <div class="query-cropper" @click="finish" :loading="loading">确认</div>
      </div>
    </el-dialog>
    <!-- vueCropper 剪裁图片实现 END-->
  </div>
</template>

<script>
  import cookie from '../../../static/js/cookie'
  import { Divider, Confirm, Group, XButton, TransferDomDirective as TransferDom} from 'vux'
  export default {
    name: 'Guangguang',
    data () {
      return {
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
        editTitle:'',
        editPrice:'',
        editDetail:'',
        editId:0,
        delId:0,
        delProjectInfo:'none',
        // 裁剪组件的基础配置option
        dialogVisible: false,
        option: {
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 0.8, // 裁剪生成图片的质量
          outputType: 'jpeg', // 裁剪生成图片的格式
          canScale: false, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 100, // 默认生成截图框宽度
          autoCropHeight: 50, // 默认生成截图框高度
          fixedBox: true, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [7, 5], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMoveBox: true, // 截图框能否拖动
          original: true, // 上传图片按照原始比例渲染
          centerBox: false, // 截图框是否被限制在图片里面
          infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        },
        picsList: [],  //页面显示的数组
        // 防止重复提交
        loading: false
      }
    },
    directives: {
      TransferDom
    },
    components: {
      XButton,
    },
    created () {
      if(cookie.getCookie('mid') == null){
        this.getWechatAuth()
      }
      this.Service()
    },
    methods: {
      // 图片裁剪 START
      // 上传按钮   限制图片大小
      changeUpload(file, fileList) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message.error('上传文件大小不能超过 5MB!')
          return false
        }
        this.fileinfo = file
        console.log(file);

        // 上传成功后将图片地址赋值给裁剪框显示图片
        this.$nextTick(() => {
          this.option.img = 'http://bangce.emifo.top/static/images/tip_bg.png'
          this.dialogVisible = true
        })
      },
      // 点击裁剪，这一步是可以拿到处理后的地址
      finish() {
        this.$refs.cropper.getCropBlob((data) => {
          var fileName = 'goods' + this.fileinfo.uid
          this.loading = true
          //上传阿里云服务器
        })
      },
      // 图片裁剪END
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
      },
      queryProject () {
        this.editService(this.editTitle, this.editPrice, this.editDetail, this.editId)
      },
      editService (title, price, des, id) {
        // 更新操作
        let type = 'put'
        let data = {
          "title": title,
          "price": price,
          "des": des,
        }
        // if(price < 1){
        //   this.$vux.toast.text('最低价格不能小于1元')
        //   return false
        // }
        return this.$api.service(data, type, id).then(res => {
          this.service = this.service.concat(res.data)
          this.Service()
          this.editProjectInfo = 'none'
          this.$vux.toast.text('编辑成功')
        }).catch(err => {
          this.$vux.toast.text('请登录')
          return err
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
          console.log(err)
          return err
        })
      },
      saveService (title, price, des, i) {
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
        // if(price < 1){
        //   this.$vux.toast.text('最低价格不能小于1元')
        //   return false
        // }
        return this.$api.service(data, type, 0).then(res => {
          this.service = this.service.concat(res.data)
          this.list.splice(i, 1)
          this.Service()
          this.$vux.toast.text('新增成功')
        }).catch(err => {
          this.$vux.toast.text(err)
          return err
        })
      },
      Service () {
        // 获得服务的列表
        let tid = cookie.getCookie('tid')
        this.tid = tid
        if(tid){
          return this.$api.service(0,0,tid).then(res => {
            this.service = res.data
            let arr = []
            let priceList = []
            for (var i=0;i<res.data.length;i++){
              arr.push(Number(res.data[i].belong))
              priceList.push(Number(res.data[i].price))
            }
            this.priceList = priceList
            this.listId = arr
            let array = priceList
            this.minprice = Math.min.apply(null, array)
            if(res.data.length > 0){
              // 更新成功后找到最小的价格进行更新
              let datas = {
                "price": this.minprice,
              }
              return this.$api.addOrUpdateTeacher(datas, this.tid).then(res => {
              })
              // 更新成功后找到最小的价格进行更新END
            }

          }).catch(err => {
            this.$vux.toast.text('错误')
            return err
          })
        }else{
          this.$vux.toast.text('还不是老师')
        }
      },
      tc (title, id) {
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
  // 截图
     .cropper-content {
  .cropper {
    width: auto;
    height: 300px;
  }
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
    height:230px;
    margin-bottom: 10px;
    background: #fff;
  }
  .option{
    margin:0;
    padding:0;
    position: absolute;
    top: 190px;
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
  .cover-img{
    position: absolute;
    top: 100px;
    height: 80px;
    width: 100%;
    left: 0;
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
    padding: 0 15px;
    border-top: 1px solid #f2f2f2;
  }
  .little-img{
    float:left;
    height: 80px;
    margin-left:15px;
    text-align: center;
  }
  .big-img{
    float:right;
    height: 80px;
    margin-right:15px;
    text-align: center;
  }
  .tag_ingput{
    border:none;
  }
  /*灰色遮罩层*/
  .tctitle {
    text-align: center;
    font-size: 16px;
    margin:10px 0;
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
    width: 300px;
    height: auto;
    background: #fff;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -150px;
    margin-top: -125px;
    z-index: 999;
    border-radius: 5px;
    padding:10px 20px;
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
  /*图片裁剪*/
  .ui-page-group /deep/ .el-upload-dragger {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: auto;
    height: auto;
    text-align: center;
    position: inherit;
    overflow: hidden;
    padding: 0px 14px;
  }
  .ui-page-group /deep/ .el-upload-dragger .el-icon-upload {
    font-size: 44px;
    color: #C0C4CC;
    margin: 40px 0 16px;
    line-height: 50px;
  }
  .ui-page-group /deep/ .el-upload-dragger .el-icon-upload {
    font-size: 44px;
    color: #C0C4CC;
    margin: 0px;
    line-height: 50px;
  }
  .cancel-cropper{
    display: inline-block;
    float:left;
  }
  .query-cropper{
    display: inline-block;
    float:right;
  }
  .el-dialog {
    position: relative;
    margin: 0 auto 50px;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-sizing: border-box;
    width: 80%;
  }
  .cropper-box{
    overflow: initial;
  }
</style>
