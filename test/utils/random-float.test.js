const randomFloat = require('../../utils/random-float');
const should = require('should');

describe("utils/random-float",function() {
    it('返回[0, 9]区间内的随机浮点数 >= 0', function() {
        should(randomFloat(0, 9)).be.aboveOrEqual(0);
    });
    it('返回[0, 9]区间内的随机浮点数 <= 9', function() {
        should(randomFloat(0, 9)).be.belowOrEqual(9);
    });
    it('返回[0, 9]区间内的随机浮点数', function() {
        let num = randomFloat(0, 9);
        should(Math.floor(num) === num).be.false();
    });
})
