/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 */
import "web-animations-js"; // Run `npm install --save web-animations-js`.

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags.ts';
 */
import "zone.js"; // Included with Angular CLI.

/***************************************************************************************************
 * APPLICATION IMPORTS
 */

/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
import "intl"; // Run `npm install --save intl`.
/**
 * Need to import at least one locale-data with intl.
 */
import "intl/locale-data/jsonp/en";

/**
 * CUSTOM ELEMENTS POLYFILLS
 */
import "@webcomponents/custom-elements/custom-elements.min"; // Run `npm install --save @webcomponents/custom-elements`.
