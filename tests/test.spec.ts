import { expect } from 'chai';
import { add } from '../src/index';

describe('Test', () => {
  it('should return 3', () => {
    expect(add(1, 2)).to.equal(3);
  });
  it('should return 5', () => {
    expect(add(2, 3)).to.equal(5);
  });
});