<template>
<div class="mui-content">
  <grid-swiper></grid-swiper>
  <notice></notice>
  <banner></banner>
  <bang-dan></bang-dan>
  <Comments></Comments>
  <common-footer></common-footer>
  <shareall></shareall>
</div>
</template>

<script>
import Notice from '../components/Notice'
import Banner from '../components/Banner'
import gridSwiper from '../components/gridSwiper'
import bangDan from '../components/bangDan'
import Comments from '../components/common/Comments'
import cookie from '../../static/js/cookie'
export default {
  components: {
    Notice,
    Banner,
    gridSwiper,
    bangDan,
    Comments
  },
}
</script>
