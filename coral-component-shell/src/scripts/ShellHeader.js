/**
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {BaseComponent} from '../../../coral-base-component';

const CLASSNAME = '_coral-Shell-header';

/**
 @class Coral.Shell.Header
 @classdesc A Shell Header component
 @htmltag coral-shell-header
 @extends {HTMLElement}
 @extends {BaseComponent}
 */
class ShellHeader extends BaseComponent(HTMLElement) {
  /** @ignore */
  constructor() {
    super();
    
    // Prepare templates
    this._elements = {
      // Fetch or create the content zone elements
      home: this.querySelector('coral-shell-header-home') || document.createElement('coral-shell-header-home'),
      actions: this.querySelector('coral-shell-header-actions') || document.createElement('coral-shell-header-actions'),
      content: this.querySelector('coral-shell-header-content') || document.createElement('coral-shell-header-content')
    };
    
    // Events
    this._delegateEvents({
      'global:coral-overlay:beforeopen': '_handleMenuBeforeOpenOrClose',
      'global:coral-overlay:beforeclose': '_handleMenuBeforeOpenOrClose',
      'global:coral-overlay:close': '_handleMenuClose'
    });
  }
  
  /**
   The label of the panel.
   
   @type {HTMLElement}
   @contentzone
   */
  get home() {
    return this._getContentZone(this._elements.home);
  }
  set home(value) {
    this._setContentZone('home', value, {
      handle: 'home',
      tagName: 'coral-shell-header-home',
      insert: function(content) {
        // a11y
        this._enableHomeAccessibility(content);
        this.appendChild(content);
      }
    });
  }

  /**
   The main content zone of the panel.
   
   @type {HTMLElement}
   @contentzone
   */
  get content() {
    return this._getContentZone(this._elements.content);
  }
  set content(value) {
    this._setContentZone('content', value, {
      handle: 'content',
      tagName: 'coral-shell-header-content',
      insert: function(content) {
        this.appendChild(content);
      }
    });
  }
  
  /**
   The content zone where the actions are placed.
   
   @type {HTMLElement}
   @contentzone
   */
  get actions() {
    return this._getContentZone(this._elements.actions);
  }
  set actions(value) {
    this._setContentZone('actions', value, {
      handle: 'actions',
      tagName: 'coral-shell-header-actions',
      insert: function(content) {
        this.appendChild(content);
      }
    });
  }
  
  /**
   Just before a menu is open or closed, we check that the zIndex of the Header is correct so that it animates
   below the header.
   
   @ignore
   */
  _handleMenuBeforeOpenOrClose(event) {
    const target = event.target;
  
    // header only changes zIndex due to menus
    if (target.tagName === 'CORAL-SHELL-MENU') {
      // we need one frame to make sure the zIndex is already set
      window.requestAnimationFrame(() => {
        this.style.zIndex = parseInt(target.style.zIndex, 10) + 100;
        target.classList.add('is-animated');
        
        window.clearTimeout(this._zIndexTimeout);
      });
    }
  }
  
  /**
   Cleanup after _handleMenuBeforeOpenOrClose() to make sure
   we do not leave high zIndex behind that overlay other element on the page
   */
  _handleMenuClose(event) {
    const target = event.target;
    
    // header only changes zIndex due to menus
    if (target.tagName === 'CORAL-SHELL-MENU') {
      // we need additional time to make sure the zIndex is already set
      this._zIndexTimeout = setTimeout(() => {
        target.classList.remove('is-animated');
  
        this.style.zIndex = null;
      }, target.constructor.FADETIME);
    }
  }
  
  /** @private */
  _enableHomeAccessibility(home) {
    home.setAttribute('role', 'heading');
    home.setAttribute('aria-level', '2');
  }
  
  get _contentZones() {
    return {
      'coral-shell-header-home': 'home',
      'coral-shell-header-content': 'content',
      'coral-shell-header-actions': 'actions'
    };
  }
  
  /** @ignore */
  connectedCallback() {
    super.connectedCallback();
    
    this.classList.add(CLASSNAME);
    // appheader only exists on darkest theme
    this.classList.add('coral--darkest', 'u-coral-clearFix');
    
    const home = this._elements.home;
    const actions = this._elements.actions;
    const content = this._elements.content;
    
    // Remove them so we can process children
    if (home.parentNode) { home.remove(); }
    if (actions.parentNode) { actions.remove(); }
    if (content.parentNode) { content.remove(); }
    
    // moves everything to the main content zone
    while (this.firstChild) {
      content.appendChild(this.firstChild);
    }
    
    // // Call the content zone insert
    this.home = home;
    this.actions = actions;
    this.content = content;
  }
}

export default ShellHeader;