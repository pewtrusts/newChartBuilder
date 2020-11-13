import 'normalize-css';
import './css/variables.css';
import './css/styles.css';
import 'highcharts/css/highcharts.css';
import App from './App.svelte';

window.App = new App({
	target: document.querySelector('#app-container'),
	props: {},
});

if (module.hot) {
	module.hot.accept('./css/styles.css', function () {
		console.log('accepted');
	});
	module.hot.accept('./css/variables.css', function () {
		console.log('accepted');
	});
	/*module.hot.accept('./App.svelte', function () {
		console.log('hello svelte');
	});*/
}