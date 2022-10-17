export const capFirst = (word) => {
  if (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  } else {
    return '';
  }
};

export const getSortByString = (attr, ascending = true) => {
  if (ascending) {
    return (a, b) => {
      if (a[attr] < b[attr]) {
        return -1;
      }
      if (a[attr] > b[attr]) {
        return 1;
      }
      return 0;
    };
  } else {
    return (a, b) => {
      if (a[attr] > b[attr]) {
        return -1;
      }
      if (a[attr] < b[attr]) {
        return 1;
      }
      return 0;
    };
  }
};
export const getSortByNumber = (attr, ascending = true) => {
  if (ascending) {
    return (a, b) => {
      return a[attr] - b[attr];
    };
  } else {
    return (a, b) => {
      return b[attr] - a[attr];
    };
  }
};
