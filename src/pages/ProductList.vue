<template>
<div class="mui-content">
  <search ref="search"
          placeholder="搜索名字、标签或简介"
          v-model="searchValue"
          :auto-fixed="false"
          @on-submit="submit"
          id="search" ></search>
  <tab :class="{ active: isActiveTab }" style="display:none">
    <tab-item v-if="i == 0" selected v-for="(v, i) in shoptags" :key="i" @on-item-click="switchSelect(v.id)">{{ v.title }}</tab-item>
    <tab-item v-else :key="i" @on-item-click="switchSelect(v.id)">{{ v.title }}</tab-item>
  </tab>
    <ul class="msg-content" :style="{'height': msgContentHeight}" id="all">
      <li v-if="list.length == 0">
        <div class="layui-row">
          <div class="layui-col-xs3 shance-thumb">
            <div style="height:70px;width:70px;background:#f7f7f7"></div>
          </div>
          <div class="layui-col-xs9 shance-content">
            <p class="title mui-ellipsis" style="height:10px;width:40%;background:#f7f7f7"></p>
            <p class="mui-ellipsis" style="height:10px;width:100%;background:#f7f7f7;margin-top:10px;"></p>
            <p style="margin: 10px 0px;">
              <span style="height:5px;width:100%;background:#f7f7f7"></span>
              <span style="height:5px;width:100%;background:#f7f7f7"></span>
            </p>
          </div>
        </div>
      </li>
      <li v-if="list" v-for="(item, key) in list" @click="$router.push({path: '/product/detail', query: { pid:item.id,tid:item.mid }})">
        <div class="layui-row">
          <div class="layui-col-xs3 shance-thumb">
            <img :src="host + item.cover">
          </div>
          <div class="layui-col-xs9 shance-content">
            <div class="title-price">
              <span class="title mui-ellipsis">{{ item.title }}</span>
              <span class="price">¥{{ item.price }}</span>
            </div>
            <p class="des mui-ellipsis">{{ item.des }}</p>
            <p class="handle">
              <span>{{ item.data.buy }}次购买</span>
              <span>{{ item.data.ganxie }}次感谢</span>
            </p>
          </div>
        </div>
      </li>
      <div id="loadMore"></div>
    </ul>
  <common-footer></common-footer>
  <shareall></shareall>
</div>
</template>

<script>
import { Tab, TabItem, Search, Scroller, XHeader, Divider } from 'vux'
import cookie from '../../static/js/cookie'
export default {
  components: {
    Search,
    Scroller,
    XHeader,
    Divider,
    TabItem,
    Tab
  },
  data () {
    return {
      host: config.DOMAIN_HOST,
      note: '',
      searchValue: '',
      shoptags: [],
      currentItem: 0,
      msgContentHeight: 0,
      isActive: 1,
      isActiveTab: 1,
      page: 1,
      list: [],
    }
  },
  mounted () {
    let footer = document.getElementById('footer').offsetHeight

    window.msgContentHeight = document.documentElement.clientHeight
    this.msgContentHeight = (window.msgContentHeight - footer - 60) + 'px'
    window.onresize = () => {
      return (() => {
        window.msgContentHeight = document.documentElement.clientHeight
        this.msgContentHeight = (window.msgContentHeight - footer - 60) + 'px'
      })()
    }
    //
    if(cookie.getCookie('token')) {
      this.getShance();
    }
  },
  created () {
    // 获得闪测信息
    // this.getShance();
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
            that.$api.shop({'search': that.searchValue,}).then(res => {
              that.loading = false
              that.list = that.list.concat(res.data.results)
              next('', page < Math.ceil(res.data.count / 10 ));
            })
          }
        });
      });
    },
    getShance(){
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
            let lis = [];
            that.$api.shop({'type': this.note, 'page': page}).then(res => {
              that.list = that.list.concat(res.data.results)
              next('', page < Math.ceil(res.data.count / 10 ));
            })

          }
        });
      });
    },
  }
}
</script>

<style scoped>
  .mui-slider-group{
    padding-bottom:15px;
  }
  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active{
    color: #6db57b;
  }
  .mui-segmented-control.mui-segmented-control-inverted~.mui-slider-progress-bar{
    background-color: #6db57b;
  }
  .mui-table-view .mui-media-object{
    height: 65px;
    width:65px;
    max-width: 65px;
  }
  .mui-media-body p:first-child{
    font-size: 16px;
    color: #3A3A3A;
  }
  .mui-media-body p:nth-child(2){
    font-size: 14px;
    color: #999999;
    line-height: 30px;
  }
  .mui-table-view-cell div:last-of-type{
    color: #C7C7C7;
    font-size: 12px;
  }
  .ui-row{
    text-align:left;
  }
  .ui-row .mui-card-link{
    width: 50%;
    font-size: 0.75rem;
    text-align: center;
  }
  .ui-row .icon-first{
    float: left;
  }
  .ui-row .icon-first{
    float: right;
  }
  .ui-row > [class*="col-"], .ui-row > [class*="tablet-"] {
    box-sizing: border-box;
    float: left;
  }
  .mui-table-view-cell i {
    position: relative;
    font-size: 14px;
    top: -1px;
    margin-right: 5px;
  }
  .mui-slider-indicator{
    background: #FFFFFF;
  }
  .msg-content::-webkit-scrollbar {
    display:none
  }
  .msg-content{
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .mui-content /deep/ .weui-cell__ft{
    color: #999999;
    padding-left: 13px;
  }
  .active {
    display:none;
  }
  .xs-plugin-pulldown-container {
    line-height: 40px;
  }

  .xs-plugin-pullup-container {
    line-height: 40px;
  }
  /*new*/
  .shance-thumb{
    text-align: center;
    padding: 0 10px 0px 12px;
  }
  .shance-thumb img{
    width: 60px;
    height: 60px;
    border-radius: 5px;
  }
  .title{
    font-size: 14px;
    color:#3a3a3a;
  }
  .des{
    font-size: 12px;
    color:#999;
    height: 30px;
    line-height: 30px;
  }
  .handle{
    font-size: 12px;
    color:#999;
  }
  .price{
    float: right;
    color: #FF7D70;
    font-size: 0.7rem;
  }
  #all li p{
    line-height: 24px;
    height: 24px;
  }
  .shance-content{
    padding:0px;
  }
  .handle span:first-child{
    padding-left: 0%;
  }
  .handle span:last-child{
    padding-left: 35%;
  }
  li {
    list-style: none;
    margin-bottom: 8px;
    background: #fff;
    padding: 10px 0px;
  }
  .search{
    padding: 5px;
    height: 50px;
  }
  input[type='text'], input[type='search']{
    margin:0;
    border:none;
  }
  div.search input {
    width:80%;
  }
  .layui-btn {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0;
    background-color: #fff;
    color: #8f8f94;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
    border: none;
    border-radius: 0px;
    cursor: pointer;
    width: 20%;
    float: right;
  }
  .layui-col-xs3 {
    width: auto;
  }
  .layui-row{
    height: 62px;
    overflow:hidden;
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
  .title-price{
    margin-top: -3px;
  }
</style>
