import { SelectedColorPalette, importConfig, LoadedDataConfig } from './../store';
import addCustomColorProperties from './../griffin/scripts/addCustomColorProperties';
export default function _loadChart(data){
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
            }
        }
    });
    importConfig.UserOptions.set(config.highchartsConfig);
    LoadedDataConfig.set({ series: config.highchartsConfig.series, xAxis: config.highchartsConfig.xAxis});
    console.log(config);
}