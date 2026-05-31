/* Production entry point.
   Imports run in the SAME order the original index.html loaded the
   <script type="text/babel"> tags, so the window-global hand-off between
   files (window.Icon, window.CandlesChart, …) resolves identically.
   The tweaks-panel (design tool) is intentionally NOT imported. */
import './globals.js';
import './icons.jsx';
import './chart.jsx';
import './mockups.jsx';
import './sections.jsx';
import './app.jsx';
