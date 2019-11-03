const assert = require('assert');
const FJS = require('../src/flyjsonstream');
const path = require('path');

describe('Intentional failure test', function() {

    it('drop with wrong file path', function() {
        var nosql = new FJS();
        nosql.drop('test/fixtures/saved.nosqls',function(err,data) {
            assert.notEqual(err,null);
        });
    });

});
