import 'normalize-css';
import 'tippy.js/dist/tippy.css';
import '@Submodule/newgriffin/src/css/griffin-styles.scss';
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
	module.hot.accept('@Submodule/newgriffin/src/index.js', function () {
		
	});
	module.hot.accept('./App.svelte', function () {
		
	});
}