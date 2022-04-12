class PopOutElement extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode : 'open' });
    this.shadowRoot.innerHTML = this.template;
    this.wrapper = this.shadowRoot.querySelector('#wrapper');
    this.pstamp = this.shadowRoot.querySelector('template').content;
    this.addEventListener('pointerdown', event => this.toggle());
    this.addEventListener('mousemove', event => this.expand());
    this.addEventListener('mouseenter', event => this.expand());
    this.addEventListener('mouseleave', event => this.retract());
  }

  get template() {
    return `
      <style>
        :host {
          display: block;
          cursor: zoom-in;
        }
        
        :host([active]) {
          z-index: 10;
        }
        
        #placeholder {
          pointer-events: none;
        }
        
        #wrapper {
          display: inline-block;
        }
        
        ::slotted(:not(:first-child)) {
          display: none;
        }
        
        ::slotted(*) {
          transition-property: transform, filter;
          transition-timing-function: ease;
          transition-duration: 0.2s;
          filter: drop-shadow(0 0 0.2rem #00000033);
        }
        
        :host([active]) ::slotted(:hover) {
          transform: scale(1.5);
          filter: drop-shadow(0 0 1rem #00000088);
        }
        
        .fixed { position: fixed; }
        .static { position: static; }
      </style>
      <template>
        <div id="placeholder" class="static"></div>
      </template>
      <div id="wrapper" class="static"><slot></slot></div>
    `;
  }
  
  out = false;
  
  get slotted() {
    return this.firstElementChild;
  }
  
  get placeholder() {
    return this.shadowRoot.querySelector('#placeholder');
  }
  
  get stamp() {
    return document.importNode(this.pstamp, true);
  }
  
  get delay() {
    let d = parseFloat(getComputedStyle(this.slotted)?.getPropertyValue('transition-duration'));
    if (!d) { d = 0; } // handle if not using transitions
    else if (d < 1 && d > 0) { d = d * 1000 } // handle values as 1000ms or 1.0s
    return d;
  }
  
  setPosition(x, y, w, h) {
    if (x == 'auto') { y = w = h = x; }
    else { x+='px'; y+='px'; w+='px'; h+='px'; }
    this.wrapper.style.left = x;
    this.wrapper.style.top = y;
    this.wrapper.style.width = w;
    this.wrapper.style.height = h;
  }
  
  setSize(w, h) {
    this.placeholder.style.width = w + 'px';
    this.placeholder.style.height = h + 'px';
  }
  
  expand() {
    if (this.out) { return; } this.out = true;
    let r = this.getBoundingClientRect();
    this.shadowRoot.insertBefore(this.stamp, this.wrapper);
    this.wrapper.className = 'fixed';
    this.setSize(r.width, r.height);
    this.setPosition(r.left, r.top, r.width, r.height);
    requestAnimationFrame(pf => {
      this.setAttribute('active', '');
    });
  }
  
  retract(now) {
    if (!this.out) { return; }
    this.removeAttribute('active');
    
    let after = () => {
      requestAnimationFrame(af => {
        this.wrapper.className = 'static';
        this.placeholder?.remove();
        this.setPosition('auto');
        this.out = false;
      });
    };
    
    if (now) { after(); }
    else { setTimeout(after, this.delay); }
  }

  toggle() {
    if (this.out) { this.retract(); }
    else { this.expand(); }
  }
}

class OverScrollElement extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode : 'open' });
    this.shadowRoot.innerHTML = this.template;
    this.addEventListener('wheel', event => this.#handleScroll(event), true);  
    this.addEventListener('touchmove', event => this.#handleTouch(event), true);
    this.addEventListener('touchstart', event => this.#setPosition(event), true);
    this.addEventListener('touchend', event => this.#setPosition(), true);
  }

  #start = null;

  #setPosition(event) {
    if (event?.touches?.length) {
      this.#start = event.touches[0].clientX;
    } else { this.#start = null; }
  }

  #handleTouch(event) {
    if (this.#start != null && event?.touches?.length) {
      let x = event.touches[0]?.clientX;
      event.deltaX = this.#start - x;
      this.#start = x;
      this.#handleScroll(event);
    } else {
      this.#setPosition();
    }
  }

  get active() {
    return this.querySelector('pop-out[active]');
  }

  #handleScroll(event) {
    requestAnimationFrame(ts => {
      this.scrollBy({ left: event.deltaX });
    }); this.active?.retract(true);
  }
  
  get template() {
    return `
      <style>
        * { box-sizing: border-box; }

        :host {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          gap: 1rem;
          overflow-x: scroll;
          overflow-y: clip;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define('pop-out', PopOutElement);
customElements.define('over-scroll', OverScrollElement);

export { PopOutElement, OverScrollElement }
