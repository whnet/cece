<template>
  <div class="mui-content">
    <x-header id="header"></x-header>
    <div class="msg-content" :style="{'height': msgContent}">
      <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore"
                use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh"
                lock-x ref="scrollerBottom" height="-48">
        <div class="mui-slider-group">
          <div v-for="(item, i) in list" style="margin-bottom: 5px;">
            <form-preview v-if="item.comments" header-label="付款金额" :header-value=" item.price"
                          :body-items="[{label: '名称',value: item.title},{label: '评价内容',value: item.comments}]"
                          :footer-buttons="[{
                              style: 'default',
                              text: '已评价'
                            }, {
                              style: 'default',
                              text: '查看',
                              link: `/chat?orderid=${item.id}&tid=${item.teacher}&mid=${item.mid}`
                            }]">
            </form-preview>
            <form-preview v-else header-label="付款金额" :header-value=" item.price"
                          :body-items="[{label: '名称',value: item.title}]"
                          :footer-buttons="[{
                              style: 'default',
                              text: '未评价'
                            }, {
                              style: 'default',
                              text: '去评价',
                              link: `/chat?orderid=${item.id}&tid=${item.teacher}&mid=${item.mid}`
                            }]">
            </form-preview>
          </div>
        </div>
      </scroller>
    </div>
    <divider :class="{ active: isActive }">我是有底线的</divider>
    <common-footer></common-footer>
  </div>
</template>

<script>
  import { Tab, TabItem, Search, Scroller, XHeader, Divider, FormPreview } from 'vux'
  import cookie from '../../../static/js/cookie'
  const pulldownDefaultConfig = {
    content: '下拉刷新',
    height: 40,
    autoRefresh: false,
    downContent: '下拉刷新',
    upContent: '释放后刷新',
    loadingContent: '正在刷新...',
    clsPrefix: 'xs-plugin-pulldown-'
  }
  const pullupDefaultConfig = {
    content: '上拉加载更多',
    pullUpHeight: 60,
    height: 40,
    autoRefresh: false,
    downContent: '释放后加载',
    upContent: '上拉加载更多',
    loadingContent: '加载中...',
    clsPrefix: 'xs-plugin-pullup-'
  }
  export default {
    components: {
      Search,
      Scroller,
      XHeader,
      Divider,
      TabItem,
      Tab,
      FormPreview
    },
    data () {
      return {
        note: '',
        msgContent: [],
        isActive: 1,
        page: 1,
        list: [],
        pullupDefaultConfig: pullupDefaultConfig,
        pulldownDefaultConfig: pulldownDefaultConfig
      }
    },
    mounted () {
      let header = document.getElementById('header').offsetHeight
      let footer = document.getElementById('footer').offsetHeight
      this.loadMore()
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset({top: 0})
      })
      window.msgContent = document.documentElement.clientHeight
      this.msgContent = (window.msgContent - header - footer) + 'px'
      window.onresize = () => {
        return (() => {
          window.msgContent = document.documentElement.clientHeight
          this.msgContent = (window.msgContent - header - footer) + 'px'
        })()
      }
    },
    methods: {
      getOrders (data) {
        let mid = cookie.getCookie('mid')
        return this.$api.orders({'page': this.page,'mid':mid}).then(res => {
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset()
          })
          data(res.data)
        })
      },
      refresh () {
        this.page = 1
        this.getOrders(data => {
          this.list = data.results
          this.$refs.scrollerBottom.enablePullup()
          this.$refs.scrollerBottom.donePulldown()
        })
      },
      loadMore () {
        this.getOrders(data => {
          if (!data.next) {
            this.$refs.scrollerBottom.disablePullup()
            this.$refs.scrollerBottom.donePulldown()
            this.isActive = 0
          }
          this.isActive = 0
          this.page++
          this.list = this.list.concat(data.results)
          this.$refs.scrollerBottom.donePullup()
        })
      }
    }
  }
</script>

<style scoped>
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
    border-radius: 10px;
  }
  .mui-media-body p:first-child{
    font-size: 15px;
    color: #3A3A3A;
  }
  .mui-media-body p:nth-child(2){
    font-size: 12px;
    color: #999999;
    line-height: 24px;
  }
  .mui-table-view-cell div:last-of-type{
    color: #C7C7C7;
    font-size: 14px;
  }
  .ui-row .ui-col-50 {
    width: 46%;
    margin-left: 4%;
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
  .mui-content /deep/ .weui-cell__ft{
    color: #999999;
    padding-left: 13px;
  }
  .msg-content{
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .active {
    display:none;
  }
</style>
