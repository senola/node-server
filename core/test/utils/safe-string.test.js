const safeString = require('../../server/utils/safe-string');
const should = require('should');

describe('utils/safe-string', ()=> {
    it('安全字符串', ()=> {
        const str = 'i will go to here <script>';

        should(safeString(str)).be.not.containEql('<');
    });
});
