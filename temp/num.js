const num = new Float64Array(1);
num[0] = 1.2;

const num1 = new Float64Array(1);
num1[0] = -1.2;


const bytes = new Uint8Array(num.buffer);
const bytes1 = new Uint8Array(num1.buffer);

const v = [...bytes].map((i) => {
  const binary = i.toString(2);
  return binary.padStart(8, '0');
}).reverse();

// 8个字节(Byte) 64位(bit)
// 第1位 符号位
// 第2到第11位 指数为 Exponent
// 减去基准值 10个1  1111111111
// 小于 0 时，指数为 负
// 大于 0 时，指数为 正
// 剩余的 52 位 有效数字 fraction
// 12~64 之前要补充一个隐藏的 1
// 二进制 默认 以 1开头
// 实际上是有 53位
// 所以 64位 表示 =   符号位(1) + 指数位(2~11) + 有效数字(12~64)


const v1 = [...bytes1].map((i) => {
  const binary = i.toString(2);
  return binary.padStart(8, '0');
}).reverse();

console.log(num, bytes, v);
console.log(num1, bytes1, v1);