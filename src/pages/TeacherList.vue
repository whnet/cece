<template>
<div class="mui-content">
  <search ref="search"
          placeholder="搜索名字、标签或简介"
          v-model="searchValue"
          :auto-fixed="false"
          id="search"
          @on-submit="submit"
          ></search>
  <div id="choose">
    <div class="ui-cell-noborder ui-cell-sa select_bar border-bottom-1px b_fff">
      <div class="classify_btn s_btn ui-cell-noborder p1" @click="searchtype(1)">
        <span>{{ typename }}</span>
        <i class="iconfont icon-paixujiantoushang"></i>
      </div>
      <div class="price_btn s_btn ui-cell-noborder p2" @click="sethaoping()">
        <span>感谢排序</span>
        <i class="iconfont" :class="haoping ? 'icon-paixujiantoushang1' : 'icon-paixujiantoushang' "></i>
      </div>
      <div class="price_btn s_btn ui-cell-noborder p3" @click="setprice()">
        <span>价格排序</span>
        <i class="iconfont" :class="price ? 'icon-paixujiantoushang1' : 'icon-paixujiantoushang' "></i>
      </div>
    </div>
    <div class="moda_type popu popu_type" @click="searchtype(0)" :style="{'display': tab == 1 ? 'block':'none'}">
        <div class="classify_list b_fff fs15 center">
          <div class="list_item" @click="selectType(item.key,item.value)" v-for="(item, i) in typelist">{{ item.value }}</div>
        </div>
      <div class="cancle center b_fff main_c" @click="searchtype(0)">取消</div>
    </div>
  </div>

  <ul class="mui-table-view" :style="{'height': msgContent}" id="all">
    <li class="mui-table-view-cell mui-media teacher" v-for="(item, i) in list">
      <div @click="$router.push({ path:'teacher/detail', query: { tid:item.id,pid:item.id }})">
      <img :src="item.avatar" class="teacher_avatar"/>
       <div class="left-detail">
          <div class="master-name">{{ item.realname }}
            <div class="right-price">
             <p class="price" v-if="item.data.price && item.data.price != '0.00' ">￥{{ item.data.price }}起</p>
             <p class="price" v-else>免费</p>
           </div>
          </div>
          <div class="category">
            <span v-for="(c, j) in item.type" v-if="j <= 4">{{ c.title }}</span>
          </div>
       </div>
        <div class="master-info">{{ item.resume }}</div>
        <div class="data-count">
          <p>{{ item.data.services_count }}个项目</p>
          <p>{{ item.data.jieda }}次服务</p>
          <p>{{ item.data.ganxie }}次感谢</p>
        </div>
      </div>
    </li>
    <div id="loadMore"></div>
  </ul>

  <common-footer></common-footer>
  <shareall></shareall>
  <div v-transfer-dom>
    <loading :show="loading" :text="text"></loading>
  </div>
</div>
</template>

<script>
import { Search, Scroller, XHeader, Divider, Loading, TransferDomDirective as TransferDom } from 'vux'
import cookie from '../../static/js/cookie'

