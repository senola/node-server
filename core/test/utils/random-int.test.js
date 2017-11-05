const randomInt = require('../../server/utils/random-int');
const should = require('should');

describe('utils/random-int', ()=> {
    it('返回[0, 9]区间内的随机整数 >= 0', ()=> {
        should(randomInt(0, 9)).be.aboveOrEqual(0);
    });
    it('返回[0, 9]区间内的随机整数 <= 9', ()=> {
        should(randomInt(0, 9)).be.belowOrEqual(9);
    });
    it('返回[0, 9]区间内的随机整数', ()=> {
        const num = randomInt(0, 9);

        should(Math.floor(num) === num).be.true();
    });
});
