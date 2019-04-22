declare const gapi: any;

export function addGoogleScript() {
  if (typeof gapi === 'undefined'){
    const resource = document.createElement('script');
    resource.async = true;
    resource.defer = true;
    resource.src = 'https://apis.google.com/js/platform.js';
    const script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(resource, script);
  }
}
