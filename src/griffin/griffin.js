import 'highcharts/css/highcharts.css';
import './css/griffin-styles.scss';
import '@Submodule/shared-css/styles.css';
import Highcharts from 'highcharts/highcharts.src.js';
/* TO DO: for production, bundle HG or use CDN? */
import options from './options.json';
/* TO DO:  should these be part of Griffin or chartBuilder? */
import addCustomColorProperties from './scripts/addCustomColorProperties';
import returnFormatter from './scripts/return-number-formatter';
import returnPointFormatter from './scripts/return-point-formatter';
import returnLegendFormatter from './scripts/return-legend-formatter';
import hash from './scripts/hash';
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
        var split, regex;
        if (currentClassName.indexOf(name) === -1) {
            split = name.split(/-\d+$/);
            if (split.length > 1 ) {
                regex = new RegExp(split[0] + '-\\d+$');
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
window.Highcharts = Highcharts;
export function extendObj(base, properties, value){
    properties.reduce(function(acc,cur,i){
        var split = cur.split('['), prop, index;
        if ( split.length == 1 ){ // ie no index, not an array
            acc[cur] = i == properties.length - 1 ? value : ( acc[cur] || {} );
            return acc[cur] 
        } else {
            prop = split[0];
            index = parseInt(split[1]);
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
    var figure = this.parentElement.parentElement.parentElement;
    if ( figure.classList.contains('js-griffin--chart-builder') ){
        return;
    }
    var imageSource = figure.querySelector('picture.fullscreen source').getAttribute('srcset').split(/ \dx,? ?/)[1];
    var chartTitle = figure.querySelector('h1');
    var chartTitleText = chartTitle ? chartTitle.textContent : '[no title]';
    var a = document.createElement("a");
    a.href = imageSource;
    a.setAttribute("download", 'chart.png');
    a.click();
    var dataLayer = window.dataLayer || null;
    if (dataLayer) {
        dataLayer.push({ 'event': 'Interactive Click', 'eventData': 'Download Griffin Image | SOTC Digital 2021 | ' + chartTitleText });
    }
}
function setObserver(anchor, container, config, pictureContainer){
    var observer = new IntersectionObserver(function(entries){
        if ( entries[0].isIntersecting ){
            pictureContainer.style.display = 'none';
            window.requestAnimationFrame(function(){
                window.Charts.push(Highcharts.chart(container, config));
            });
            observer.disconnect();
        }
    });
    observer.observe(anchor);
}
export function initSingleGriffin(griffin, i){
    var chart;
    var config = JSON.parse(griffin.querySelector('.js-griffin-config').innerHTML);
    var container = griffin.querySelector('.js-hc-container');
    var sourceNote = griffin.querySelector('.js-griffin-credit');
    var pictureContainer = griffin.querySelector('.js-picture-container');
    var anchor = griffin.querySelector('.js-griffin-anchor');
    var isLazy = griffin.classList.contains('js-griffin--lazy');
    var isChartBuilder = griffin.classList.contains('js-griffin--chart-builder');
    var btn;
    if ( pictureContainer ){
        pictureContainer.style.display = 'none';
    }
    if (!griffin.hasDownload) {
        btn = document.createElement('button');
        btn.textContent = 'Download image';
        btn.className = 'griffin-download-btn';
        btn.setAttribute('data-index', i);
        btn.setAttribute('role', 'button');
        btn.addEventListener('click', getImage);
        sourceNote.insertAdjacentElement('beforeend', btn);
        griffin.hasDownload = true;

    }

    extendObj(config.highchartsConfig, ['yAxis[0]', 'labels', 'formatter'], returnFormatter(config.griffinConfig.NumberFormat, null, config.griffinConfig.YAxisDecimals));
    extendObj(config.highchartsConfig,
        ['tooltip', 'pointFormatter'],
        returnPointFormatter({
            numberFormat: config.griffinConfig.NumberFormat,
            seriesLength: config.highchartsConfig.series.length
        })
    );
    extendObj(config.highchartsConfig, ['legend', 'labelFormatter'], returnLegendFormatter(config.highchartsConfig.chart.type));
    config.highchartsConfig.yAxis.forEach(function (axis) {
        axis.title.text = axis.title.text || null;
    });
    if (config.griffinConfig.SelectedColorPalette == 'custom') {
        addCustomColorProperties({
            colors: config.griffinConfig.CustomColors,
            hash: hash(config.griffinConfig.CustomColors.join(''))
        });
    }
    /**
     * workaround for FF bug that seems sometimes include the first letter of a subsequent <tspan>
     * in the previous one. doesn't show in DOM inspector, but does on screen
     */
    if (config.highchartsConfig.xAxis.categories && navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        config.highchartsConfig.xAxis.categories = config.highchartsConfig.xAxis.categories.map(cat => {
            return cat.replace(/ +/g, ' ').replace(/ /g, '  ');
        });
    }
    if (isLazy && window.IntersectionObserver && !isChartBuilder) {
        griffin.classList.add('lazy-load')
        console.log('lazy');
        setObserver(anchor, container, config.highchartsConfig, pictureContainer);
    } else {
        chart = Highcharts.chart(container, config.highchartsConfig);
        window.Charts.push(chart);
        return chart;
    }
}
export function init(){
    window.Charts = [];
    const griffins = document.querySelectorAll('.js-griffin');
    if (window.CSS && CSS.supports('color', 'var(--primary)')) {
        for (var i = 0; i < griffins.length; i++){
            initSingleGriffin(griffins[i],i);
        }
    }
}

init();