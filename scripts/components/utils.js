export const capFirst = (word) => {
  if (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  } else {
    return '';
  }
};

export const fillNa = (value, filler = '') => {
  if (value) {
    return value;
  } else {
    return filler;
  }
};

export const getSortByString = (attr, ascending = true) => {
  if (ascending) {
    return (a, b) => {
      if (fillNa(a[attr], 'zzz') < fillNa(b[attr], 'zzz')) {
        return -1;
      }
      if (fillNa(a[attr], 'zzz') > fillNa(b[attr], 'zzz')) {
        return 1;
      }
      return 0;
    };
  } else {
    return (a, b) => {
      if (fillNa(a[attr], 'zzz') > fillNa(b[attr], 'zzz')) {
        return -1;
      }
      if (fillNa(a[attr], 'zzz') < fillNa(b[attr], 'zzz')) {
        return 1;
      }
      return 0;
    };
  }
};

export const getSortByNumber = (attr, ascending = true) => {
  if (ascending) {
    return (a, b) => {
      return fillNa(a[attr], 9999999) - fillNa(b[attr], 9999999);
    };
  } else {
    return (a, b) => {
      return fillNa(b[attr], 9999999) - fillNa(a[attr], 9999999);
    };
  }
};
