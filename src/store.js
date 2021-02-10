import hash from './griffin/scripts/hash';
import { writable, derived } from 'svelte/store';
import brandOptions from './brand-options.json';
const CellBeingEdited = writable(null);
const XAxisType = writable('linear');
const ChartType = writable(brandOptions.defaultChartType);
const ActiveSection = writable('data');
const UserOptions = writable({});
const ImageDataUri = writable('');
const SelectedColorPalette = writable('default');
const ColorIndeces = writable(undefined);
const Indicators = writable({});
const ColorByPoint = writable([]);
const SeriesCountFromTable = writable(0); /* SeriesCountFromTable is # of series from data passed in by user.
                                             SeriesCount is # series sent to the Chart instance. e.g., pie charts
                                             only pass in one series regardless of the SeriesCountFromTable */
const CustomColors = writable([]);
const ChartCredit = writable(`© ${new Date().getFullYear()} The Pew Charitable Trusts`);
const ChartDescription = writable('');
const ChartLabel = writable('Figure 1');
const ChartNotes = writable('Notes: Funding flows are representative and reflect mainly post-disaster activity for a declared major disaster. They do not reflect funding amounts or the process for all federal and state programs. State and local funds include cost share payments related to federal programs.');
const ChartTitle = writable('Most State Tax Revenue Comes from Personal Income Tax and Sales Tax');
const ChartSources = writable('Sources: Pew’s analysis of information from J.T. Brown and D.J. Richardson, “FEMA’s Public Assistance Grant Program: Background and Considerations for Congress” (2015), <a href="https://crsreports.congress.gov/product/pdf/R/R43990">https://​crsreports.​congress.​gov/​product/​pdf/​R/​R43990</a>; U.S. Government Accountability Office, “Budgeting for Disasters: Approaches to Budgeting for Disasters in Selected States” (2015), <a href="https://www.gao.gov/products/GAO-15-424">https://​www.​gao.​gov/​products/​GAO-​15-​424</a>; Federal Emergency Management Agency, “FEMA Public Assistance Guide” (2007), <a href="http://www.fema.gov/pdf/government/grant/pa/paguide07.pdf">http://​www.​fema.​gov/​pdf/​government/​grant/​pa/​paguide07.​pdf</a>');
const ChartSubtitle = writable('Mix of tax sources by state');
const Picture = writable('');
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
    ChartPaletteClassname, 
    CustomColors, 
    ChartLabel, 
    ChartTitle, 
    ChartSubtitle
], ([chartPaletteClassname, customColors, chartLabel, chartTitle, chartSubtitle]) => {
    return {
        chartPaletteClassname, customColors, chartLabel, chartTitle, chartSubtitle
    };
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
    MaxPointCount,
    Picture,
    SelectedColorPalette, 
    SeriesCount,
    SeriesCountFromTable,
    SeriesCountMismatch,
    UserOptions, 
    XAxisType
};