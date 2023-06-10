const fs = require('fs');
const { Buffer } = require('buffer');

// 每一位是一个字节

// 128050

// const bytes = '128050'.toString(2);

const encodeUniCode16 = (str) => {
  const bytes = [];
  for(let i = 0; i < str.length; i++) {
    const codePoint = str[i].charCodeAt(0);
    if (codePoint < (1 << 16)) {
      // 保留 低8位
      const low = codePoint & ((1 << 8) - 1);
      // 保留 高8位
      const high = codePoint >> 8;

      bytes.push(low, high);

      // bytesArray[0] = high;
      // bytesArray[1] = low;
    } else {
      // const bytesArray = new Uint8Array(4);
      // 获取最高 2 位
      // 总位数 20 位
      const high1 = (codePoint >> 18) | 0b11011000;
      const low1 = (codePoint >> 10) & ((1 << 8) - 1);
      const high2 = (codePoint >> 8) & ((1 << 2) - 1) | 0b11011100;
      const low2 = codePoint & ((1 << 8) - 1);
      bytes.push(low1, high1, low2, high2);

      // bytesArray[0] = high1;
      // bytesArray[1] = low1;
      // bytesArray[2] = high2;
      // bytesArray[3] = low2;
    }
  }
  const bytesArray = new Uint8Array(bytes.length);
  for(let i = 0; i < bytes.length; i++) {
    bytesArray[i] = bytes[i];
  }
  return bytesArray;
}

const res = encodeUniCode16('\uFEFF一')
console.log(Buffer.from(res));
fs.writeFileSync('./temp/word.txt', Buffer.from(res));
const text = fs.readFileSync('./temp/word.txt');

console.log(text);

// const t = 🐲;
// console.log(encodeUniCode16('一'));
// console.log(encodeUniCode16());