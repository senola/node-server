const uid = require('../../server/utils/uid');
const should = require('should');

describe('utils/uid', ()=> {
    it('返回长度为10的随机字符串', ()=> {
        uid(10).should.have.be.length(10);
    });
    it('两次返回的值不相同', ()=> {
        should(uid(10)).be.not.equal(uid(10));
    });
});

// describe('utils/uid#generate', ()=> {
//     it('返回长度为10的随机字符串', ()=> {
//         uid(10).should.have.be.length(10);
//     });
//     it('两次返回的值不相同', ()=> {
//         should(uid(10)).be.not.equal(uid(10));
//     });
// });
