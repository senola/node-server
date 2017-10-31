const safeString = require('../../utils/safe-string');
const should = require('should');

describe("utils/safe-string",function() {
    it('安全字符串', function() {
        const str = 'i will go to here <script>';
        should(safeString(str)).be.not.containEql('<')
    });

});
