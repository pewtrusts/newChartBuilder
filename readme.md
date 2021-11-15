# Changelog

## Version 1.3.0 (15 November 2021)

* Adds option to set the number of decimal places in data labels and tooltips
* Saved charts display subtitles if there is no title so that they are easier to find and differentiate
* The chart width selected in the tool now set the max-width of the production chart; charts will be constrained to that width even if they're placed in wider columns
* Makes Highcharts an external dependency; i.e., it is loaded separately via CDN for faster performance, smaller bundle.

## Version 1.2.0 (28 October 2021)

* Adds option to define a diagonal hatch pattern as a fill for shapes such as pie segments
* Uses a smaller image format (webp) for the thumbnail images to avoid Google Sheet's error when saving more then 50,000 characters in one cell
* When saving over an existing chart the new one is now saved before the old one is removed in case something goes wrong
* Fixes datalabels on pie charts to include the name and value of the segment; also improves likelihood that all labels will be rendered
* Adds option to set the spacing to the left and bottom of charts and to set the rotation angle of pie charts
* Enables addition of trend lines (available only through custom configuration for now)
* Fixes the UI for removing plotbands and plotlines
* Allows html content (italics, bold, etc) in heds and deks
* Adds styles for dashed and thin lines (available only through custom configuration for now)
* Fixes @font-face declarations especially for bold italic, etc
* Adds basic support for annotations (available only through custom configuration for now)
* BETA: allows including more than one chart in a single figure. Charts are created separately and then grouped together. Saving and reload compound figures is still to come.
