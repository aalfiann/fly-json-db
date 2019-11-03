const assert = require('assert');
const DB = require('../src/flyjsondb');

describe('Query from array test', function() {

    var data1 = [
        {user_id:1,name:"budi",age:10},
        {user_id:5,name:"wawan",age:20},
        {user_id:3,name:"tono",age:30}
    ];

    var data2 = [
        {id:1,address:"bandung",email:"a@b.com"},
        {id:2,address:"jakarta",email:"c@d.com"},
        {id:3,address:"solo",email:"e@f.com"},
        {id:4,address:"solo, balapan",email:"g@h.com"},
        {id:5,address:"surabaya",email:"i@j.com"}
    ]

    it('read array', function(done) {
        var nosql = new DB();
        nosql.loadArray(data1,function(err,data) {
            if(err) return console.log(err);
            assert.deepEqual(nosql.odm.exec(),[ { user_id: 1, name: 'budi', age: 10 },
            { user_id: 5, name: 'wawan', age: 20 },
            { user_id: 3, name: 'tono', age: 30 } ]);
            done();
        });
    });

    it('read array promise way', function(done) {
        var nosql = new DB();
        nosql.loadArray(data1).then(data => {
            assert.deepEqual(nosql.odm.exec(),[ { user_id: 1, name: 'budi', age: 10 },
            { user_id: 5, name: 'wawan', age: 20 },
            { user_id: 3, name: 'tono', age: 30 } ]);
            done();
        });
    });

    it('read array + join merge', function(done) {
        var nosql = new DB();
        nosql.loadArray(data1,function(err,data) {
            if(err) return console.log(err);
            nosql.joinArray(data2,'profile',function(err,data) {
                if(err) return console.log(err);
                var result = nosql.odm.merge('user_id','id').exec();
                assert.deepEqual(result[0].user_id,1);
                assert.deepEqual(result[0].id,1);
                done();
            })
        });
    });

    it('read array + join merge promise way', function(done) {
        var nosql = new DB();
        nosql.loadArray(data1).then(data => {
            nosql.joinArray(data2,'profile').then(data => {
                var result = nosql.odm.merge('user_id','id').exec();
                assert.deepEqual(result[0].user_id,1);
                assert.deepEqual(result[0].id,1);
                done();
            });
        });
    });

});
