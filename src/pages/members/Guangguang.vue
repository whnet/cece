<template>
  <div class="ui-service-list">
            <div class="tag_box ui-cell-noborder" id="header">
              <div class="tag_title">产品项目，点击 + 号新增项目</div>
              <div class="ui-cell-noborder ui-cell-primary">
                <div class="add" @click="addService()"><i class="iconfont icon-bangbangce-zengjia"></i></div>
              </div>
            </div>
    <!--列表页-->
            <ul class="tag_list" :style="{'height': msgContent}" id="all">
              <li class="list-li" v-for="(item, i) in service"
                  :key="i" v-if="service.length">
                <div @click="$router.push({path: '/product/detail', query: { pid:item.id,tid:item.mid }})">
                <div class="title-price">
                  <flexbox>
                    <flexbox-item :span="8"> <input  class="title" type="text" placeholder="项目名称" v-model="item.title"></flexbox-item>
                    <flexbox-item><input class="price" type="tel" placeholder="价格" v-model.number="item.price"></flexbox-item>
                  </flexbox>
                </div>
                <div>
                  <div class="item-des" v-model="item.des">{{item.des}}</div>
                </div>
                <div class="big-cover">
                  <flexbox>
                    <flexbox-item :span="1/2"> <img  :src="host + item.cover"></flexbox-item>
                    <flexbox-item> <img  :src="host + item.big"></flexbox-item>
                  </flexbox>
                </div>
                </div>
                <div class="handle">
                  <flexbox>
                    <flexbox-item :span="1/2"><div class="oph" @click="editProject(item.title, item.price, item.des, item.id, item.cover, item.big)">编辑</div></flexbox-item>
                    <flexbox-item><div class="oph" @click="queryDelService(item.id)">删除 </div></flexbox-item>
                  </flexbox>
                </div>
              </li>
              <div id="loadMore"></div>
            </ul>
    <!--列表页END 转成可以异步加载-->
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
          <div style="clear:both">
            <label class="titles">封面</label>
            <div class="little-img">
              <div class="changeImage">
                <label v-if="!modelCoverSrc" class="btn" for="uploadImgCover"><i class="iconfont icon-tupian"></i>选择封面图</label>
                <input v-if="!modelCoverSrc" type="file" ref="uploadImgCover" id="uploadImgCover"
                       style="position:absolute; clip:rect(0 0 0 0);"
                       accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImgCover($event, 1)">
                <img :src="modelCoverSrc" v-else class="coverImgPrew">
              </div>
            </div>
          </div>
          <div style="clear:both">
            <label class="titles">大图</label>
            <div class="little-img">
              <div class="changeImage">
                <label v-if="!modelBigSrc" class="btn" for="uploadImgBig"><i class="iconfont icon-tupian"></i>上传大图片</label>
                <input v-if="!modelBigSrc" type="file" ref="uploadImgBig" id="uploadImgBig"
                       style="position:absolute; clip:rect(0 0 0 0);"
                       accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImgBig($event, 2)">
                <img :src="modelBigSrc" v-else class="BigImgPrew">
              </div>
            </div>
          </div>
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
          <div style="clear:both">
            <label class="titles">封面</label>
            <div class="little-img">
              <div class="changeImage">
                <label v-if="!modelCoverSrc" class="btn" for="uploadImgCover"><i class="iconfont icon-tupian"></i>选择封面图</label>
                <input v-if="!modelCoverSrc" type="file" ref="uploadImgCover" id="uploadImgCover"
                       style="position:absolute; clip:rect(0 0 0 0);"
                       accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImgCover($event, 1)">
                <img :src="modelCoverSrc" v-else class="coverImgPrew">
                <img :src="host+editCover" class="coverImgPrew editcoverImgPrew">
              </div>
            </div>
          </div>
          <div style="clear:both">
            <label class="titles">大图</label>
            <div class="little-img">
              <div class="changeImage">
                <label v-if="!modelBigSrc" class="btn" for="uploadImgBig"><i class="iconfont icon-tupian"></i>上传大图片</label>
                <input v-if="!modelBigSrc" type="file" ref="uploadImgBig" id="uploadImgBig"
                       style="position:absolute; clip:rect(0 0 0 0);"
                       accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImgBig($event, 2)">
                <img :src="modelBigSrc" v-else class="BigImgPrew">
                <img :src="host + editBig" class="BigImgPrew editBigImgPrew">
              </div>
            </div>
          </div>
        </div>
        <div class="button">
          <span class="cancel" @click="cancelProject()">取消</span>
          <span class="query" @click="queryProject()">确认</span>
        </div>
      </div>
    </div>
    <!--修改弹出框END-->
    <!--删除确认框-->
    <div :style="{ display: delProjectInfo }">
      <div class="fade"></div>
      <div class="succ-pop-delete">
        <div class="content-delete">
          <p class="tctitle">删除项目</p>
          <div style="text-align: center;height: 70px;line-height:50px;">是否确认删除？</div>
        </div>
        <div class="button-delete">
          <span class="cancel" @click="CancelDelProject()">取消</span>
          <span class="query" @click="queryDelProject()">确认</span>
        </div>
      </div>
    </div>
    <!--删除确认框END-->
    <!-- vueCropper 封面图 剪裁图片实现-->
    <el-dialog v-if="dialogType == 1" title="裁剪封面图"
               :visible="isShowModelCover"
               width="100%"
               @close="close()" append-to-body :close-on-click-modal="false">
      <div class="croppers-container">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="false"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :fixedBox="option.fixedBox"
          :original="option.original"
          :fixed="option.fixed"
          :autoCrop="option.autoCrop"
          auto-crop-width="100"
          auto-crop-height="100"
          :fixedNumber="option.fixedNumber"
          @realTime="realTime"
        >
        </vueCropper>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btn-cop quxiao-cop" @click="dialogFormCancel()">取 消</div>
        <div class="dialog-btn-cop" @click="rotateLeft()"><i class="iconfont icon-renxiangmeiyan-bianji-xuanzhuan-nishizhen"></i>左旋转</div>
        <div class="dialog-btn-cop" @click="rotateRight()"><i class="iconfont icon-renxiangmeiyan-bianji-xuanzhuan-shunshizhen"></i>右旋转</div>
        <div class="dialog-btn-cop queding-cop" @click="dialogSmallFormQuery()">确定</div>
      </div>
    </el-dialog>
    <el-dialog v-if="dialogType == 2" title="裁剪大图"
               :visible="isShowModelCover"
               width="100%"
               @close="close()" append-to-body :close-on-click-modal="false">
      <div class="croppers-container">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="false"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :fixedBox="option.fixedBox"
          :original="option.original"
          :fixed="option.fixed"
          :autoCrop="option.autoCrop"
          auto-crop-width="300"
          auto-crop-height="150"
          :fixedNumber="option.fixedNumber"
          @realTime="realTime"
        >
        </vueCropper>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btn-cop quxiao-cop" @click="dialogFormCancel()">取 消</div>
        <div class="dialog-btn-cop" @click="rotateLeft()"><i class="iconfont icon-renxiangmeiyan-bianji-xuanzhuan-nishizhen"></i>左旋转</div>
        <div class="dialog-btn-cop" @click="rotateRight()"><i class="iconfont icon-renxiangmeiyan-bianji-xuanzhuan-shunshizhen"></i>右旋转</div>
        <div class="dialog-btn-cop queding-cop" @click="dialogBigFormQuery()">确定</div>
      </div>
    </el-dialog>
    <!-- vueCropper 剪裁图片实现 END-->
    <div v-transfer-dom>
      <loading :show="show" text="正在上传"></loading>
    </div>
    <shareall></shareall>
  </div>
