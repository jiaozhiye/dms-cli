/*
 * @Author: 焦质晔
 * @Date: 2020-06-13 12:52:23
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-13 12:52:48
 */
export var editorProps = {
  apiKey: String,
  cloudChannel: String,
  id: String,
  init: Object,
  initialValue: String,
  inline: Boolean,
  modelEvents: [String, Array],
  plugins: [String, Array],
  tagName: String,
  toolbar: [String, Array],
  value: String,
  disabled: Boolean,
  tinymceScriptSrc: String,
  outputFormat: {
    type: String,
    validator: function(prop) {
      return prop === 'html' || prop === 'text';
    }
  }
};