export default {
  directives: {
    TransferDom
  },
  components: {
    Search,
    Scroller,
    XHeader,
    Divider,
    Loading
  },
  data () {
    return {
      typelist: [],
      loading: false,
      text: '正在加载',
      loading: false,
      msgContent: [],
      isActive: 1,
      searchValue: '',
      tab: 0,
      type: this.$route.query.type,
      typename: '所属分类',
      haoping: 0,
      price: 0,
      page: 1,
      list: [],
    }
  },
  mounted () {
    if(cookie.getCookie('token')) {
      this.getCat()
    }
    let search = document.getElementById('search').offsetHeight
    let footer = document.getElementById('footer').offsetHeight

    window.msgContent = document.documentElement.clientHeight
    this.msgContent = (window.msgContent - footer - search - 50) + 'px'

    window.onresize = () => {
      return (() => {
        window.msgContent = document.documentElement.clientHeight
        this.msgContent = (window.msgContent - footer - search - 50) + 'px'
      })()
    }
    // getTeacher
    if(cookie.getCookie('token')) {
      this.getTeacher();
    }
  },
  methods: {
    submit(){
      let that = this;
      that.list = []
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
              that.$api.teacher({params: {
                  'search': that.searchValue,
                }}).then(res => {
                that.loading = false
                that.list = that.list.concat(res.data.results)
                next('', page < Math.ceil(res.data.count / 10 ));
              })
            }
          });
      });
    },
    getTeacher (){
      let that = this;
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
            that.$api.teacher({params: {
                'type': that.type,
                'page': page
            }}).then(res => {
                that.loading = false
                that.list = that.list.concat(res.data.results)
                next('', page < Math.ceil(res.data.count / 10 ));
            })
          }
        });

      });
    },
    refresh () {
      let that = this;
      that.list = [];
      layui.use('flow', function(){
        let flow = layui.flow;
        let $ = layui.jquery
          ,element = layui.element;
        flow.load({
          elem: '#all'
          ,isAuto:true
          ,scrollElem: '#all'
          ,loadMore:'#loadMore'
          ,done: function(page, next){
            that.$api.teacher({params: {
                'type': that.type,
                'page': page}}).then(res => {
              that.loading = false
              that.list = that.list.concat(res.data.results)
              next('', page < Math.ceil(res.data.count / 10 ));
            })
          }
        });

      });
    },
    sethaoping(){
      let that = this;
      that.list = [];
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
            // 请求数据
            that.haoping == 1?that.haoping = 0:that.haoping = 1
            that.price = 0
            that.list = [];
            // 向上由低到高 haopinglv 由低到高 ，-haopinglv 由高到低
            if(that.haoping == 1){
              that.teacherOrder(data => {
                that.loading = false
                that.list = that.list.concat(data.results)
                next('', page < Math.ceil(data.count / 10 ));
              },'-haopinglv')
            }else{
              that.teacherOrder(data => {
                that.loading = false
                that.list = that.list.concat(data.results)
                next('', page < Math.ceil(data.count / 10 ));
              },'haopinglv')
            }
            // 请求数据 END
          }
        });

      });
    },
    setprice(){
      let that = this;
      that.list = [];
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
            // 请求数据
            that.price == 1?that.price = 0:that.price = 1
            that.haoping = 0
            that.list = [];
            // 向上由低到高 haopinglv 由低到高 ，-price 由高到低
            if(that.price == 1){
              that.teacherOrder(data => {
                that.loading = false
                that.list = that.list.concat(data.results)
                next('', page < Math.ceil(res.data.results.length / 10 ));
              },'-price')
            }else{
              that.teacherOrder(data => {
                that.loading = false
                that.list = that.list.concat(data.results)
                next('', page < Math.ceil(data.count / 10 ));
              },'price')
            }
            // 请求数据 END

          }
        });

      });

    },
    selectType(id,name){
      this.type = id
      this.typename = name
      this.refresh()
      this.searchtype(0)
    },
    searchtype (id) {
      this.tab = id
    },
    getTeachertest (data) {
      this.loading = true
      return this.$api.teacher({params: {
          'type': this.type,
          'page': this.page}}).then(res => {
            data(res.data)
           this.loading = false
          })
    },
    teacherOrder (data,ordering) {
      this.loading = true
      this.page = 1
      return this.$api.teacher({params: {
          'type': this.type,
          'page': this.page,
          'ordering': ordering
        }}).then(res => {
        data(res.data)
        this.loading = false
      })
    },
    // 得到类别分类
    getCat: function () {
      return this.$api.catogary().then(res => {
        let result = res.data;
        let typelist = [];
        for(var i=0;i<result.length;i++){
          typelist.push({key: result[i].id, value: result[i].title})
        }
        this.typelist = typelist
        this.typename = result[this.type-1].title
        if(result){
          this.id = result.id
        }
      })
    },
  }
}
</script>

