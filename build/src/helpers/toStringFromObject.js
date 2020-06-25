const parseObjecToString = (object) => {
  const string = Object.keys(object)
    .map((key, i) => (i === 0 ? `?${key}=${object[key]}` : `${key}=${object[key]}`))
    .reduce((sum, n) => `${sum}&${n}`);

  return string;
};

export default parseObjecToString;
