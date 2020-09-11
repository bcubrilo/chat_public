import store from "../store";
import axios from "axios";
import _ from "lodash";

axios.defaults.baseURL = "http://localhost:3030";
export default {
  request(method, url, data, cb, errorCb) {
    let token = store.getters["auth/token"];

    var headers = token
      ? {
          Authorization: "Bearer " + token,
        }
      : {};

    return axios({
      method,
      url,
      data,
      headers,
    })
      .then((response) => {
        typeof cb === "function" && cb(response.data);
      })
      .catch((result) => {
        if (result.response.status === 401) {
          store.dispatch("auth/clear");
        }
        var errors;
        if (typeof result.response.data === "object") {
          errors = _.flatten(_.toArray(result.response.data));
        } else {
          errors = ["Something went wrong. Please try again."];
        }
        typeof errorCb === "function" && errorCb(errors);
      });
  },
};
