/* global  */
import returnNumberFormatter from './return-number-formatter';
export default function _returnLegendFormatter(type){
    if ( type !== 'pie' ){
        return function(){
            return this.name;
        };
    }
    return function(){
        return this.name + ', <b>' + returnNumberFormatter('percentage').call(this) + '</b>';
    }
}