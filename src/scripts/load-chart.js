import { importConfig, LoadedDataConfig } from './../store';
export default function _loadChart(data){
    console.log(importConfig);
    const config = JSON.parse(data.config);
    Object.keys(config.griffinConfig).forEach(key => {
        const Key = key.charAt(0).toUpperCase() + key.slice(1);
        if (importConfig[Key]){ //some griifin config is for griffin.js at runtime, not for the chartBuilder tool. ie derived values
            importConfig[Key].set(config.griffinConfig[key]);
        }
    });
    importConfig.UserOptions.set(config.highchartsConfig);
    LoadedDataConfig.set({ series: config.highchartsConfig.series, xAxis: config.highchartsConfig.xAxis});
    console.log(config);
}