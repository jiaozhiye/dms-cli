## 特性

- 根据词组智能匹配最正确的拼音。
- 支持多音字。
- 简单的繁体支持。
- 支持多种不同拼音风格。

## 用法

```js
import pinyin, { STYLE_INITIALS, STYLE_FIRST_LETTER } from '@/components/Pinyin/index';

console.log(pinyin('中心')); // [ [ 'zhōng' ], [ 'xīn' ] ]
console.log(
  pinyin('中心', {
    heteronym: true // 启用多音字模式
  })
); // [ [ 'zhōng', 'zhòng' ], [ 'xīn' ] ]
console.log(
  pinyin('中心', {
    heteronym: true, // 启用多音字模式
    segment: true // 启用分词，以解决多音字问题。
  })
); // [ [ 'zhōng' ], [ 'xīn' ] ]
console.log(
  pinyin('中心', {
    style: STYLE_INITIALS, // 设置拼音风格
    heteronym: true
  })
); // [ [ 'zh' ], [ 'x' ] ]
console.log(
  pinyin('中心', {
    style: STYLE_FIRST_LETTER // 设置拼音风格
  })
); // [ [ 'z' ], [ 'x' ] ]
```

## API

### 方法 `<Array> pinyin(words[, options])`

将传入的中文字符串 (words) 转换成拼音符号串。

options 是可选的，可以设定拼音风格，或打开多音字选项。

返回二维数组，第一维每个数组项位置对应每个中文字符串位置。
第二维是各个汉字的读音列表，多音字会有多个拼音项。

### 方法 `Number pinyin.compare(a, b)`

按拼音排序的默认算法。

## 参数

### `<Boolean> options.segment`

是否启用分词模式，中文分词有助于极大的降低多音字问题。
但性能会极大的下降，内存也会使用更多。

### `<Boolean> options.heteronym`

是否启用多音字模式，默认关闭。

关闭多音字模式时，返回每个汉字第一个匹配的拼音。

启用多音字模式时，返回多音字的所有拼音列表。

### `<Object> options.style`

指定拼音 风格。可以通过以下几种 `STYLE_` 开头的静态属性进行指定。

## 静态属性

### `STYLE_NORMAL`

普通风格，即不带声调。

如：`pin yin`

### `STYLE_TONE`

声调风格，拼音声调在韵母第一个字母上。

注：这是默认的风格。

如：`pīn yīn`

### `STYLE_TONE2`

声调风格 2，即拼音声调以数字形式在各个拼音之后，用数字 [0-4] 进行表示。

如：`pin1 yin1`

### `STYLE_TO3NE`

声调风格 3，即拼音声调以数字形式在注音字符之后，用数字 [0-4] 进行表示。

如：`pi1n yi1n`

### `STYLE_INITIALS`

声母风格，只返回各个拼音的声母部分。对于没有声母的汉字，返回空白字符串。

如：`中国` 的拼音 `zh g`

注：声明风格会区分 `zh` 和 `z`，`ch` 和 `c`，`sh` 和 `s`。

注意：部分汉字没有声母，如 `啊`，`饿` 等，另外 `y`, `w`, `yu` 都不是声母，
这些汉字的拼音声母风格会返回 `""`。请仔细考虑你的需求是否应该使用首字母风格。
详情请参考 [为什么没有 y, w, yu 几个声母](#为什么没有 -y-w-yu- 几个声母)

### `STYLE_FIRST_LETTER`

首字母风格，只返回拼音的首字母部分。

如：`p y`

## 参考

[npm]https://www.npmjs.com/package/pinyin
