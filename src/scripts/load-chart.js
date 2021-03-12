import { SelectedColorPalette, importConfig, LoadedDataConfig, newChartConfig, ChartHeight, MinHeight, Stacking } from './../store';
import { writableMap } from './../store';
import addCustomColorProperties from './../griffin/scripts/addCustomColorProperties';
function searchObject(key, obj){
    return key.split('.').reduce(function(acc,cur){
        return acc && acc[cur] !== undefined ? acc[cur] : null;
    }, obj);
}
export default function _loadChart(data = newChartConfig){ // New chart will use newChartConfig ie pass in no param
    console.log(importConfig);
    const config = JSON.parse(data.config);
    Object.keys(config.griffinConfig).forEach(key => {
        const Key = key.charAt(0).toUpperCase() + key.slice(1);
        if (importConfig[Key]){ //some griifin config is for griffin.js at runtime, not for the chartBuilder tool. ie derived values
            importConfig[Key].set(config.griffinConfig[key]);
        } else if (Key == 'ChartPaletteClassname'){
            if (config.griffinConfig[key].slice(0, 2) == 'cc' ){
                SelectedColorPalette.set('custom');
                addCustomColorProperties({
                    colors: config.griffinConfig.customColors,
                    hash: config.griffinConfig[key].replace('cc', '')
                });
            } else {
                SelectedColorPalette.set(config.griffinConfig[key]);
            }
        }
    });
    importConfig.UserOptions.set(config.highchartsConfig);
    Object.keys(writableMap).forEach(key => {
        const value = searchObject(key, config.highchartsConfig);
        if (value !== undefined) {
            console.log(writableMap);
            writableMap[key].set(value);
        }
    });
    // TO DO how to generalize setting store values from loaded config?
    ChartHeight.set(config.highchartsConfig.chart.height);
    Stacking.set(config.highchartsConfig.plotOptions.series.stacking);
    MinHeight.set(config.highchartsConfig.responsive ? config.highchartsConfig.responsive.rules[0].chartOptions.chart.height : 366);
    LoadedDataConfig.set({ series: config.highchartsConfig.series, xAxis: config.highchartsConfig.xAxis, datatableData: config.griffinConfig.datatableData});
    console.log(config);
}
