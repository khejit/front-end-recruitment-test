/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // More bacon with jQuery
  const $ = window.$;
  const submoduleEl = document.querySelector('.submodule #overview');

  if (submoduleEl) {
    const submoduleConstructor = function (rootEl) {
      this.root = rootEl;
      this.$root = $(this.root);
      this.button = this.$root.find('button');
      this.bacon = this.$root.find('img[alt="Bacon"]');
    };  
    submoduleConstructor.prototype.loadMoreBacon = function () {
      this.bacon.clone().appendTo(this.bacon.parent());
    };
    submoduleConstructor.prototype.bindLoadBacon = function () {
      this.button.on('click', () => {
        this.loadMoreBacon();
      })
    };
    submoduleConstructor.prototype.bindActions = function () {
      this.bindLoadBacon();
    };

    const submoduleApp = new submoduleConstructor(submoduleEl);
    submoduleApp.bindActions();
  };

  // Checkout form validation with Vue
  Vue.use(VeeValidate);

  new Vue({
    el: '#checkout',
    data: function () {
      return {
        submitAttempted: false,
      }
    },
    methods: {
      submitForm: function () {
        this.submitAttempted = true;
        this.$validator.validateAll().then((result) => {
          if (result) {
            alert("Form submitted!");
          } else {
            alert("Errors occured!");
          }
        })
      }
    }
  })
})();