</template>

<script>
  import cookie from '../../../static/js/cookie'
  import { Flexbox, FlexboxItem, Divider, Confirm, Group, XButton, TransferDomDirective as TransferDom,Loading} from 'vux'
  export default {
    name: 'Guangguang',
    data () {
      return {
        msgContent:0,
        show:false,
        host:config.DOMAIN_HOST,
        dialogType:0,
        list: [],
        service: [],
        display: 'none',
        addProjectInfo: 'none',
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
        editCover:'',
        editBig:'',
        editId:0,
        delId:0,
        modelCoverSrc:'',
        coverfiles:'',
        modelBigSrc:'',
        bigfiles:'',
        delProjectInfo:'none',
        isShowModelCover: false,
        option: {
          img: '',
          outputSize: 0.5,
          full: true,
          outputType: 'png',
          fixedBox: true,
          original: false,
          canMoveBox: true,
          canMove:true,
          centerBox:true,
          high: true,
          autoCrop:true,
        },
        previews: {},
      }
    },
    directives: {
      TransferDom
    },
    components: {
      XButton,
      Loading,
      Flexbox,
      FlexboxItem
    },
    created () {
      if(cookie.getCookie('mid') == null){
        this.getWechatAuth()
      }
      if(cookie.getCookie('token')) {
        this.Service()
      }
    },
    mounted () {
      if(cookie.getCookie('mid') == null){
        this.getWechatAuth()
      }
      this.Service()
      let header = document.getElementById('header').offsetHeight
      window.msgContent = document.documentElement.clientHeight
      this.msgContent = (window.msgContent - header) + 'px'
    },
    methods: {
      // 图片裁剪 START
      // 实时预览函数
      realTime(data) {
        this.previews = data
      },
      uploadImgBig(e, type) {
        this.uploadImg(e, type)
      },
      uploadImgCover(e, type) {
        this.uploadImg(e, type)
      },
      uploadImg(e, type){
        // 截图的类型
        this.dialogType = type
        //上传图片
        let file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        let reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          this.option.img = data
        }
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file)
        this.isShowModelCover = true
      },
      imgLoad(msg) {
        console.log(msg)
      },
      dialogFormCancel(){
        this.close()
      },
      dialogSmallFormQuery(){
        this.$refs.cropper.getCropBlob((data) => {
          this.modelCoverSrc =  window.URL.createObjectURL(data)
          this.coverfiles = data
          this.close()
        })
      },
      dialogBigFormQuery(){
        this.$refs.cropper.getCropBlob((data) => {
          this.modelBigSrc =  window.URL.createObjectURL(data)
          this.bigfiles = data
          this.close()
        })
      },
      close(){
        this.option = {
          img: '',
          outputSize: 0.2,
          full: true,
          outputType: 'png',
          canMove: true,
          fixedBox: true,
          original: false,
          canMoveBox: true,
          canMove:false,
          centerBox:true,
          high: true,
          autoCrop:true,
        };
        this.dialogType = 0
        this.previews = {}
        if(this.option.img) {
          this.$refs['cropper'].imgs = "";
        }
        this.option.img = ''
        this.isShowModelCover = false
      },
      rotateRight(){
        this.$refs.cropper.rotateRight()
      },
      rotateLeft(){
        this.$refs.cropper.rotateLeft()
      },
      // 图片裁剪END
      canselServic (i) {
        this.list.splice(i, 1)
        this.$vux.toast.text('已取消')
      },
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
      editProject (title,price,detail,id,cover,big) {
        this.editProjectInfo = 'block'
        this.editTitle = title
        this.editPrice = price
        this.editDetail = detail
        this.editCover = cover
        this.editBig = big
        this.editId = id
        // 将页面设置为不可滚动
        document.body.style.position='fixed';
        document.body.style.width='100%';
        // 将页面设置为不可滚动END
      },
      cancelProject () {
        this.editProjectInfo = 'none'
        document.body.style.position='static';
      },
      queryProject () {
        this.editService(this.editTitle, this.editPrice, this.editDetail, this.editId, this.editCover, this.editBig)
        document.body.style.position='static';
      },
      addService () {
        this.addProjectInfo = 'block';
        document.body.style.position='fixed';
        document.body.style.width='100%';
      },
      cancelAddProject () {
        this.addProjectInfo = 'none'
        document.body.style.position='static';
      },
      queryAddProject () {
        this.addServiceInfo(this.addTitle, this.addPrice, this.addDetail, this.coverfiles, this.bigfiles)
        document.body.style.position='static';
      },
      addServiceInfo(title, price, des, cover, big){
        if(price < 1){
          this.$vux.toast.text('最低价格不能小于1元')
          return false
        }
        this.show = true
        let param = new FormData();
        param.append('cover',cover,'cover.png');
        param.append('big',big,'big.png');
        return this.$api.upg(param).then(res => {
          let type = 'post'
          let data = {
            'title':title,
            'price':price,
            'des':des,
            'status':1,
            'mid':cookie.getCookie('mid'),
            'teacher':cookie.getCookie('tid'),
            'cover':res.data.info.cover,
            'big':res.data.info.big,
          }
          return this.$api.project(data, type).then(res => {
            this.service = this.service.concat(res.data)
            this.Service()
            this.addProjectInfo = 'none'
            this.$vux.toast.text('新增成功')
            this.show = false
            this.defaultSetting()
          })
        })
      },
      defaultSetting(){
        //初始化
        this.addTitle=''
        this.addPrice=''
        this.addDetail=''
        this.editTitle=''
        this.editPrice=''
        this.editDetail=''
        this.editCover=''
        this.editBig=''
        this.modelCoverSrc=''
        this.coverfiles=''
        this.modelBigSrc=''
        this.bigfiles=''
        this.editId=0
        this.delId=0
        this.option.img=''
        //初始化
      },
      editService (title, price, des, id, cover, big) {
        if(price < 1){
          this.$vux.toast.text('最低价格不能小于1元')
          return false
        }
        this.show = true
        let type = 'put'
        if(this.coverfiles && this.bigfiles){
          let param = new FormData();
          param.append('cover',this.coverfiles,'cover.png');
          param.append('big',this.bigfiles,'big.png');
          return this.$api.upg(param).then(res => {
            let data = {
              'title':title,
              'price':price,
              'des':des,
              'status':1,
              'cover':res.data.info.cover,
              'big':res.data.info.big,
            }
            this.project(data, type, id)
          })
        }else if(this.coverfiles){
          let param = new FormData();
          param.append('cover',this.coverfiles,'cover.png');
          return this.$api.upg(param).then(res => {
            let data = {
              'title':title,
              'price':price,
              'des':des,
              'status':1,
              'cover':res.data.info.cover,
            }
            this.project(data, type, id)
          })
        }else if(this.bigfiles){
          let param = new FormData();
          param.append('big',this.bigfiles,'big.png');
          return this.$api.upg(param).then(res => {
            let data = {
              'title':title,
              'price':price,
              'des':des,
              'status':1,
              'big':res.data.info.big,
            }
            this.project(data, type, id)
          })
        }else{
          let data = {
            'title':title,
            'price':price,
            'des':des,
            'status':1,
          }
          this.project(data, type, id)
        }
      },
      project(data, type, id){
        return this.$api.project(data, type, id).then(res => {
          this.service = this.service.concat(res.data)
          this.Service()
          this.editProjectInfo = 'none'
          this.$vux.toast.text('修改成功')
          this.modelCoverSrc = ''
          this.modelBigSrc = ''
          this.show = false
        })
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
        return this.$api.project(0, type, id).then(res => {
          this.Service()
          this.$vux.toast.text('删除成功')
          this.delProjectInfo = 'none'
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
      //转换成异步加载功能
      Service (){
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
              that.$api.shop({'page': page,'m':that.tid}).then(res => {
                if(page == 1){
                  that.service = []
                }
                that.service = that.service.concat(res.data.results)
                next('', page < Math.ceil(res.data.count / 10 ));
              })
            }
          });
        });
      },
      //转换成异步加载功能END
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
  .cover-img{
    position: absolute;
    top: 120px;
    height: 60px;
    width: 100%;
    left: 0;
    overflow:hidden;
  }
  .ui-search-input[data-v-ff3dce4c] {
    position: relative;
    top: 5px;
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
    width: 100%;
    background: #fff;
    position: fixed;
    left: 0%;
    bottom: 0%;
    z-index: 999;
    padding: 0px 10px 20px;
    border-radius: 0;
    overflow-y: scroll;
  }
  .succ-pop h3.title{
    text-align: center;
    font-size: 22px;
    color: #ce002c;
  }
  .succ-pop-delete{
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
  .succ-pop-detete h3.title{
    text-align: center;
    font-size: 22px;
    color: #ce002c;
  }
  .cancel {
    float:left;
    width:35%;
    text-align:center;
    padding:10px;
    margin-left:10%;
    background: #f2f2f2;
  }
  .query{
    float: right;
    width: 35%;
    text-align: center;
    padding: 10px;
    color: #fff;
    margin-right:10%;
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
  .ui-service-list /deep/ .el-upload-dragger {
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
  .ui-service-list /deep/ .el-upload-dragger .el-icon-upload {
    font-size: 44px;
    color: #C0C4CC;
    margin: 40px 0 16px;
    line-height: 50px;
  }
  .ui-service-list /deep/ .el-upload-dragger .el-icon-upload {
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

  .croppers-container{
    width:300px;
    height:300px;
    margin: 0 auto;
  }
  /deep/  .el-dialog__body {
    padding: 10px 30px 10px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  /deep/ .el-dialog__header {
    padding: 10px 20px 10px;
  }
  /deep/ .el-dialog__headerbtn {
    position: absolute;
    top: 10px;
    right: 20px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 16px;
  }
  .vue-cropper /deep/ .cropper-crop-box{
    width:50px;
    height:50px;
  }
  /deep/ .el-dialog__footer {
    padding: 0;
    text-align: right;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
  }
  .dialog-btn-cop{
    width:25%;
    text-align: center;
    float: left;
  }
  .quxiao-cop{
    /*float:left;*/
  }
  .queding-cop{
    /*float:right;*/
  }
  .ui-content{
    padding: 0;
  }
  .button{
    width: 210px;
    margin: 0 auto;
  }
  .project-detail{
    height:100px;
    margin-bottom:15px;
    border: 1px solid rgb(235, 238, 245);
  }
  .content{
    height: 85%;
    overflow: scroll;
  }
  .titles{
    height: 40px;
    display: block;
    float: left;
    line-height: 40px;
    margin-bottom: 10px;
  }
  .tc_ingput{
    font-size: 14px;
    border:1px solid #f2f2f2;
    margin-bottom:10px;
    float:right;
    width:90%;
  }
  .coverImgPrew{
    height: 50px;
    width: 50px;
  }
  .editcoverImgPrew{
    position: relative;
    top: 0px;
    left: 100px;
  }
  .BigImgPrew{
    height: 50px;
    width: 100px;
  }
  .editBigImgPrew{
    position: relative;
    top: 0px;
    left: 100px;
  }
  .cover{
    float:left;
    width:40%;
    padding-left: 8%;
  }
  .big{
    float:right;
    width:40%;
    padding-right: 8%;
  }
  #all{
    overflow:scroll;
  }
  input, textarea {
    box-sizing: border-box;
    display: inline-block;
    border: none;
    -webkit-appearance: none;
    appearance: none;
    font-weight: normal;
    outline: none;
    background: none;
    outline: none;
    border: 0px;
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
</style>
