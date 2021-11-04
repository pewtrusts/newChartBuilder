/* global CanvasPngCompression */
import * as htmlToImage from 'html-to-image';
import 'canvas-png-compression';
import { s } from './../store';
CanvasPngCompression.replaceToDataURL();
const placeholderPNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAEaCAYAAADnmKV4AAAACXBIWXMAABYlAAAWJQFJUiTwAAAP6UlEQVR4nO3dLZTkxNcH4PCevwEJEiRIkGCxWJAgF4tdu3YtFiRIsFgsSJAgQYIEOe+5e+bOqS3SSbo76encfp5z5sDOpKvzUZVfPqqSV+7u7u4GAGDX/s / mA4D9 + 18uwdOnT21OANiZ58 + fv5hhZ + gAUIBAB4ACBDoAFCDQAaAAgQ4ABQh0AChAoANAAQIdAAoQ6ABQgEAHgAIEOgAUINABoACBDgAFCHQAKECgA0ABAh0AChDoAFCAQAeAAgQ6ABQg0AGgAIEOAAUIdAAoQKADQAECHQAKEOgAUIBAB4ACBDoAFCDQAaAAgQ4ABQh0AChAoANAAQIdAAoQ6ABQgEAHgAIEOgAUINABoACBDgAFCHQAKECgA0ABAh0AChDoAFCAQAeAAgQ6ABQg0AGgAIEOAAUIdAAoQKADQAECHQAKEOgAUIBAB4ACBDoAFCDQAaAAgQ4ABQh0AChAoANAAQIdAAoQ6ABQgEAHgAIEOgAUINABoACBDgAFCHQAKECgA0ABAh0AChDoAFCAQAeAAgQ6ABQg0AGgAIEOAAUIdAAoQKADQAECHQAKEOgAUIBAB4ACBDoAFCDQAaAAgQ4ABQh0AChAoANAAQIdAAoQ6ABQgEAHgAIEOgAUINABoACBDgAFCHQAKECgA0ABAh0AChDoAFCAQAeAAv5nI7KWV199dfjggw + Gt99 + e3jrrbde / Dv8 + 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';
// polyfill to add PNG compression level to Canvas toDataUri method
// 0 => high compression; 1 => none;

export default function _getImageData(){
    const fullscreenContainer = document.querySelector('.js-griffin.js-fullscreen');
    const fullscreenChart = document.querySelector('.js-griffin.js-fullscreen .js-griffin-container');
    const fsDek = fullscreenChart.querySelector('.figure-dek');
    const mobileContainer = document.querySelector('.js-griffin.js-mobile');
    const mobileChart = document.querySelector('.js-griffin.js-mobile .js-griffin-container');
    const mbDek = mobileChart.querySelector('.figure-dek');

    const fs = {
        contHeight: fullscreenContainer.offsetHeight,
        chartTop: fullscreenChart.offsetTop,
        chartHeight: fullscreenChart.offsetHeight,
        chartWidth: fullscreenChart.offsetWidth,
        hedHeight: fsDek.offsetHeight
    };
    const mb = {
        contHeight: mobileContainer.offsetHeight,
        chartTop: mobileChart.offsetTop,
        chartHeight: mobileChart.offsetHeight,
        chartWidth: mobileChart.offsetWidth,
        hedHeight: mbDek.offsetHeight
    }; 
    const fsMargins = `margin-top: -${100 * (( fs.chartTop + fs.hedHeight ) / fs.chartWidth)}%;margin-bottom: -${100 * ((fs.contHeight - (fs.chartTop + fs.chartHeight)) / fs.chartWidth)}%;`;
    const mbMargins = `margin-top: -${100 * (( mb.chartTop + mb.hedHeight ) / mb.chartWidth)}%;margin-bottom: -${100 * ((mb.contHeight - (mb.chartTop + mb.chartHeight)) / mb.chartWidth)}%;`;
    const promises = [
        htmlToImage.toCanvas(fullscreenContainer, {
            pixelRatio: 2,
            backgroundColor: '#fff',
            filter(node){
                if (node.classList){
                    return !node.classList.contains('griffin-download-btn');
                }
                return true;
            }
        }),
        htmlToImage.toCanvas(fullscreenContainer, {
            pixelRatio: 1,
            backgroundColor: '#fff',
            filter(node){
                if (node.classList){
                    return !node.classList.contains('griffin-download-btn');
                }
                return true;
            }
        }),
        htmlToImage.toCanvas(mobileContainer, {
            pixelRatio: 2,
            backgroundColor: '#fff',
            filter(node){
                if (node.classList){
                    return !node.classList.contains('griffin-download-btn');
                }
                return true;
            }
        }),
        htmlToImage.toCanvas(mobileContainer, {
            pixelRatio: 1,
            backgroundColor: '#fff',
            filter(node){
                if (node.classList){
                    return !node.classList.contains('griffin-download-btn');
                }
                return true;
            }
        }),
        htmlToImage.toCanvas(fullscreenChart, {
            pixelRatio: 1,
            backgroundColor: '#fff',
            canvasWidth: 180,
            canvasHeight: 180 * (fs.chartHeight / fs.chartWidth),
            filter(node){
                return !['figure-dek','figure-caption'].some(d => node.classList && node.classList.contains(d));
            }
        }),
    ];
    return Promise.all(promises).then(([full2,full1,mobile2,mobile1, thumbnail]) => {
        s.Picture.set(`
        <picture class="fullscreen">
            <source srcset="${full1.toDataURL("image/png", 0)} 1x, ${full2.toDataURL("image/png", 0)} 2x"> 
            <img style="${fsMargins}" width="100%" src="${full1.toDataURL("image/png", 0)}">
        </picture>
        <picture class="mobile">
            <source srcset="${mobile1.toDataURL("image/png", 0)} 1x, ${mobile2.toDataURL("image/png", 0)} 2x">
            <img style="${mbMargins}" width="100%" src="${mobile1.toDataURL("image/png", 0)}">
        </picture>
        `);
        s.Thumbnail.set(thumbnail.toDataURL("image/webp").length < 50000 ? thumbnail.toDataURL("image/webp") : placeholderPNG );
        s.IsWorking.set(false);
        s.PictureIsMissingOrOld.set(false);
    });
}