function sum(val1, val2) {
  return val1 + val2;
}

it('sums numbers', () => {
  expect(sum(1, 2)).toEqual(3);
  expect(sum(2, 2)).toEqual(4);
});