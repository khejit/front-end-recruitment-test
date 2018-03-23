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

  /**
   * @param {nodeType} el Element which class should be added to.
   * @param {string} className Class to add.
   */
  function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }

  /**
   * @param {*} el Element which class should be removed from.
   * @param {*} className Class to remove.
   */
  function removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  // More bacon with vanilla js

  /**
   * Checks if current page is submodule page
   * without touching of submodules html file.
   * @return {bool} Indicator if current page is submodule. Duh.
   */
  function isSubmodulePage() {
    const headerEl = document.querySelector('.mdl-layout__header-row h3');
    return (headerEl.innerHTML === 'Submodule');
  }

  if (isSubmodulePage()) {
    const Submodule = function(rootEl) {
      this.root = rootEl;
      this.button = this.root.querySelector('button');
      this.bacon = this.root.querySelector('img[alt="Bacon"]');
    };
    Submodule.prototype.loadMoreBacon = function() {
      this.bacon.parentNode.appendChild(this.bacon.cloneNode(true));
    };
    Submodule.prototype.bindLoadBacon = function() {
      this.button.addEventListener('click', () => {
        this.loadMoreBacon();
      });
    };
    Submodule.prototype.bindActions = function() {
      this.bindLoadBacon();
    };

    const submoduleApp = new Submodule(document.querySelector('#overview'));
    submoduleApp.bindActions();
  }

  if (document.querySelector('#checkout')) {
    const Validator = function(rootEl) {
      this.root = rootEl;
      this.inputs = Array.from(this.root.querySelectorAll('input'));
      this.valid = false;
      this.validations = {
        required: function(val) {
          return val !== '';
        },
        phone: function(val) {
          return !val || val.match(/^([a-zA-Z,#/ \.\(\)\-\+\*]*[0-9]){7}[0-9a-zA-Z,#/ \.\(\)\-\+\*]*$/);
        },
        email: function(val) {
          return !val || val.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        },
        postal: function(val) {
          return !val || val.match(/^[a-zA-Z\d-]+$/);
        },
        cc: function(val) {
          /**
           * Checks a value against Luhn algorithm.
           * @param {number} val Value to be checked against Luhn algorithm.
           * @return {bool} Whether val passes the Luhn algorithm.
           */
          function luhnAlgorithm(val) {
            let sum = 0;
            for (var i = 0; i < val.length; i++) {
              let intVal = parseInt(val.substr(i, 1), 10);
              if (i % 2 === 0) {
                intVal *= 2;
                if (intVal > 9) {
                  intVal = 1 + (intVal % 10);
                }
              }
              sum += intVal;
            }
            return (sum % 10) === 0;
          }

          const regex = new RegExp('^[0-9]{16}$');
          if (!regex.test(val)) {
            return false;
          }

          return !val || luhnAlgorithm(val);
        },
        cvc: function(val) {
          return !val || val.match(/^[0-9]{3,4}$/);
        },
        expDate: function(val) {
          return !val || val.match(/^(1[0-2]|0[1-9]|\d)\/(20\d{2}|19\d{2}|0(?!0)\d|[1-9]\d)$/);
        },
        alphanum: function(val) {
          return !val || val.match(/^[a-z0-9]+$/i);
        }
      };
    };
    Validator.prototype.isInputValid = function(input) {
      let rules = input.getAttribute('data-v-rules');
      rules = rules ? rules.split(' ') : '';
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const validationFunc = this.validations[rule];
        if (!validationFunc(input.value)) {
          return false;
        }
      }
      return true;
    };
    Validator.prototype.validate = function() {
      this.valid = true;
      this.inputs.forEach(input => {
        const fieldset = input.closest('fieldset');
        if (this.isInputValid(input)) {
          removeClass(fieldset, 'error');
        } else {
          addClass(fieldset, 'error');
          this.valid = false;
        }
      });
    };

    const checkoutForm = document.querySelector('#checkout form');
    const validatorApp = new Validator(checkoutForm);

    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();
      validatorApp.validate();
      if (validatorApp.valid) {
        alert('Form submitted!');
      } else {
        alert('Something is invalid!');
      }
    });
  }
})();
