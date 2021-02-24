/* global CanvasPngCompression */
import html2canvas from 'html2canvas';
import 'canvas-png-compression';
import {IsWorking, Picture, PictureIsMissingOrOld, Thumbnail} from './../store';
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
        html2canvas(fullscreenContainer, {
            scale: 2,
            onclone: function(_document){
                _document.querySelectorAll('.js-figure-wrapper').forEach(wrapper => {
                    wrapper.classList.add('image-export');
                });
            }
        }),
        html2canvas(fullscreenContainer, {
            scale: 1,
            onclone: function(_document){
                _document.querySelectorAll('.js-figure-wrapper').forEach(wrapper => {
                    wrapper.classList.add('image-export');
                });
            }
        }),
        html2canvas(mobileContainer, {
            scale: 2,
            onclone: function(_document){
                _document.querySelectorAll('.js-figure-wrapper').forEach(wrapper => {
                    wrapper.classList.add('image-export');
                });
            }
        }),
        html2canvas(mobileContainer, {
            scale: 1,
            onclone: function(_document){
                _document.querySelectorAll('.js-figure-wrapper').forEach(wrapper => {
                    wrapper.classList.add('image-export');
                });
            }
        }),
        html2canvas(mobileChart, {
            scale: 0.45,
            onclone: function (_document) {
                _document.querySelectorAll('.js-figure-wrapper').forEach(wrapper => {
                    wrapper.classList.add('image-export');
                });
            }
        }),
    ];
    return Promise.all(promises).then(([full2,full1,mobile2,mobile1, thumbnail]) => {
        Picture.set(`
        <picture class="fullscreen">
            <source srcset="${full1.toDataURL("image/webp", 0.3)} 1x, ${full2.toDataURL("image/webp", 0.3)} 2x"> 
            <img style="${fsMargins}" width="100%" src="${full1.toDataURL("image/webp", 0.3)}">
        </picture>
        <picture class="mobile">
            <source srcset="${mobile1.toDataURL("image/webp", 0.3)} 1x, ${mobile2.toDataURL("image/webp", 0.3)} 2x">
            <img style="${mbMargins}" width="100%" src="${mobile1.toDataURL("image/webp", 0.3)}">
        </picture>
        `);
        Thumbnail.set(thumbnail.toDataURL("image/png", 0));
        IsWorking.set(false);
        PictureIsMissingOrOld.set(false);
    });
}