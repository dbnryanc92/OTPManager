<template>
  <span
    class="onlineStatusTag"
    :class="{
      online: props.online,
      offline: props.online === false,
    }"
    >{{ statusText(props.online) }}</span
  >
</template>

<script setup lang="ts">
const props = defineProps<{ online?: boolean | undefined }>();

const statusText = function (status: boolean | undefined) {
  if (typeof status == "undefined") return "未知";
  if (status === null) return "未知";
  return status ? "線上" : "離線";
};
</script>

<style lang="scss" scoped>
.onlineStatusTag {
  border-radius: 3px;
  padding: 0 6px;
  font-size: 12px;
  text-align: center;
  border: 1px solid grey;
  color: grey;
  &.online {
    border: 1px solid green;
    color: green;
    background: rgba(0, 128, 0, 0.1);
  }
  &.offline {
    border: 1px solid red;
    color: red;
    background: rgba(128, 0, 0, 0.1);
  }
}
</style>
