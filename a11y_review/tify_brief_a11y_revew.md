# Review of Tify viewer

[Tify](https://github.com/subugoe/tify) is an IIIF image viewer developed by [Göttingen State and University Library](https://en.wikipedia.org/wiki/Göttingen_State_and_University_Library). This brief review is based upon points contained in [Checkpoint 5: pre-release checks](https://github.com/nationalarchives/development-guide/blob/master/development-guide.md#checkpoint-5-pre-release-checks) of The National Archives' [Development Guide](https://github.com/nationalarchives/development-guide/blob/master/development-guide.md#checkpoint-5-pre-release-checks). It is not comprehensive but does surface some of the things we would identify for software developed in-house.

## Release version is WCAG 2.0 compliant at AA

### Controls

Tify typically provides good keyboard accessibility and makes appropriate use of HTML elements. Controls are typically implemented as labelled `<input>` elements or `<button>` elements containing descriptive text. Here's an example: 

```html
<button title="Zoom in" class="tify-scan_button">
    <i class="tify-icon -zoom_in">zoom_in</i> 
    <span class="tify-sr-only">Zoom in</span>
</button>
```

In this code:

* A `<span>` within the button describes the button purpose and is visually hidden using a technique that will mean it remains available to screen readers
* The `title` attribute is used to describe the button purpose (on `hover` and in some other circumstances)
* The `Material Icons` font is applied to the `<i>` element resulting in the text 'zoom_in' being rendered as the icon. This is a novel approach that uses ligatures to replace specific words with corresponding symbols (See the [Material Design guides](https://google.github.io/material-design-icons/#icon-font-for-the-web#using-the-icons-in-html) for more information). I've not come across this before but expect it may result in users of some assistive technologies being presented with the non-word `zoom_in`.

There are some examples where the information conveyed to users might be confusing, as in the case in the example below:

```html
<button title="Physical page: 1 Logical page: Page 1" class="tify-page-select_button">
    <span class="tify-sr-only">Current page</span>
    1 : Page 
</button>
```

#### Some exceptions

Options within the Jump to Page feature are `<li>` items but act as controls.

### Double page view

There are aspects of the 'double page' view that might impact on the usability and accessibility of the viewer. These include:

* A book icon is used to denote 'toggle double page', which might confuse users
* It is not immediately apparent to sighted users what impact clicking the book icon has

We can remedy this by _either_: 

* removing this functionality (since it is not part of our MVP)
* replaing the icon with descriptive text

### Jump to page

Clicking the jump to page button reveals an autocomplete search bar and a listing of available pages. A potential issue with this feature is: a click on the button or pressing 'space' while the button has focus will reveal the search bar and listing, but pressing 'enter' will not. There is, however, a dedicated key binding to reveal the search bar and listing

## Focus state

There is a very low contrast ratio to indicate an element has received focus.

## Key bindings

Tify comes with a range of [key bindings](https://github.com/subugoe/tify/blob/v0.20.5/doc/key-bindings.en.md) that might provide usability and accessibility benefits to a range of users

## A general point about use of ARIA

For a rich and complex application such as this there are several opportunities for ARIA roles, states and properties to be applied in ways that might enhance accessibility.

## Progressive enhancement

As a JavaScript viewer, Tify is entirely reliant upon JavaScript loading and running in order to view images. Any software developed in-house would support key user journeys without reliance upon JavaScript

## Testing user goals across browsers, devices and contexts

The layout and control options for Tify adapt to different screen sizes. It seems thought has been put into this. 