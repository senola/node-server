const uid = require('../../utils/uid');
const should = require('should');

describe("utils/uid",function() {
    it('返回长度为10的随机字符串', function() {
        (uid(10)).should.have.be.length(10);
    });
    it('两次返回的值不相同', function() {
        should(uid(10)).be.not.equal(uid(10));
    });
});
