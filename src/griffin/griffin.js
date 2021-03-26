import 'highcharts/css/highcharts.css';
import './css/griffin-styles.scss';
import '@Submodule/shared-css/styles.css';
import Highcharts from 'highcharts/highcharts.src.js';
/* TO DO: for production, bundle HG or use CDN? */
import options from '@Project/options.json';
/* TO DO:  should these be part of Griffin or chartBuilder? */
import addCustomColorProperties from './scripts/addCustomColorProperties';
import returnFormatter from './scripts/return-number-formatter';
import returnPointFormatter from './scripts/return-point-formatter';
import returnLegendFormatter from './scripts/return-legend-formatter';
import hash from './scripts/hash';
window.Highcharts = Highcharts;
options.plotOptions.pie.dataLabels.formatter = function () {
    return this.point.x;
};
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
        const split = cur.split('[');
        if ( split.length == 1 ){ // ie no index, not an array
            acc[cur] = i == properties.length - 1 ? value : ( acc[cur] || {} );
            return acc[cur] 
        } else {
            let prop = split[0];
            let index = parseInt(split[1]);
            acc[prop] = acc[prop] || [];
            acc[prop][index] = i == properties.length - 1 ? value : (acc[prop][index] || {});
            return acc[prop][index];
        }
    }, base);
    /**
     * TO DO: somewhere there's inconsistency with 'categorical' and 'category' axis types
     * prevent chartUpdate from redrawing until end.
     */
}
function getImage(e){
    e.preventDefault();
    const imageSource = this.parentElement.parentElement.parentElement.querySelector('picture.fullscreen source').getAttribute('srcset').split(/ \dx,? ?/)[1];
    const a = document.createElement("a");
    a.href = imageSource;
    a.setAttribute("download", 'chart.png');
    a.click();
}
const griffins = document.querySelectorAll('.js-griffin');
griffins.forEach(griffin => {
    const config = JSON.parse(griffin.querySelector('.js-griffin-config').innerHTML);
    const container = griffin.querySelector('.js-hc-container');
    const sourceNote = griffin.querySelector('.js-griffin-credit');
    const pictureContainer = griffin.querySelector('.js-picture-container');
    pictureContainer.style.display = 'none';
    const btn = document.createElement('a');
    btn.textContent = 'Download image';
    btn.href = '#';
    btn.addEventListener('click', getImage);
    sourceNote.insertAdjacentText('beforeend', ` | `);
    sourceNote.insertAdjacentElement('beforeend', btn);

    extendObj(config.highchartsConfig, ['yAxis[0]', 'labels', 'formatter'], returnFormatter(config.griffinConfig.NumberFormat));
    extendObj(config.highchartsConfig,
        ['tooltip', 'pointFormatter'], 
        returnPointFormatter({
            numberFormat: config.griffinConfig.NumberFormat,
            seriesLength: config.highchartsConfig.series.length
        })
    );
    extendObj(config.highchartsConfig, ['legend', 'labelFormatter'], returnLegendFormatter(config.highchartsConfig.chart.type));
    config.highchartsConfig.yAxis.forEach(axis => {
        axis.title.text = axis.title.text || null;
    });
    if (config.griffinConfig.SelectedColorPalette == 'custom'){
            addCustomColorProperties({
                colors: config.griffinConfig.CustomColors, 
                hash: hash(config.griffinConfig.CustomColors.join(''))
            });
        }
    
    Highcharts.chart(container, config.highchartsConfig);
});
