const FlyJsonOdm = require('fly-json-odm');
const es = require('event-stream');
const jsonStream = require('JSONStream');
const fs = require('fs');

class FlyJsonStream {

    constructor() {
        this._odm = new FlyJsonOdm();
    }

    /**
     * Get json odm
     * @return {unirest}
     */
    get odm() {
        return this._odm;
    }

    /**
     * Determine is function
     * @param {function} fn
     * @return {bool} 
     */
    _isFunction(fn) {
        return (typeof fn === "function");
    }

    /**
     * Load file json
     * @param {string} filePath     this is the file path of file json   
     * @param {fn} callback         [optional] callback(error, data)
     * @return {promise|callback}
     */
    loadFile(filePath,callback) {
        var self = this;
        self._odm.clean();
        var promise = new Promise((resolve,reject) => {
            fs.createReadStream(filePath,{flag:'w+'})
                .pipe(jsonStream.parse())
                .pipe(
                    es.mapSync(function(line) {
                        self._odm.data1.push(line);
                    })
                )
                .on('error',function(err) {
                    reject(err);
                })
                .on('end', function() {
                    resolve({
                        status:true,
                        message:'Load data finished!'
                    });
                });
        });

        if(self._isFunction(callback)) {
            return promise.then(result => {
                callback(null,result);
            }, error => {
                callback(error);
            });
        }
        return promise;
    }

    /**
     * Load json array
     * @param {array} array         this is the json array   
     * @param {fn} callback         [optional] callback(error, data)
     * @return {promise|callback}
     */
    loadArray(array,callback) {
        var self = this;
        self._odm.clean();
        var promise = new Promise((resolve,reject) => {
            es.readArray(array)
                .pipe(
                    es.mapSync(function(line) {
                        self._odm.data1.push(line);
                    })
                )
                .on('error',function(err) {
                    reject(err);
                })
                .on('end', function() {
                    resolve({
                        status:true,
                        message:'Load data finished!'
                    });
                });
        });

        if(self._isFunction(callback)) {
            return promise.then(result => {
                callback(null,result);
            }, error => {
                callback(error);
            });
        }
        return promise;
    }

    /**
     * Join file json
     * @param {string} filePath     this is the file path of file json   
     * @param {string} name         join identifier name
     * @param {fn} callback         [optional] callback(error, data)
     * @return {promise|callback}
     */
    joinFile(filePath,name,callback) {
        var self = this;
        self._odm.name = name;
        self._odm.scope = 'join';
        var promise = new Promise((resolve,reject) => {
            fs.createReadStream(filePath,{flag:'w'})
                .pipe(jsonStream.parse())
                .pipe(
                    es.mapSync(function(line) {
                        self._odm.data2.push(line);
                    })
                )
                .on('error',function(err) {
                    reject(err);
                })
                .on('end', function() {
                    resolve({
                        status:true,
                        message:'Load data finished!'
                    });
                });
        });

        if(self._isFunction(callback)) {
            return promise.then(result => {
                callback(null,result);
            }, error => {
                callback(error);
            });
        }
        return promise;
    }

    /**
     * Join json array
     * @param {array} array         this is the json array   
     * @param {string} name         join identifier name
     * @param {fn} callback         [optional] callback(error, data)
     * @return {promise|callback}
     */
    joinArray(array,name,callback) {
        var self = this;
        self._odm.name = name;
        self._odm.scope = 'join';
        var promise = new Promise((resolve,reject) => {
            es.readArray(array)
                .pipe(
                    es.mapSync(function(line) {
                        self._odm.data2.push(line);
                    })
                )
                .on('error',function(err) {
                    reject(err);
                })
                .on('end', function() {
                    resolve({
                        status:true,
                        message:'Load data finished!'
                    });
                });
        });

        if(self._isFunction(callback)) {
            return promise.then(result => {
                callback(null,result);
            }, error => {
                callback(error);
            });
        }
        return promise;
    }

    /**
     * Save json to file
     * @param {string} filePath     this is the file path of file json   
     * @param {fn} callback         [optional] callback(error, data)
     * @return {promise|callback}
     */
    save(filePath, callback) {
        var self = this;
        const writer = fs.createWriteStream(filePath,{flag:'w'});
        var promise = new Promise((resolve,reject) => {
            es.readArray(self._odm.data1)
                .pipe(
                    es.stringify()
                )
                .pipe(writer);
            writer.on('error',function(err) {
                reject(err);
            });
            writer.on('finish', function() {
                resolve({
                    status:true,
                    message:'Save data finished!'
                });
            });
        });
        
        if(self._isFunction(callback)) {
            return promise.then(result => {
                callback(null,result);
            }, error => {
                callback(error);
            });
        }
        return promise;
    }

    /**
     * Drop or delete file json
     * @param {string} filePath     this is the file path of file json
     * @param {fn} callback         [optional] callback(error, data)
     */
    drop(filePath,callback) {
        var self = this;
        fs.unlink(filePath, function (err) {
            if(self._isFunction(callback)) {
                if(err) return callback(err);
                callback(null,{
                    status:true,
                    message:'Data has been dropped!'
                });
            }
        });
    }
}

module.exports = FlyJsonStream;