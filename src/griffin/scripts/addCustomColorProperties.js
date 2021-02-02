function removeStylesheet(id){
    var stylesheet = document.getElementById(id);
    if ( stylesheet ){
        document.head.removeChild(stylesheet);
    }
}
export default function _addCustomColorProperties({colors, hash}){
    removeStylesheet('customColorStylesheet-' + hash);
    const customProps = colors.reduce(function(acc,cur,i){
        return acc + `--color-${i}: ${cur};`;
    },'');
    const customColorStylesheet = document.createElement('style');
    customColorStylesheet.id = 'customColorStylesheet-' + hash;
    document.head.appendChild(customColorStylesheet); // appending first seems to work in IE11. doesn't otherwise
    customColorStylesheet.innerText = `.cc${hash}{${customProps}}`;
}