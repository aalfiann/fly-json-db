const assert = require('assert');
const DB = require('../src/flyjsondb');

describe('Intentional failure test', function() {

    it('drop with wrong file path', function() {
        var nosql = new DB();
        nosql.drop('test/fixtures/saved.nosqls',function(err,data) {
            assert.notEqual(err,null);
        });
    });

});
