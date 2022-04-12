# Pop Out!

This custom element combo provides a horizontally scrolling element with child elements that expand when hovered.

### Background

This project was created in response to a [long-standing issue](https://github.com/w3c/csswg-drafts/issues/4092) with the CSS spec. Long story short, if an overflow parent node has a child that expands due to a CSS scale transform, the child element cannot break free of the overflow and will be cut off.

### Solution

Break the child element out of it's static context and position it fixed to the viewport while simultaneously inserting a placeholder of the same dimensions into the static context to prevent the layout from collapsing.

### Usage

```
<script type="module" src="./pop-out.js"></script>
<over-scroll>
  <pop-out><img src="./your.png"></pop-out>
  <pop-out><img src="./content.svg"></pop-out>
  <pop-out><img src="./here.jpg"></pop-out>
</over-scroll>
```

Both element definitions are imported by the single script tag. The outer, `over-scroll` element is necessary to enable scroll events to pass through the nested elements and gracefully de-zoom the active element.

You can pass any nested markup you want into `pop-out` though images and center justified content tend to work best. A full test page is included with examples.