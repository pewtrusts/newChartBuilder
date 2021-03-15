import 'highcharts/css/highcharts.css';
import './css/griffin-styles.scss';
import '@Submodule/shared-css/styles.css';
import Highcharts from 'highcharts/highcharts.src.js';
/* TO DO: for production, bundle HG or use CDN? */
import options from '@Project/options.json';
/* TO DO:  should these be part of Griffin or chartBuilder? */
import addCustomColorProperties from './scripts/addCustomColorProperties';
import returnFormatter from './scripts/return-number-formatter';
window.Highcharts = Highcharts;
Highcharts.setOptions(options);
Highcharts.SVGElement.prototype.addClass = function (className, replace) {
    var currentClassName = replace ? '' : (this.attr('class') || '');
    // Trim the string and remove duplicates
    className = (className || '')
        .split(/ /g)
        .reduce(function (newClassName, name) {
            if (currentClassName.indexOf(name) === -1) {
                let split = name.split(/-\d+$/);
                if (split.length > 1 ) {
                    let regex = new RegExp(split[0] + '-\\d+$');
                    newClassName[0] = newClassName[0].replace(regex, '');
                }
                newClassName.push(name);
            }
            return newClassName;
        }, (currentClassName ?
            [currentClassName] :
            []))
        .join(' ');
    if (className !== currentClassName) {
        this.attr('class', className);
    }
    return this;
};
export function extendObj(base, properties, value){
    properties.reduce(function(acc,cur,i){
        acc[cur] = i == properties.length - 1 ? value : ( acc[cur] || {} );
        return acc[cur] 
    }, base);
    console.log(base);
    /**
     * TO DO: somewhere there's inconsistency with 'categorical' and 'category' axis types
     * prevent chartUpdate from redrawing until end.
     */
}
const griffins = document.querySelectorAll('.js-griffin');
griffins.forEach(griffin => {
    const config = JSON.parse(griffin.querySelector('.js-griffin-config').innerHTML);
    const container = griffin.querySelector('.js-hc-container');
    const formatter = returnFormatter(config.griffinConfig.numberFormat);
    extendObj(config.highchartsConfig, ['yAxis','labels','formatter'], formatter);
  //  config.highchartsConfig.yAxis.labels.formatter = formatter;
    config.highchartsConfig.title.text = config.highchartsConfig.title.text || undefined;
    container.classList.add(config.griffinConfig.chartPaletteClassname);
    if (config.griffinConfig.chartPaletteClassname.indexOf('cc') === 0 
        && config.griffinConfig.customColors.length > 0){
            addCustomColorProperties({
                colors: config.griffinConfig.customColors, 
                hash: config.griffinConfig.chartPaletteClassname.replace('cc','')
            });
        }
    
    Highcharts.chart(container, config.highchartsConfig);
});
