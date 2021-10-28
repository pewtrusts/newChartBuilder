/* global CanvasPngCompression */
import * as htmlToImage from 'html-to-image';
import 'canvas-png-compression';
import { s } from './../store';
CanvasPngCompression.replaceToDataURL();
// polyfill to add PNG compression level to Canvas toDataUri method
// 0 => high compression; 1 => none;

export default function _getImageData(){
    const fullscreenContainer = document.querySelector('.js-griffin.js-fullscreen');
    const fullscreenChart = document.querySelector('.js-griffin.js-fullscreen .js-hc-container');
    const mobileContainer = document.querySelector('.js-griffin.js-mobile');
    const mobileChart = document.querySelector('.js-griffin.js-mobile .js-hc-container');

    const fs = {
        contHeight: fullscreenContainer.offsetHeight,
        chartTop: fullscreenChart.offsetTop,
        chartHeight: fullscreenChart.offsetHeight,
        chartWidth: fullscreenChart.offsetWidth
    };
    const mb = {
        contHeight: mobileContainer.offsetHeight,
        chartTop: mobileChart.offsetTop,
        chartHeight: mobileChart.offsetHeight,
        chartWidth: mobileChart.offsetWidth
    }; 
    const fsMargins = `margin-top: -${100 * (fs.chartTop / fs.chartWidth)}%;margin-bottom: -${100 * ((fs.contHeight - (fs.chartTop + fs.chartHeight)) / fs.chartWidth)}%;`;
    const mbMargins = `margin-top: -${100 * (mb.chartTop / mb.chartWidth)}%;margin-bottom: -${100 * ((mb.contHeight - (mb.chartTop + mb.chartHeight)) / mb.chartWidth)}%;`;
    const promises = [
        htmlToImage.toJpeg(fullscreenContainer, {
            quality: 0.5,
            backgroundColor: '#fff'
        }),
        htmlToImage.toJpeg(fullscreenContainer, {
            quality: 0.5,
            backgroundColor: '#fff'
        }),
        htmlToImage.toJpeg(mobileContainer, {
            quality: 0.5,
            backgroundColor: '#fff'
        }),
        htmlToImage.toJpeg(mobileContainer, {
            quality: 0.5,
            backgroundColor: '#fff'
        }),
        htmlToImage.toJpeg(fullscreenChart, {
            quality: 0.5,
            backgroundColor: '#fff'
        }),
    ];
    return Promise.all(promises).then(([full2,full1,mobile2,mobile1, thumbnail]) => {
        s.Picture.set(`
        <picture class="fullscreen">
            <source srcset="${full1} 1x, ${full2} 2x"> 
            <img style="${fsMargins}" width="100%" src="${full1}">
        </picture>
        <picture class="mobile">
            <source srcset="${mobile1} 1x, ${mobile2} 2x">
            <img style="${mbMargins}" width="100%" src="${mobile1}">
        </picture>
        `);
        s.Thumbnail.set(thumbnail);
        s.IsWorking.set(false);
        s.PictureIsMissingOrOld.set(false);
    });
}