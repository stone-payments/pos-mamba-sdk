const formatMoney = n => {
  if (typeof n === 'number') {
    n = n.toFixed(2);
  }

  return n
    .toString()
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default formatMoney;
