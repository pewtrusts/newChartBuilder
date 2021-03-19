import 'normalize-css';
import 'tippy.js/dist/tippy.css';
import 'highcharts/css/highcharts.css';
//import './griffin/css/griffin-variables.css';
import './griffin/css/griffin-styles.scss';
import './css/variables.css';
import './css/styles.css';
import App from './App.svelte';

window.App = new App({
	target: document.querySelector('#app-container'),
	props: {},
});
if (module.hot) {
	module.hot.accept('./css/styles.css', function () {
		
	});
	module.hot.accept('./css/variables.css', function () {
		
	});
	module.hot.accept('./griffin/griffin.js', function () {
		
	});
	module.hot.accept('./App.svelte', function () {
		
	});
}