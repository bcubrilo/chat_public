<template>
  <v-dialog v-model="showDialog" persistent width="500">
    <template v-slot:activator="{ on }">
      <v-btn icon class="mr-3" v-on="on">
        <v-icon>edit</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline" primary-title>Upload new image</v-card-title>
      <v-card-text>
        <div v-if="message.length > 0" style="color:red">{{ message }}</div>

        <vue-cropper
          v-if="image != null"
          ref="cropper"
          :src="image"
          alt="Source Image"
          :aspect-ratio="1 / 1"
          :viewMode="1"
          preview=".preview"
        ></vue-cropper>
        <div class="preview" />
        <v-file-input
          v-model="uploadedImage"
          accept="image/png, image/jpeg, image/bmp"
          label="Choose image file"
          @change="imageChanged"
        />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" :disabled="image == null" text @click="save">{{$t('save')}}</v-btn>
        <v-btn color="primary" text @click="showDialog = false">{{$t('cancel')}}</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  data: () => ({
    image: null,
    imageBase64: "",
    uploadedImage: null,
    showDialog: false,
    canvas: null,
    message: ""
  }),
  components: {
    VueCropper
  },

  computed: {},
  methods: {
    imageChanged() {
      if (this.uploadedImage != null) {
        var reader = new FileReader();
        reader.onload = e => {
          this.image = e.target.result;
        };
        reader.readAsDataURL(this.uploadedImage);
      } else {
        this.image = null;
      }
    },
    save() {
      console.log("Ovoje slika", this.$refs.cropper.getCroppedCanvas());
      var canvas = this.$refs.cropper.getCroppedCanvas();
      canvas.toBlob(blob => {
        // if (blob.size > 300000) {
        //   this.message = "Max image size is 300KB, current size " + blob.size;
        //   return;
        // } else this.message = "";
        this.$emit("croped", blob);
        this.showDialog = false;
      });
    }
  }
};
</script>
<style scoped>
.cropper {
  max-width: 500px;
  max-height: 400px;
}
</style>
