import _ from "lodash";
import imagesData from "emoji-datasource-apple/emoji.json";

const result = [];
_.each(imagesData, data => {
  result[data.unified] = data;
});

export default result;
