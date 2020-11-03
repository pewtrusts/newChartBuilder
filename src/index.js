import 'normalize-css';
import './css/styles.scss';
import App from './App.svelte';

window.App = new App({
	target: document.querySelector('#app-container'),
	props: {},
});

if (module.hot) {
	module.hot.accept('./css/styles.scss', function () {
		console.log('hello');
	});
	/*module.hot.accept('./App.svelte', function () {
		console.log('hello svelte');
	});*/
}