const assert = require('assert');
const DB = require('../src/flyjsondb');
const path = require('path');

describe('Query from file test', function() {

    it('read file', function(done) {
        var nosql = new DB();
        nosql.loadFile(path.join('test/fixtures/data1.nosql'),function(err,data) {
            if(err) return console.log(err);
            assert.deepEqual(nosql.odm.exec(),[ { user_id: 1, name: 'budi', age: 10 },
            { user_id: 5, name: 'wawan', age: 20 },
            { user_id: 3, name: 'tono', age: 30 } ]);
            done();
        });
    });

    it('read file promise way', function(done) {
        var nosql = new DB();
        nosql.loadFile(path.join('test/fixtures/data1.nosql')).then(data => {
            assert.deepEqual(nosql.odm.exec(),[ { user_id: 1, name: 'budi', age: 10 },
            { user_id: 5, name: 'wawan', age: 20 },
            { user_id: 3, name: 'tono', age: 30 } ]);
            done();
        });
    });

    it('read file + join merge', function(done) {
        var nosql = new DB();
        nosql.loadFile(path.join('test/fixtures/data1.nosql'),function(err,data) {
            if(err) return console.log(err);
            nosql.joinFile('test/fixtures/data2.nosql','profile',function(err,data) {
                if(err) return console.log(err);
                var result = nosql.odm.merge('user_id','id').exec();
                assert.deepEqual(result[0].user_id,1);
                assert.deepEqual(result[0].id,1);
                done();
            })
        });
    });

    it('read file + join merge promise way', function(done) {
        var nosql = new DB();
        nosql.loadFile(path.join('test/fixtures/data1.nosql')).then(data => {
            nosql.joinFile('test/fixtures/data2.nosql','profile').then(data => {
                var result = nosql.odm.merge('user_id','id').exec();
                assert.deepEqual(result[0].user_id,1);
                assert.deepEqual(result[0].id,1);
                done();
            });
        });
    });

    it('read file + join merge + save', function(done) {
        var nosql = new DB();
        nosql.loadFile(path.join('test/fixtures/data1.nosql'),function(err,data) {
            if(err) return console.log(err);
            nosql.joinFile('test/fixtures/data2.nosql','profile',function(err,data) {
                if(err) return console.log(err);
                nosql.odm.merge('user_id','id').exec();
                nosql.save('test/fixtures/saved.nosql',function(err,data) {
                    if (err) return console.log(err);
                    assert.equal(data.status,true);
                    done();
                });
            })
        });
    });

    it('read file + join merge + save promise way', function(done) {
        var nosql = new DB();
        nosql.loadFile(path.join('test/fixtures/data1.nosql')).then(data => {
            nosql.joinFile('test/fixtures/data2.nosql','profile').then(data => {
                nosql.odm.merge('user_id','id').exec();
                nosql.save('test/fixtures/saved_promise.nosql').then(data => {
                    assert.equal(data.status,true);
                    done();
                });
            });
        });
    });

    it('cleanup saved file', function(done) {
        var nosql = new DB();
        nosql.drop('test/fixtures/saved.nosql',function(err,data) {
            if(err) return console.log(err);
            assert.equal(data.status,true);
            done();
        });
    });

    it('cleanup saved file with no callback', function() {
        var nosql = new DB();
        nosql.drop('test/fixtures/saved_promise.nosql');
    });

});
