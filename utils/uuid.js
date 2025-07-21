
/**
 * 生成指定长度的uuid
 * @param {number} = 长度
*/
export function generateUUID(length = 36) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  const validLength = Math.max(1, Math.floor(Number(length)) || 36);
  for (let i = 0; i < validLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}