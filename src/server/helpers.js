// from https://github.com/darkskyapp/string-hash
const strHash = (str) => {
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  return hash >>> 0;
};

module.exports = { strHash };
