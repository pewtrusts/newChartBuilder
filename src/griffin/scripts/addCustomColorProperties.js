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

export function addCustomPatterns(obj){
    const { patterns, hash } = obj;
    removeStylesheet('customPatternStylesheet-' + hash);
    const decs = patterns.reduce((acc,pattern,i) => {
        if (pattern){
            return acc + `.cp-${hash} path.highcharts-color-${i}, .cp-${hash} .highcharts-legend-item.highcharts-color-${i} {
                fill: url(#pattern-${hash}-${i});
            }`;
        }
        return acc;
    }, '');
    const customPatternStylesheet = document.createElement('style');
    customPatternStylesheet.id = 'customPatternStylesheet-' + hash;
    document.head.appendChild(customPatternStylesheet); // appending first seems to work in IE11. doesn't otherwise
    customPatternStylesheet.innerText = decs;

}