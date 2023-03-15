const getNewKey = (key: string): string => (key === "_id" ? "id" : key);
const clear_id = (obj: any) => {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) clear_id(obj[i]);
  } else if (typeof obj === "object") {
    for (const key in obj) {
      const newKey = getNewKey(key);
      if (newKey !== key) obj[newKey] = obj[key].toString();

      if (key !== newKey) delete obj[key];

      clear_id(obj[newKey]);
    }
  }

  return obj;
};

export default clear_id;
