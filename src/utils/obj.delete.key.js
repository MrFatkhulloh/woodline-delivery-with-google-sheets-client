export function removeEmptyValues(obj) {
  for (let key in obj) {
    if (obj[key] === "" || obj[key] === []) {
      delete obj[key];
    }
  }

  return obj;
}