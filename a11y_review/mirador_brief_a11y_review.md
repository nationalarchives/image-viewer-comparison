# Review of Mirador viewer

The current version (Version 2) of [Mirador](http://projectmirador.org/) is no longer under active development and that work on Version 3 began in January (this information was provided by the Technical Coordinator for IIIF)

## Release version is WCAG 2.0 compliant at AA

While it does seem there has been some work to make Mirador accessible (including inclusion of WAI-ARIA roles and properties), implementation seems inconsistent and an initial review of accessibility revealed some significant issues, including:

* User interface controls that lack the correct semantics or content to meet [Principle 1](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=211#principle1) (see the example below) 

```html
<a class="mirador-osd-next hud-control">
    <i class="fa fa-3x fa-chevron-right"></i>
</a>
```

* It does not seem the interface provides any support for keyboard navigation. This does note meet Principle 2 ([Guideline 2.1](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=211#keyboard-accessible)) at Level A. 

These findings alone, coupled with information that Version 2 is no longer under active development, suggest we should not invest time evaluating Mirador as a candidate IIIF image viewer. 