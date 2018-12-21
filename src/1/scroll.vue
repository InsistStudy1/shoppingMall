<template>
  <div>
    <my-class :data="listData3" :class-option="classOption3" class="warp2">
      <ul class="ul-item clearfix">
        <li class="li-item" v-for="item in listData3">{{item}}</li>
      </ul>
    </my-class>
  </div>
</template>

<script>
  import myClass from '@/1/myClass.vue'

  export default {
    name: "scroll",
    data() {
      return {
        listData3: [1, 2, 3, 4, 5],
      }
    },
    computed: {
      classOption3() {
        return {
          limitMoveNum: 2,
          direction: 2
        }
      },
      components: {
        myClass
      }
    }
  }
</script>

<style scoped>
  .ul-item {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 670px;

  }
  .ul-item .li-item {
    float: left;
    width: 124px;
    height: 124px;
    margin: 10px 0 10px 10px;
    line-height: 124px;
    background-color: lightgray;
    font-family: 'Amaranth', sans-serif;
    font-size: 82px;
    text-align: center;
  }
  .warp2 {
    width: 400px;
    height: 150px;
    overflow: hidden;
  }

  .test {
    height: 126px;
    width: 600px;
    overflow: hidden;
    font-size: 14px;
  }

  .test .item {
    display: flex;
    margin-top: 10px;

  }
  .test .item div {
     flex: 1;
   }
</style>
