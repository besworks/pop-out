# Pop Out!

This custom element combo provides a scrollable element with child elements that expand out of the overflow area when hovered. It was created in response to a [long-standing issue](https://github.com/w3c/csswg-drafts/issues/4092) with the CSS spec and [this question](https://stackoverflow.com/questions/71809003/overflow-x-scroll-and-overflow-y-visible-alternative/) on Stack Overflow.

### How it Works

The child elements are plucked out from the static context and positioned fixed to the viewport while simultaneously inserting a placeholder of the same dimensions into the static context to prevent the layout from collapsing.

### Usage

```
<script type="module" src="./pop-out.js"></script>
<over-scroll>
  <pop-out><img src="./your.png"></pop-out>
  <pop-out><img src="./content.svg"></pop-out>
  <pop-out><img src="./here.jpg"></pop-out>
</over-scroll>
```

Both element definitions are imported by the single script tag. You can also import the classes into your script and create these programatically.

```
import { OverScrollElement, PopOutElement } from './pop-out.js';

let overScroll = new OverScrollElement();
let popOut = new PopOutElement();
popOut.innerHTML = `<h1> Hello! </h1>`;
overScroll.append(popOut);
document.body.append(overScroll);
```

The outer, `over-scroll` element is necessary to enable scroll events to pass through the nested elements and gracefully de-zoom the active element. The default mode is to scroll horizontally. Adding a `vertical` attribute modifies the scroll direction and makes it `display:inline-flex`.

````
<over-scroll vertical>
   ...
</over-scroll>
````

You can pass any markup/elements you want into `pop-out` though images and center justified content tend to work best. You have full control over the styling of your content. A few default rules are applied to `pop-out` elements that can be overriden:

```
pop-out {
  cursor: zoom-in;
  --scale-amount: 1.5;
  --scale-speed: 0.2s;
  --scale-timing: ease;
  --shadow-in: drop-shadow(0 0 0.2rem #00000033);
  --shadow-out: drop-shadow(0 0 1rem #00000088);
}
```