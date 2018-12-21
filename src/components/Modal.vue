<template>
    <div>
      <div class="md-modal modal-msg md-modal-transition" :class="{'md-show': modalShow}">
        <div class="md-modal-inner">
          <div class="md-top">
            <button class="md-close" @click="hideModal">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <slot name="message"></slot>
            </div>
            <div class="btn-wrap">
              <slot name="btnGroup"></slot>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="modalShow" @click="hideModal"></div>
    </div>
</template>

<script>
    export default {
      props: ['modalShow'],
      methods: {
        hideModal() {
          this.$emit('hideModal');
        }
      }
    }
</script>

<style scoped>

</style>
