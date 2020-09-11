<template>
  <div>{{notification.content}}</div>
</template>
<script>
export default {
  props: { notification: Object },
  name: "Notification",
  data: () => ({})
};
</script>