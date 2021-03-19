import { HCStores, s, resetWritables } from './../store';
//import addCustomColorProperties from './../griffin/scripts/addCustomColorProperties';
function searchObject(key, obj){
    return key.split('.').reduce(function(acc,cur){
        const split = cur.split('[');
        if (split.length == 1) { // ie no index, not an array
            return acc && acc[cur] !== undefined ? acc[cur] : null;
        } else {
            let prop = split[0];
            let index = parseInt(split[1]);
            return acc && acc[prop] && acc[prop][index] ? acc[prop][index] : null;
        }
    }, obj);
}
export default function _loadChart(data){
    const storesToSet = [];
    resetWritables(); 
    const config = JSON.parse(data.config);
    const HCConfig = config.highchartsConfig;
    const griffinConfig = config.griffinConfig;
    const lastStoresToSet = [s.ChartSeries, s.ColorIndeces];
    HCStores.forEach(store => {
        const value = searchObject(store[2], HCConfig); // store[2] is the stringified rep of the property, ie, `chart.type`
        if ( value !== null ) {
            storesToSet.push([s[store[0]], value]);
        }
    });
    Object.keys(griffinConfig).forEach(key => {
        if (s[key] && s[key].set ){
            storesToSet.push([s[key], griffinConfig[key]]);
        }
        // TODO: figure out chartPalette classname etc
    });
    function sortStores(a,b){
        return lastStoresToSet.indexOf(a) - lastStoresToSet.indexOf(b);
    }
    storesToSet.sort(sortStores).forEach(d => {
        if (d[0] !== s.ChartSeries && d[0] !== s.ColorIndeces){
            d[0].set(d[1]);
        } else {
            window.requestIdleCallback(() => {
                d[0].set(d[1]);
            }, {timeout: 1000})
        }
    });
}

/*


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
            
            writableMap[key].set(value);
        }
    });
    // TO DO how to generalize setting store values from loaded config?
    ChartHeight.set(config.highchartsConfig.chart.height);
    Stacking.set(config.highchartsConfig.plotOptions.series.stacking);
    MinHeight.set(config.highchartsConfig.responsive ? config.highchartsConfig.responsive.rules[0].chartOptions.chart.height : 366);
    LoadedDataConfig.set({ series: config.highchartsConfig.series, xAxis: config.highchartsConfig.xAxis, datatableData: config.griffinConfig.datatableData});
    

    */