<style scoped>
  .mui-slider-group{
    padding-bottom:15px;
  }
  .right-price{
    float: right;
    text-align:right;
  }
  .left-detail{
    width: 75%;
    float: left;
    margin-left: 5%;
  }
  .mui-table-view{
    background: none;
  }

  .mui-table-view-cell:after{
    height: 0;
  }
  .mui-table-view:after{
    height: 0;
  }
  .mui-table-view-cell{
    background: #FFFFFF;
    margin-bottom: 10px;
  }
  .teacher img{
    border-radius:10px;
  }
  .mui-content>.mui-table-view:first-child{
    margin-top:0px ;
  }
  .mui-table-view .mui-media-object{
    line-height: 60px;
    max-width: 4rem;
    height: 4rem;
  }
  .master-name{
    color: #3A3A3A;
    font-size:0.8rem;
  }
  .category span{
    padding: 0 5%;
    border-radius: 10px;
    color: #45B97C;
    margin: .3rem .3rem 0 0;
    border: 1px solid #45B97C;
    white-space: nowrap;
    display: inline-block;
    font-size: 0.65rem;
  }
  .price{
    color: #FF7D70;
    font-size: 0.7rem;
  }
  .origin-price{
    color: #A3A3A3;
    font-size: .6rem;
    display: block;
    text-decoration: line-through;
  }
  .master-info{
    padding-top:0.35rem ;
    clear: both;
    font-size: 0.7rem;
    color: #666666;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .data-count{
    margin-top: 10px;
    border-top:1px solid #CCCCCC;
    height: 30px;
  }
  .data-count p{
    height: 30px;
    line-height: 30px;
    width: 33%;
    float: left;
    text-align: center;
    padding-top:5px ;
  }
  .box {
    padding: 5px 10px 5px 10px;
  &:first-child {
     padding: 0 10px 5px 10px;
   }
  &:last-child {
     padding: 5px 10px 0 10px;
   }
  }
  .list {
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #f0f0f0;
    padding: 30px;
  }
  .xs-plugin-pulldown-container {
    line-height: 40px;
  }
  .xs-plugin-pullup-container {
    line-height: 40px;
  }
  .active {
    display:none;
  }
  .msg-content::-webkit-scrollbar {
    display:none
  }
  .mui-content /deep/ .weui-cell__ft{
    color: #999999;
    padding-left: 13px;
  }
  .msg-content{
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .mui-content /deep/ .weui-search-bar__box {
    position: relative;
    padding-left: 30px;
    top: 8px;
    padding-right: 30px;
    height: 40px;
    width: 100%;
    box-sizing: border-box;
    z-index: 1;
  }
  .mui-content /deep/ .weui-search-bar__label {
    position: absolute;
    top: 12px;
    right: 1px;
    bottom: 1px;
    left: 1px;
    z-index: 2;
    border-radius: 3px;
    text-align: center;
    color: #9B9B9B;
    background: #FFFFFF;
  }
  .mui-content /deep/ .weui-search-bar__cancel-btn {
    margin-left: 10px;
    line-height: 40px;
    color: #09BB07;
    white-space: nowrap;
  }
  .ui-cell-noborder {
    position: relative;
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    display: box;
    -webkit-box-align: center;
    -moz-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    height: 40px;
  }
  .s_btn{
    width: 35%;
  }
  .p1{
    padding-left: 5%;
  }
  .p2{
    padding-left: 7%;
  }
  .p3{
    padding-left: 10%;
  }
  .popu {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 900;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.2);
    padding-top: 100%;
  }
  .b_gray {
    background: #f6f8f8;
    position: relative;
  }
  .moda_type .cancle {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
  }
  .center {
    text-align: center !important;
  }
  .main_c {
    color: #01b2b6 !important;
  }
  .list_bg.show {
    bottom: 0rem;
  }
  .list_item:not(:last-child) {
    border-bottom: 1px solid #e9e9e9;
  }
  .list_item {
    height: 2.5rem;
    line-height: 2.5rem;
  }
  .b_fff {
    background: #f7f7f7;
  }
  .price_sort {
    position: relative;
    max-height: 15.3rem;
    /* overflow: scroll; */
    padding-bottom: .5rem;
    z-index: 990;
  }
  .classify_list {
    position: absolute;
    overflow: scroll;
    z-index: 990;
    height: 200px;
    bottom: 2.6rem;
    width: 100%;
  }
  .tr {
    background: #e6e6e6;
    width: 100%;
    height: 2rem;
  }
  .withe_bg {
    position: absolute;
    bottom: .5rem;
    left: 0;
    width: 100%;
    height: 1.5rem;
    background: -moz-linear-gradient(top, rgba(255,255,255,.1) 0%, #fff 50%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,.1)), color-stop(50%,#fff));
    background: -webkit-linear-gradient(top, rgba(255,255,255,.1) 0%,#fff 50%);
    background: -o-linear-gradient(top, rgba(255,255,255,.1) 0%,#fff 50%);
    background: -ms-linear-gradient(top, rgba(255,255,255,.1) 0%,#fff 50%);
    background: linear-gradient(to bottom, rgba(255,255,255,.1) 0%,#fff 50%);
  }
  .teacher_avatar{
    float: left;
    width:18%;
    height:18%;
  }
  /*new*/
  #all{
    overflow: scroll;
  }
  .icon-paixujiantoushang:before {
    color: #c8c7cc;
  }
  .icon-paixujiantoushang:before, .icon-paixujiantoushang1:before {
    padding-left: 0px;
  }
</style>
