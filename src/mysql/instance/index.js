const helper = require('think-helper');
const MysqlSocket = require('think-mysql');
const Base = require('./base');

/**
 * mysql db
 * @type {Class}
 */
module.exports = class extends Base {
  /**
   * get mysql socket instance
   * @param  {Object} config []
   * @return {}        []
   */
  socket(sql){
    if(this._socket){
      return this._socket;
    }
    let config = helper.extend({
      sql: sql
    }, this.config);
    this._socket = new MysqlSocket(config);
    return this._socket;
  }
  /**
   * get table schema
   * @param  {String} table [table name]
   * @return {Promise}       []
   */
  async getSchema(table){
    let data = await this.query(`SHOW COLUMNS FROM ${this.parseKey(table)}`);
    let ret = {};
    data.forEach(item => {
      ret[item.Field] = {
        'name': item.Field,
        'type': item.Type,
        'required': item.Null === '',
        //'default': item.Default,
        'primary': item.Key === 'PRI',
        'unique': item.Key === 'UNI',
        'auto_increment': item.Extra.toLowerCase() === 'auto_increment'
      };
    });
    return ret;
  }
  /**
   * parse key
   * @param  {String} key []
   * @return {String}     []
   */
  parseKey(key = ''){
    key = key.trim();
    if(helper.isEmpty(key)){
      return '';
    }
    if(helper.isNumberString(key)){
      return key;
    }
    if (!(/[,\'\"\*\(\)`.\s]/.test(key))) {
      key = '`' + key + '`';
    }
    return key;
  }
}