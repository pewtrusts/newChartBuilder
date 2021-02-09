/* global CanvasPngCompression */
import html2canvas from 'html2canvas';
import 'canvas-png-compression';
import { ColorByPoint, UserOptions } from './../store';
import {ImageDataUri} from './../store';
CanvasPngCompression.replaceToDataURL();
// polyfill to add PNG compression level to Canvas toDataUri method
// 0 => high compression; 1 => none;
export default function updateChartConfig(Chart, config) {
    Chart.update(config, true, true);
    UserOptions.set(Chart.userOptions);
    ColorByPoint.set(Chart.series.map(s => s.options.colorByPoint));
    const container = document.querySelector('.griffin-figure');
    /**
     * TO DO:  for now using timeout bc update is sometimes animated
     * sometimes not. maube do on Chart.render if the params passed 
     * indicate whether it will be animated or not and for how long
     */
    setTimeout(() => {
        html2canvas(container).then((canvas) => {
            const uri = canvas.toDataURL("image/webp", 0.2);
            ImageDataUri.set(uri);
            const img = document.createElement('img');
            img.src = uri;
            document.body.appendChild(img);
        });
    }, 1000);

}