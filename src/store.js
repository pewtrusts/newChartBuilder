import hash from './griffin/scripts/hash';
import { writable, derived } from 'svelte/store';
import baseConfig from './base-chart-config.json';
const CellBeingEdited = writable(null);
const XAxisType = writable('linear');
const ChartType = writable(baseConfig.chart.type);
const ActiveSection = writable('start');
const UserOptions = writable({});
UserOptions.subscribe(v => {
    if (!v || !v.chart || !v.chart.type) return;
    ChartType.set(v.chart.type);
})
const ImageDataUri = writable('');
const SelectedColorPalette = writable('default');
const ColorIndeces = writable(undefined);
const Indicators = writable({});
const IsWorking = writable(false);
const ColorByPoint = writable([]);
const SeriesCountFromTable = writable(0); /* SeriesCountFromTable is # of series from data passed in by user.
                                             SeriesCount is # series sent to the Chart instance. e.g., pie charts
                                             only pass in one series regardless of the SeriesCountFromTable */
const CustomColors = writable([]);
const ChartCredit = writable(`© ${new Date().getFullYear()} The Pew Charitable Trusts`);
const ChartDescription = writable('');
const ChartLabel = writable('');
const ChartNotes = writable('');
const ChartTitle = writable('');
const ChartSources = writable('');
const ChartSubtitle = writable('');
const LoadedDataConfig = writable('');
const Picture = writable('');
const PictureIsMissingOrOld = writable(true);
const Thumbnail = writable('');
const SeriesCount = derived([UserOptions], ([userOptions]) => !userOptions.series ? 0 : userOptions.series.length);
const SeriesCountMismatch = derived([SeriesCountFromTable, ChartType], ([seriesCount, chartType]) => seriesCount > 1 && chartType == 'pie');
const MaxPointCount = derived([UserOptions], ([userOptions]) => {
    if ( !userOptions.series ){
        return 0;
    }
    return Math.max(...userOptions.series.map(d => d.data.length));
});
const ColorCount = derived([MaxPointCount,ColorByPoint, SeriesCount], ([maxPointCount, colorByPoint, seriesCount]) => {
    if (colorByPoint[0] == true){
        return maxPointCount;
    }
    return seriesCount;
});
const ChartPaletteClassname = derived([SelectedColorPalette,CustomColors], ([selectedPalette, customColors]) => {
    if (selectedPalette !== 'custom') return selectedPalette;
    return `cc${hash(customColors.join(''))}`;
});
const GriffinConfig = derived([
    ChartCredit,
    ChartDescription, 
    ChartLabel, 
    ChartNotes,
    ChartPaletteClassname, 
    ChartSources, 
    ChartSubtitle,
    ChartTitle,
    CustomColors, 
], ([
    chartCredit,
    chartDescription, 
    chartLabel, 
    chartNotes,
    chartPaletteClassname, 
    chartSources, 
    chartSubtitle,
    chartTitle,
    customColors, 
]) => {
    const obj =  {
        chartCredit,
        chartDescription, 
        chartLabel, 
        chartNotes,
        chartPaletteClassname, 
        chartSources, 
        chartSubtitle,
        chartTitle,
        customColors, 
    };
    delete obj.chartCredit;
    delete obj.chartDescription;
    delete obj.chartNotes;
    delete obj.chartSources;
    PictureIsMissingOrOld.set(true);
    return obj;
});
const CodeExport = derived([
    ChartCredit,
    ChartDescription, 
    ChartLabel, 
    ChartNotes,
    ChartPaletteClassname,
    ChartTitle, 
    ChartSources,
    ChartSubtitle, 
    Picture,
    UserOptions, 
    GriffinConfig
], ([
    chartCredit,
    chartDescription,
    chartLabel, 
    chartNotes,
    chartPaletteClassname,
    chartTitle, 
    chartSources,
    chartSubtitle,
    picture,
    userOptions, 
    griffinConfig
]) => {
    const hashTitle = chartTitle ? hash(chartTitle) : null;
    return `<figure${chartTitle ? ' aria-labelledby="heading-' + hashTitle + '"' : ''}${chartDescription ? ` aria-describedby="description-${hashTitle || hash(chartDescription)}"` : ''} class="ai2html-griffin-figure griffin-figure js-griffin">
    <meta name="format-detection" content="telephone=no">${ chartLabel || chartTitle || chartSubtitle ? `
    <header>${chartLabel ? `
        <span class="figure-label">${chartLabel}</span>` : ''}${chartTitle ? `
        <h1 id="heading-${hashTitle}">${chartTitle}</h1>` : ''}${chartSubtitle ? `
        <p class="figure-dek">${chartSubtitle}</p>` : ''}
    </header>` : ''}${chartDescription ? `
    <p id="description-${hashTitle ? hashTitle : hash(chartDescription)}" class="visually-hidden">${chartDescription}</p>` : ''}
    <pre class="js-griffin-config" style="display: none;">
    ${JSON.stringify({
        highchartsConfig: userOptions,
        griffinConfig 
    })}
    </pre>
    <div aria-hidden="true" class="js-hc-container hc-container ${chartPaletteClassname}">
        ${picture}
    </div>${ chartNotes || chartSources || chartCredit ? `
    <figcaption>${chartNotes ? `
        <p class="figure-note">
            ${chartNotes}
        </p>` : ''}${chartSources ? `
        <p class="figure-note figure-note--source">
            ${chartSources}
        </p>` : ''}${chartCredit ? `
        <p class="figure-note figure-note--source">
            ${chartCredit}
        </p>` : ''}
    </figcaption>` : ''}
</figure>`;
});
export {
    ActiveSection, 
    CellBeingEdited, 
    ChartCredit,
    ChartDescription,
    ChartPaletteClassname,
    ChartLabel,
    ChartNotes,
    ChartSources,
    ChartSubtitle,
    ChartTitle,
    ChartType, 
    CodeExport,
    ColorByPoint,
    ColorCount,
    ColorIndeces,
    CustomColors,
    ImageDataUri,
    Indicators,
    IsWorking,
    LoadedDataConfig,
    MaxPointCount,
    Picture,
    PictureIsMissingOrOld,
    SelectedColorPalette, 
    SeriesCount,
    SeriesCountFromTable,
    SeriesCountMismatch,
    Thumbnail,
    UserOptions, 
    XAxisType
};

export const importConfig = {
    ChartCredit,
    ChartDescription,
    SelectedColorPalette,
    ChartLabel,
    ChartNotes,
    ChartSources,
    ChartSubtitle,
    ChartTitle,
    ChartType,
    ColorByPoint,
    ColorIndeces,
    CustomColors,
    UserOptions
};
