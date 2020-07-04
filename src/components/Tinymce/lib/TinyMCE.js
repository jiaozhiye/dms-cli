/*
 * @Author: 焦质晔
 * @Date: 2020-06-13 12:52:23
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-13 12:53:05
 */
var getGlobal = function() {
  return typeof window !== 'undefined' ? window : global;
};
var getTinymce = function() {
  var global = getGlobal();
  return global && global.tinymce ? global.tinymce : null;
};
export { getTinymce };
