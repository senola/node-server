const uid = require('../../server/utils/uuid');
const should = require('should');

describe('utils/uuid', ()=> {
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
