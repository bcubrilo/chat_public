<template>
  <div>
    <v-row>
      <v-col sm="12">
        <v-text-field
          append-icon="search"
          flat
          hide-details
          :label="$t('keywords')"
          solo-inverted
          v-model="keywords"
          @keyup.enter.native="search"
          @click:append="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6" class="pt-0 pb-0">
        <div style="display: flex;flex-direction: row;">
          <span style="margin: 0 20px 20px 0px;">{{$t('search-in')}}</span>
          <v-radio-group v-model="searchIn" row style="margin:0" class="ma-0 pa-0">
            <v-radio :label="$t('users')" value="users"></v-radio>
            <v-radio :label="$t('posts')" value="posts"></v-radio>
          </v-radio-group>
        </div>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6" class="pt-0 pb-0">
        <v-combobox
          v-show="searchIn==='users'"
          :label="$t('country')"
          v-model="country"
          :items="countries"
          item-text="name"
          item-value="code"
          width="100px"
          class="ma-0 pa-0"
        ></v-combobox>
        <v-row v-show="searchIn==='posts'">
          <v-col cols="6" class="pt-0 pb-0">
            <v-menu
              v-model="showDateFrom"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="100px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateFrom"
                  :label="$t('date-from')"
                  :rules="dateFromRules"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  clearable
                  class="pt-0 pb-0 mt-0 mb-0"
                ></v-text-field>
              </template>
              <v-date-picker v-model="dateFrom" @input="showDateFrom = false"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" class="pt-0 pb-0">
            <v-menu
              v-model="showDateTo"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="100px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateTo"
                  :label="$t('date-to')"
                  :rules="dateToRules"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  clearable
                  class="pt-0 pb-0 mt-0 mb-0"
                ></v-text-field>
              </template>
              <v-date-picker v-model="dateTo" @input="showDateTo = false"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
const countryList = require("country-list");
export default {
  props: {
    keywordsProp: String,
    searchInProp: {
      type: String,
      default: "users"
    },
    countryCodeProp: String,
    dateFromProp: String,
    dateToProp: String
  },
  name: "Search",
  data: () => ({
    searchPhrase: "",
    searchIn: "users",
    countries: [],
    country: null,
    dateFrom: null,
    dateTo: null,
    showDateFrom: false,
    showDateTo: false,
    keywords: ""
  }),
  computed: {
    dateFromRules() {
      return [
        v =>
          !v ||
          !this.dateTo ||
          (!!v && !!this.dateTo && v <= this.dateTo) ||
          this.$t("date-from-error")
      ];
    },
    dateToRules() {
      return [
        v =>
          !v ||
          !this.dateFrom ||
          (!!v && !!this.dateFrom && v >= this.dateFrom) ||
          this.$t("date-to-error")
      ];
    }
  },
  mounted: function() {
    this.countries = countryList.getData();
    this.searchIn = this.searchInProp;
    this.keywords = this.keywordsProp;
    this.countryCode = this.countryCodeProp;
    if (this.dateFromProp) this.dateFrom = this.dateFromProp;
    if (this.dateToProp) this.dateTo = this.dateToProp;
    if (this.countryCode) {
      this.country = {
        code: this.countryCode,
        name: countryList.getName(this.countryCode)
      };
    }
  },
  methods: {
    search() {
      console.log("emit on-search");
      this.$emit("on-search", {
        searchIn: this.searchIn,
        keywords: this.keywords,
        countryCode: this.country ? this.country.code : null,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo
      });
      // if (this.dateFrom && this.dateTo && this.dateFrom > this.dateTo) {
      //   return;
      // }
      // this.$router.push({
      //   name: "search",
      //   params: {
      //     searchIn: this.searchIn,
      //     keywords: this.keywords,
      //     countryCode: this.country ? this.country.code : null,
      //     dateFrom: this.dateFrom,
      //     dateTo: this.dateTo
      //   }
      // });
    }
  }
};
</script>