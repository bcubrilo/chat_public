<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col lg="6" md="8" sm="12" xs="12" align-self="center">
        <v-img :src="profileImageUrl" aspect-ratio="1" class="profile-image"></v-img>
        <image-cropper @croped="uploadImage" />
        <v-dialog v-model="confirmDeleteImageDialog" max-width="290">
          <template v-slot:activator="{ on }">
            <v-btn icon class="mr-3" v-on="on">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>{{$t('are-you-sure')}}</v-card-text>
            <v-card-actions>
              <v-btn
                color="green darken-1"
                text
                @click="confirmDeleteImageDialog = false"
              >{{$t('no')}}</v-btn>
              <v-btn color="green darken-1" text @click="deleteImage">{{$t('yes')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col lg="12" md="12" sm="12" xs="12" align-self="center">
        <h2 style="text-align:center" v-show="!showNameEdit">
          {{authUser.name}}
          <v-btn icon @click="()=> {showNameEdit = true; name=authUser.name}">
            <v-icon>edit</v-icon>
          </v-btn>
        </h2>
        <v-text-field v-model="name" v-show="showNameEdit" ref="userName">
          <template slot="append">
            <v-btn icon @click="showNameEdit = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-btn icon @click="editName">
              <v-icon>check</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col>
        <v-card>
          <v-card-text>
            <div v-if="!showEditDescription" style="display:inline">
              <p>
                <v-icon>mdi-format-quote-open</v-icon>
                {{ profile.description }}
                <v-icon>mdi-format-quote-close</v-icon>
                <v-btn icon @click="editDescription">
                  <v-icon>edit</v-icon>
                </v-btn>
              </p>
            </div>
            <div v-else>
              <v-textarea outlined v-model="profileDescription"></v-textarea>
              <v-btn @click="showEditDescription = !showEditDescription">{{$t('cancel')}}</v-btn>
              <v-btn @click="updateDescription">{{$t('save')}}</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col>
        <v-card>
          <v-list-item>
            <v-list-item-content>
              <v-col cols="4">
                <label>{{$t('gender')}}</label>
              </v-col>
              <v-col cols="8">
                <v-radio-group row v-model="profile.gender" @change="genderChanged">
                  <v-radio :label="localization.masculine" value="M"></v-radio>
                  <v-radio :label="localization.feminine" value="F"></v-radio>
                </v-radio-group>
              </v-col>
              <v-divider />
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-col cols="4">
                <label>{{$t('interested-in-gender')}}</label>
              </v-col>
              <v-col cols="8">
                <v-radio-group
                  row
                  v-model="profile.interestedInGender"
                  @change="interestedInGenderChanged"
                >
                  <v-radio :label="$t('masculine')" value="M" />
                  <v-radio :label="$t('feminine')" value="F" />
                  <v-radio :label="$t('both')" value="B" />
                </v-radio-group>
              </v-col>
              <v-divider />
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-col cols="4">
                <label>{{$t('country')}}</label>
              </v-col>
              <v-col cols="8">
                <v-combobox
                  v-model="userCountry"
                  :items="countries"
                  item-text="name"
                  item-value="code"
                  v-on:change="changedCountry"
                ></v-combobox>
              </v-col>
              <v-divider />
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-col cols="4">
                <label>{{$t('languages')}}</label>
              </v-col>
              <v-col cols="8">
                <v-combobox
                  v-model="userLanguages"
                  :items="languages"
                  item-text="nativeName"
                  item-value="code"
                  v-on:change="changedLanguage"
                  multiple
                >
                  <template v-slot:selection="{ attrs, item, select, selected }">
                    <v-chip
                      v-bind="attrs"
                      :input-value="selected"
                      close
                      @click="select"
                      @click:close="removeLanguage(item)"
                    >
                      <strong>{{ item.name }}</strong>&nbsp;
                    </v-chip>
                  </template>
                </v-combobox>
              </v-col>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-expansion-panels v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header>{{$t('settings')}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="12">
              <label class="label">{{$t('email')}}</label>
              <p v-if="!changeEmailVisible">
                {{ authUser.email }}
                <v-btn icon @click="changeEmailVisible = !changeEmailVisible">
                  <v-icon>edit</v-icon>
                </v-btn>
              </p>
              <v-text-field
                :value="authUser.email"
                dense
                ref="userEmail"
                v-if="changeEmailVisible"
                :rules="[v => !v || /.+@.+\..+/.test(v) || localization.emailNotValid]"
              >
                <template slot="append">
                  <v-btn icon @click="editEmail">
                    <v-icon color="green">done</v-icon>
                  </v-btn>
                  <v-btn icon @click="changeEmailVisible=false">
                    <v-icon color="red">close</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <label>{{$t('app-language')}}</label>
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="appLanguage"
                :items="languages"
                item-text="nativeName"
                item-value="code"
                v-on:change="changedAppLanguage"
              ></v-combobox>
            </v-col>
          </v-row>
          <v-row>
            <v-form ref="changePasswordForm" style="width:100%">
              <v-col cols="12">
                <label class="label">{{$t('change-password')}}</label>
              </v-col>
              <v-col cols="12" xs="12" sm="6" lg="3">
                <v-text-field
                  type="password"
                  :label="localization.currentPassword"
                  required
                  :rules="passwordRules"
                  ref="oldPassword"
                  dense
                />
              </v-col>

              <v-col cols="12" xs="12" sm="12" lg="3">
                <v-text-field
                  type="password"
                  :label="localization.newPassword"
                  required
                  :rules="passwordRules"
                  ref="newPassword"
                  dense
                />
              </v-col>
              <v-col cols="12" xs="12" sm="6" lg="3">
                <v-text-field
                  type="password"
                  :label="localization.newPasswordRepeated"
                  required
                  :rules="passwordRules"
                  ref="newPasswordRepeated"
                  dense
                />
              </v-col>
              <v-col cols="12">
                <v-btn @click="changeUserPassword">{{$t('change')}}</v-btn>
              </v-col>
            </v-form>
          </v-row>
          <v-row></v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>{{$t('your-likes')}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <profile-likes />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>{{$t('who-liked-your-profile')}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <profile-likes show-my-profile-likes />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script>
import AvatarCropper from "vue-avatar-cropper";
import { mapState, mapActions, mapGetters } from "vuex";
import { Cropper } from "vue-advanced-cropper";
import DefaultLayout from "../layouts/DefaultLayout";
const countryList = require("country-list");
import ISO6391 from "iso-639-1";

export default {
  name: "UserProfilePage",
  components: { AvatarCropper },
  data: () => ({
    imageUrl:
      "http://localhost:3030/images/53_a95dcc73e6d09630f7ddba20de9e879f.jpg",
    showEditDescription: false,
    profileDescription: "",
    showImageUploadDialog: false,
    uploadedImage: null,
    gender: "M",
    countries: [],
    userCountry: { code: "", name: "" },
    userAvatar: undefined,
    confirmDeleteImageDialog: false,
    languages: [],
    userLanguages: [],
    localization: {
      masculine: "",
      feminine: "",
      submit: "",
      cancel: "",
      selectCountry: "",
      selectLanguage: ""
    },
    panel: [1],
    changeNameVisible: false,
    changeEmailVisible: false,

    appLanguage: "",
    name: "",
    showNameEdit: false
  }),
  created() {
    this.$emit("update:layout", DefaultLayout);
  },
  computed: {
    ...mapState({
      authUser: state => state.auth.user,
      profile: state => state.userProfile.profile
    }),
    ...mapGetters({
      profileImageUrl: "userProfile/profileImage"
    }),
    uploadImageButtonDisabled() {
      return this.uploadedImage == null;
    },
    emailRules() {
      return [v => !v || /.+@.+\..+/.test(v) || this.$t("email-must-be-valid")];
    },
    passwordRules() {
      return [
        v => !!v || this.localization.passwordRequired,
        v =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_=;,<>!~?@#$%^&*])(?=.{8,})/.test(
            v
          ) || this.localization.passwordRules
      ];
    }
  },
  methods: {
    ...mapActions("userProfile", [
      "getProfile",
      "updateProfile",
      "uploadProfileImage",
      "deleteProfileImage",
      "updateUser",
      "changePassword"
    ]),
    ...mapActions("auth", ["updateEmail"]),
    updateDescription() {
      this.updateProfile({
        field: "description",
        value: this.profileDescription
      });
      this.showEditDescription = false;
    },
    editDescription() {
      this.showEditDescription = true;
      this.profileDescription =
        this.profile != null ? this.profile.description : "";
    },
    uploadImage(image) {
      const data = new FormData();
      data.append("file", image);
      this.uploadProfileImage(data).then(() => console.log("OK"));
    },
    genderChanged() {
      this.updateProfile({
        field: "gender",
        value: this.profile.gender
      });
    },
    interestedInGenderChanged() {
      this.updateProfile({
        field: "interestedInGender",
        value: this.profile.interestedInGender
      });
    },
    changedCountry() {
      if (countryList.getName(this.userCountry.code)) {
        this.updateProfile({
          field: "countryCode",
          value: this.userCountry.code
        });
      }
    },
    changedLanguage() {
      var langs = [];
      if (this.userLanguages.length > 0) {
        this.$_.forEach(this.userLanguages, l => {
          if (ISO6391.validate(l.code)) {
            langs.push(l.code);
          }
        });
      }
      this.updateProfile({
        field: "languageCode",
        value: langs.length > 0 ? langs.join() : ""
      });
    },
    removeLanguage(lang) {
      if (this.userLanguages.length > 0) {
        var index = this.userLanguages.indexOf(lang);
        if (index > -1) {
          this.userLanguages.splice(index, 1);
        }
      }
      var langs = [];
      if (this.userLanguages.length > 0) {
        this.$_.forEach(this.userLanguages, l => {
          if (ISO6391.validate(l.code)) {
            langs.push(l.code);
          }
        });
      }
      this.updateProfile({
        field: "languageCode",
        value: langs.length > 0 ? langs.join() : ""
      });
    },
    handleUploaded(resp) {
      this.userAvatar = resp.relative_url;
    },
    handleUploading(form, xhr) {
      const data = new FormData();
      data.append("file", form.image.currentSrc);
      this.uploadProfileImage(form).then(() => console.log("OK"));
    },
    deleteImage() {
      this.confirmDeleteImageDialog = false;
      this.deleteProfileImage();
    },
    setLocalizationStrings() {
      this.localization = {
        submit: this.$t("submit"),
        cancel: this.$t("cancel"),
        masculine: this.$t("masculine"),
        feminine: this.$t("feminine"),
        selectCountry: this.$t("select-country"),
        selectLanguage: this.$t("select-language"),
        emailNotValid: this.$t("email-not-valid"),
        currentPassword: this.$t("current-password"),
        newPassword: this.$t("new-password"),
        newPasswordRepeated: this.$t("new-password-repeated"),
        passwordRequired: this.$t("password-required"),
        passwordRules: this.$t("password-rules")
      };
    },
    editName() {
      var name = this.$refs.userName.$refs.input.value;
      if (!name) return;
      this.updateUser({ field: "name", value: name });
      this.showNameEdit = false;
    },
    editEmail() {
      var box = this.$refs.userEmail;
      if (!box.valid) return;
      var email = this.$refs.userEmail.$refs.input.value;

      this.updateUser({ field: "email", value: email });
      this.changeEmailVisible = false;
    },
    changeUserPassword() {
      if (!this.$refs.changePasswordForm.validate()) return;
      this.changePassword({
        currentPassword: this.$refs.oldPassword.$refs.input.value,
        newPassword: this.$refs.newPassword.$refs.input.value,
        newPasswordRepeated: this.$refs.newPasswordRepeated.$refs.input.value
      });
    },
    changedAppLanguage() {
      this.updateUser({
        field: "appLanguageCode",
        value: this.appLanguage.code
      });
    }
  },
  mounted: function() {
    this.getProfile();
    this.setLocalizationStrings();
    if (this.profile != null) {
      if (this.profile.countryCode) {
        this.userCountry = {
          code: this.profile.countryCode,
          name: countryList.getName(this.profile.countryCode)
        };
      }
      this.countries = countryList.getData();
      this.languages = ISO6391.getLanguages(ISO6391.getAllCodes());
      if (this.profile.languageCode) {
        var langs = this.profile.languageCode.split(",");
        this.userLanguages = ISO6391.getLanguages(langs);
      }
      this.appLanguage = ISO6391.getLanguages([
        this.authUser.appLanguageCode
      ])[0];
    }
  }
};
</script>
<style scoped>
.label {
  display: block;
  font-size: 12px;
  color: darkgrey;
}
.profile-image {
  max-width: 450px;
  max-height: 450px;
  margin-left: auto;
  margin-right: auto;
  background: gray;
}
</style>