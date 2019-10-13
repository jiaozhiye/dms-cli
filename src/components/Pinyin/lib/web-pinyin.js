import dictZiWeb from '../data/dict-zi-web';
import Pinyin from './pinyin';

// 解压拼音库。
// @param {Object} dict_combo, 压缩的拼音库。
// @param {Object} 解压的拼音库。
const buildPinyinCache = dict_combo => {
  let hans;
  let uncomboed = {};

  for (let py in dict_combo) {
    hans = dict_combo[py];
    for (let i = 0, han, l = hans.length; i < l; i++) {
      han = hans.charCodeAt(i);
      if (!uncomboed.hasOwnProperty(han)) {
        uncomboed[han] = py;
      } else {
        uncomboed[han] += ',' + py;
      }
    }
  }

  return uncomboed;
};

const PINYIN_DICT = buildPinyinCache(dictZiWeb);
const pinyin = new Pinyin(PINYIN_DICT);

const STYLE_NORMAL = Pinyin.STYLE_NORMAL;
const STYLE_TONE = Pinyin.STYLE_TONE;
const STYLE_TONE2 = Pinyin.STYLE_TONE2;
const STYLE_TO3NE = Pinyin.STYLE_TO3NE;
const STYLE_INITIALS = Pinyin.STYLE_INITIALS;
const STYLE_FIRST_LETTER = Pinyin.STYLE_FIRST_LETTER;

export { STYLE_NORMAL, STYLE_TONE, STYLE_TONE2, STYLE_TO3NE, STYLE_INITIALS, STYLE_FIRST_LETTER };
export default pinyin.convert.bind(pinyin);

// module.exports.compare = pinyin.compare.bind(pinyin);
// module.exports.STYLE_NORMAL = Pinyin.STYLE_NORMAL;
// module.exports.STYLE_TONE = Pinyin.STYLE_TONE;
// module.exports.STYLE_TONE2 = Pinyin.STYLE_TONE2;
// module.exports.STYLE_TO3NE = Pinyin.STYLE_TO3NE;
// module.exports.STYLE_INITIALS = Pinyin.STYLE_INITIALS;
// module.exports.STYLE_FIRST_LETTER = Pinyin.STYLE_FIRST_LETTER;
