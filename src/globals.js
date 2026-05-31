/* Expose React on the global object so the existing prototype files
   (which were authored as standalone <script> globals and reference a
   free `React` / `ReactDOM`) keep resolving exactly as before, now that
   they are bundled as ES modules. Must be imported FIRST in main.jsx. */
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

window.React = React;
window.ReactDOM = ReactDOMClient; // app.jsx uses ReactDOM.createRoot
