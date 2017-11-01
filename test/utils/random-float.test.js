const randomFloat = require('../../utils/random-float');
const should = require('should');

describe('utils/random-float', ()=> {
    it('返回[0, 9]区间内的随机浮点数 >= 0', ()=> {
        should(randomFloat(0, 9)).be.aboveOrEqual(0);
    });
    it('返回[0, 9]区间内的随机浮点数 <= 9', ()=> {
        should(randomFloat(0, 9)).be.belowOrEqual(9);
    });
    it('返回[0, 9]区间内的随机浮点数', ()=> {
        const num = randomFloat(0, 9);

        should(Math.floor(num) === num).be.false();
    });
});
