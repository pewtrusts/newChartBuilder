function removeStylesheet(id){
    var stylesheet = document.getElementById(id);
    if ( stylesheet ){
        document.head.removeChild(stylesheet);
    }
}
export default function _addCustomColorProperties(obj){
    var colors = obj.colors;
    var hash = obj.hash;
    removeStylesheet('customColorStylesheet-' + hash);
    var customProps = colors.reduce(function(acc,cur,i){
        return acc + '--color-'+ i + ':' + cur + ';';
    },'');
    var customColorStylesheet = document.createElement('style');
    customColorStylesheet.id = 'customColorStylesheet-' + hash;
    document.head.appendChild(customColorStylesheet); // appending first seems to work in IE11. doesn't otherwise
    customColorStylesheet.innerText = '.cc' + hash + '{' + customProps + '}';
}