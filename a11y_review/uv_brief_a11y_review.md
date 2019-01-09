# Review of Universal Viewer accessibility

This brief review of Universal Viewer (UV) is based upon points contained in [Checkpoint 5: pre-release checks](https://github.com/nationalarchives/development-guide/blob/master/development-guide.md#checkpoint-5-pre-release-checks) of The National Archives' [Development Guide](https://github.com/nationalarchives/development-guide/blob/master/development-guide.md#checkpoint-5-pre-release-checks). It is not comprehensive but does surface some of the things we would identify for software developed in-house. 

## Release version is WCAG 2.0 compliant at AA

While this is not a full accessibility review, this section lists aspects of UV that are or may be relevant to WCAG compliance.

### Most controls are HTML anchor elements

Controls are typically implemented as empty HTML anchor elements (although some are also div or input elements) styled to have `.png` background images with `tabindex=0` and a textual description provided in the `title` attribute. An example is shown below.

```html
<a class="imageBtn settings" tabindex="0" title="Settings"></a>
```

This approach may present accessibility problems for some users because using the `title` attribute to convey a text alternative is 
* [known to be unreliable and is not supported uniformly by screen readers](https://developer.paciellogroup.com/blog/2013/01/using-the-html-title-attribute-updated/)
* conveys incorrect semantics 
* limits keyboard accessibility (in that users will be unable to activate the button with the `Space` bar) 

This might be remedied by: 

* Either: 
    * replacing HTML `<a>` elements that are acting as buttons with with `<button>` elements for these controls, _or_
    * adding the [ARIA button role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role) to these elements (See below fore a general comment about ARIA)
* Moving the content of the `title` attribute to the element content and using CSS to make it hidden but accessible to assistive technologies


### Jump to image controls

This is the rendered HTML for the image navigation options that appear at the top centre of the viewer.

```html
<div class="centerOptions" style="left: 573px;">
    <div class="prevOptions">
        <a class="imageBtn first disabled" title="First Image"></a>
        <a class="imageBtn prev disabled" title="Previous Image"></a>
    </div>
    <div class="mode">
        <label for="image">Image</label>
        <input type="radio" id="image" name="mode" tabindex="0" checked="checked" style="display: none;">
        <label for="page" class="disabled" style="display: none;">Page</label>
        <input type="radio" id="page" name="mode" tabindex="0" disabled="disabled" style="display: none;"></div>
    <div class="search">
        <input class="searchText" maxlength="50" type="text" tabindex="0" style="display: none;">
        <input class="autocompleteText" type="text" maxlength="100">
        <ul class="autocomplete" style="display: none;"></ul>
        <span class="total">of 5</span>
        <a class="go btn btn-primary" tabindex="0" title="Go">Go</a>
    </div>
    <div class="nextOptions">
        <a class="imageBtn next" tabindex="0" title="Next Image"></a>
        <a class="imageBtn last" tabindex="0" title="Last Image"></a>
    </div>
</div>

```

Issues here include: 

* The text 'Image':
    * is a label _but_ labels a hidden radio button rather than the input adjacent to it
    * is the only related element that is not hidden (all other controls and labels in this radio group have `display: none` applied)
* The `autocompleteText` input is not labelled
* There is no semantic relationship between the autocomplete list (`.autocomplete`) and the related input `autocompleteText`
* The 'Go' button is a link rather than an input/button which submits the form


### Focus management

While it is possible to tab through controls using the keyboard there are circumstances where focus is lost. Examples of this are:
 
 * when using the 'next image' control until images are exhausted the focussed element becomes disabled (causing it to lose focus). This _might_ only present a minor issue since resuming keyboard navigation brings focus to the next element
 * when navigating through the interface there are points where it seems no element has focus

### Dialogs

Some of the ways dialogs have been implemented may present accessibiliy issues to users. For example:

 * having opened the 'settings' dialog and exhausted focus options within the panel, users will be returned to be browser search bar (and subsequently on to controls behind the modal) - rather than being returned to the first option within the dialog. See WAI [Modal Dialog Example](https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html) for an implementation that meets this. Users can, however, use the Escape key to close the modal
 * upon closing the 'settings' dialog, focus is returned to the browser search bar, rather than being returned to the settings control

### Disappearing controls

The viewer has a number of controls that are placed over the document viewing area. These appear in response to `mouseenter` and, in some cases, `focus` events. Of these:

* rotation and zoom in/out functions remain visible while they have focus
* the previous and next controls will disappear even if they currently have focus

### Entire contents bar receives focus

While using the keyboard to navigate through the contents bar receives focus but there does not appear to be a means for accessing the elements contained. 

### Attribution box

The close control on the attribution box does not receive keyboard focus.

### A general point about use of ARIA

For a rich and complex application such as this there are several opportunities for ARIA roles, states and properties to be applied in ways that might enhance accessibility.

### Progressive enhancement

As a JavaScript viewer, UV is entirely reliant upon JavaScript loading and running in order to view images. Any software developed in-house would support key user journeys without reliance upon JavaScript

## Testing user goals across browsers, devices and contexts

### Responsive design

When UV is loaded on a smaller screen the viewer is resized to fit the containing element width. The size and proximity of controls is likely to present significant usability barriers when accessed on a mobile phone (as tested through an emulator). 

Some organisations have addressed this by providing an _additional_ viewer for smaller screens.