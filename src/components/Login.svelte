<script context="module">
    import { loginHandler } from "./ListSavedCharts.svelte";
    import brandOptions from './../brand-options.json';
    import { getSavedCharts } from './../scripts/get-saved-charts';
    // import { tokenClient } from "./ListSavedCharts.svelte"
     globalThis.tokenClient = ''
     function revokeToken() {
      let cred = gapi.client.getToken();
      if (cred !== null) {
        google.accounts.oauth2.revoke(cred.access_token, () => {console.log('Revoked: ' + cred.access_token)});
        gapi.client.setToken('');
      }
    }
     export function logOut() {
      window.sessionStorage.setItem("store", '')
      // userStore.set({})
      revokeToken()
      location.reload()
      }
    </script>
<script>
  import {onMount} from 'svelte'
  import { s, userStore } from '../store';
  
let expired;
let staleToken; 

export let showLoginbutton = true;
let savestore = false
  $: if (savestore && $userStore) {
    window.sessionStorage.setItem("store", JSON.stringify($userStore))
    console.log('updated userstore and session')
  }

  onMount(async () => {
    let ses = window.sessionStorage.getItem("store")
      if (ses) {
        $userStore = JSON.parse(ses)
      }
    savestore = true
    expired = typeof $userStore.tokenExp == 'number' ? $userStore.tokenExp < new Date().getTime() : true;
    console.log($userStore.tokenExp)
    // if token is older than 30 mins, refresh on next save/load
    staleToken = typeof $userStore.tokenExp == 'number' ? ($userStore.tokenExp - new Date().getTime()) < 1_800_000 : true;
  })

    export let reason;
    export let userEmail;
    export let userId;
    export let userName;

    let gapiLoadOkay; 
    let gapiLoadFail;
    let gapiLoadPromise = new Promise((resolve, reject) => {
        gapiLoadOkay = resolve;
        gapiLoadFail = reject;
    })

    let gisLoadOkay;
    let gisLoadFail;

    const gisLoadPromise = new Promise((resolve, reject) => {
      gisLoadOkay = resolve;
      gisLoadFail = reject;
    });

    (async () => { 
        await gapiLoadPromise;
        await new Promise((resolve, reject) => {
        // NOTE: the 'auth2' module is no longer loaded.
        gapi.load('client', {callback: resolve, onerror: reject});
      });
      await gapi.client.init({
        // NOTE: OAuth2 'scope' and 'client_id' parameters have moved to initTokenClient().
        apiKey: GOOGLE_SHEET_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/oauth2/v1/rest', "https://sheets.googleapis.com/$discovery/rest?version=v4"]
      })
    //   .then(function() {  
        
        // Load the Sheets API discovery document.
        // gapi.client.load(DISCOVERY_DOCS[0]);
        // gapi.client.load('https://www.googleapis.com/discovery/v1/apis/oauth2/v1/rest');
        
    //   }).then(function() {
//         gapi.client.oauth2.userinfo.get().execute(function (resp) {
//     // Shows user email
//   })
    //   });
      if (!expired) {

       await gapi.client.setToken({access_token: $userStore.token.access_token})
       }
        await gisLoadPromise;
    await new Promise((resolve, reject) => {
        try {
          tokenClient = google.accounts.oauth2.initTokenClient({
              client_id: '233199941168-btiag806bdgjgpl8fnca1ldine5di7h7.apps.googleusercontent.com',
              scope: 'email profile openid https://www.googleapis.com/auth/spreadsheets',
              hint: $userStore.email ? $userStore.email : '',
              prompt: '',
              callback: ''  // defined at request time in await/promise scope.
        });   
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      if (!expired && staleToken) {
        // if the token is NOT expired, we can still grab one from the token client

    await getToken('login')
    console.log('logged in?')
    updateUser($userStore.user.credential, true)
    getSavedCharts()

      } 
      else {
        // just get charts
    updateUser($userStore.user.credential, false)
    getSavedCharts()

      }

    })()

    async function getToken(err) {
console.log('gettin token')
if (err == 'login' || err.result.error.code == 401 || (err.result.error.code == 403) &&
    (err.result.error.status == "PERMISSION_DENIED")) {

  // The access token is missing, invalid, or expired, prompt for user consent to obtain one.
  await new Promise((resolve, reject) => {
    try {
      // Settle this promise in the response callback for requestAccessToken()
      tokenClient.requestAccessToken({prompt: ""});
      tokenClient.callback = (resp) => {
        if (resp.error !== undefined) {
          reject(resp);
        }
        // GIS has automatically updated gapi.client with the newly issued access token.
        console.log('gapi.client access token: ' + JSON.stringify(gapi.client.getToken()));
        $userStore.token = gapi.client.getToken();
        $userStore.tokenSet = new Date().getTime()
        resolve(resp);
      };
     
    } catch (err) {
      console.log(err)
    }
  });
} else {
  // Errors unrelated to authorization: server errors, exceeding quota, bad requests, and so on.
  throw new Error(err);
}
}

    globalThis.callbackfunc = async (response) => {

        getToken('login').then((v) => {
            console.log('logged in!')
            $userStore.user = response;
      
            updateUser(response.credential, true)
            getSavedCharts();
        })
    }

    function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

    function updateUser(jwt, refreshing) {
        let user = parseJwt(jwt)
        userEmail = user.email;
        userId = user.sub;
        userName = user.name;
        s.UserId.set(userId);
        s.UserName.set(userName);
        s.UserEmail.set(userEmail);
        if (refreshing) {
            let hour = new Date().getTime() + 3_600_000
            $userStore.tokenExp = hour;
        }
        console.log(user)
    }


</script>
<p>
    Please log in to Google using your {brandOptions.emailDomain} address
    {reason}.
</p>
<!-- <button on:click={loginHandler} class="button button--primary">Log in</button> -->
<p>
    If prompted, please click "allow pop-ups" and refresh the page.
</p>
<!-- {staleToken}<br>
show login button = {showLoginbutton}<br>
expired = {expired} -->
{#if staleToken && showLoginbutton}
<div id="g_id_onload"
     data-client_id="233199941168-btiag806bdgjgpl8fnca1ldine5di7h7.apps.googleusercontent.com"
     data-context="signin"
     data-ux_mode="popup"
     data-callback="callbackfunc"
     data-auto_select="true"
     data-itp_support="false"
     >
</div>
<!-- not sure why this isn't needed:  data-skip_prompt_cookie="sid" -->
<div class="g_id_signin"
     data-type="standard"
     data-shape="rectangular"
     data-theme="outline"
     data-text="signin_with"
     data-size="large"
     data-logo_alignment="left"
     >
</div>
{/if}
<svelte:head>
    <script async defer src="https://apis.google.com/js/api.js" on:load="{gapiLoadOkay}"></script>
    <script async defer src="https://accounts.google.com/gsi/client" on:load="{gisLoadOkay}" ></script>
</svelte:head>