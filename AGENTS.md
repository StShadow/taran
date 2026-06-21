# TARAN — Agent Context & Technical Specifications

This document provides a complete technical reference of the **TARAN** repository for development agents. 

---

## 0. Agent Operating Instructions

### 0. Be brief

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `Lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it


## 1. Project Overview

*   **Name**: TARAN (Target Analysis and shooting precision calculator)
*   **Version**: `1.1 (yojeg1)` (released 2016-01-12)
*   **Author**: Alexandre Trofimov (Copyright 2015)
*   **License**: GNU GPLv3
*   **Purpose**: A serverless, purely client-side Single Page Application (SPA) designed to analyze target images, mark bullet holes (shots), group them, and perform statistical calculations for shooting precision (e.g., Extreme Spread, POI, Rayleigh sigma, R50, R95, R99, MOA/mrad conversions).
*   **Offline Support**: Designed to run entirely local/offline using the HTML5 Application Cache (`taran.manifest`).

---

## 2. Technology Stack

*   **Frontend Core**: HTML5, Vanilla CSS3, and ES5 Vanilla JavaScript.
*   **Dependencies**: **None**. Zero external libraries or frameworks (no jQuery, no bootstrap, no build scripts, no Node.js/npm dependencies).
*   **Graphics & Rendering**:
    *   **Canvas API**: Used in `image-pane.js` and `addimg-pane.js` for image manipulation, zooming, panning, and rendering shot marks on targets.
    *   **Inline SVG**: Programmatically constructed SVG markup in `synth-pane.js` for statistical graphs, confidence gauges, and vector summaries.
*   **Storage & Serialization**:
    *   **Local Storage**: Persists user preferences (defaults for units, distance, caliber, language).
    *   **XML Serialization**: Custom XML schema (`toXML`/`fromXML`) used to save/load projects. Images are encoded as base64 strings and stored directly within the XML file.

---

## 3. Directory & Repository Structure

All files reside at the root level of the workspace. There is no nested source directory structure.

```
e:\Development\taran\taran-repo\
├── .htaccess             # Apache rules setting text/cache-manifest MIME type & immediate expiration
├── KNOWN-BUGS.txt        # Documented bugs (UI alignment & button visibility issues)
├── LICENSE               # GNU GPL v3 full text
├── VERSION-HISTORY.txt   # History of releases (v0.1b to v1.1)
├── index.html            # Entry point: performs immediate client redirect to taran.html
├── taran.html            # Main UI shell (defines toolbars, panels, and loads JS modules)
├── taran.css             # Main stylesheet for panels, dark-themed layout, and button icons
├── taran.manifest        # Cache manifest registering all files for offline usage
├── lang-bang.js          # Core translation framework & i18n lookup helpers
├── lang-de.js            # German localized strings
├── lang-en.js            # English localized strings (Reference language)
├── lang-fr.js            # French localized strings
├── lang-it.js            # Italian localized strings
├── lang-ru.js            # Russian localized strings
├── trous.js              # Core data model ("Samevik") and statistical math engine
├── image-pane.js         # Interactive Canvas logic for viewing targets & placing shots
├── addimg-pane.js        # Logic for loading, rotating, and resizing raw targets
├── proj-pane.js          # Form elements for editing project metadata
├── synth-pane.js         # SVG target synthesis generator, CSV/SVG exports, confidence meter
├── help-pane.js          # Help tab text markup renderer
├── toolbar.js            # Left toolbar event listener attachment logic
└── img/                  # SVG and PNG icons, logos, and default targets
    ├── taran-icon.svg    # Main logo / icon
    └── icons/            # SVG icons for toolbar buttons (zoom, rotate, add shot, etc.)
```

---

## 4. Architecture & Key Modules

### A. Core Data Model (`trous.js`)
The root data model object is called `Samevik` (representing a project). It possesses a hierarchical relationship with other structures:

```
Samevik (Project Container)
├── description (string)
├── metric (boolean: true = metric, false = imperial)
├── cal (number: bullet caliber)
├── dist (number: shooting distance)
├── sheets (Array of Sheet objects)
│   ├── name (string)
│   ├── image (HTML Image object)
│   ├── scalept1, scalept2 (Shot objects - calibration points)
│   ├── scale (number: pixels-per-unit scale factor)
│   ├── scalelen (number: physical size used for scale)
│   └── groups (Array of Group objects)
│       ├── cx, cy (number: group center point in pixels)
│       ├── shots (Array of Shot objects: x, y pixel coordinates)
│       └── stats (Object containing ES, POI, and bounding markers)
```

*   **Serialization / Deserialization**:
    *   Saved projects are written to an XML file (`.xml`) via recursive `toXML()` methods.
    *   Loaded projects are parsed via `DOMParser` and instantiated using `fromXML(xmlNode)`.
    *   *Note*: In `trous.js` (line 282), a browser workaround exists for Safari/Chrome where a large XML text node (base64 image) might crash the parser. The serializer converts to string and manually strips XML tags to read long strings.

### B. Statistical Calculations (`trous.js`)
Statistical values are calculated algorithmically in `Samevik.prototype.synthStats`:
1.  **Coordinate Mapping**: Pixel coordinates from all shots on all sheets are converted into real-world units (mm or inches) relative to each sheet's scale factor.
2.  **Point of Impact (POI)**: The average center of mass for all shot coordinates ($X_{poi}$, $Y_{poi}$).
3.  **Variance**: Calculated independently for X and Y, then averaged:
    $$V = \frac{V_x + V_y}{2}$$
4.  **Rayleigh Sigma**:
    $$\sigma = \text{RAYLEIGH\_COEFF}[n] \times \sqrt{V}$$
    Uses bias-corrected coefficients stored in the `RAYLEIGH_COEFF` lookup table (indexed by shot count $n$).
5.  **Confidence Intervals (95%)**: Lower/Upper bounds of the Rayleigh sigma are computed by multiplying with `CONF_LOWER[n]` and `CONF_UPPER[n]` coefficients from pre-calculated arrays.
6.  **POI Confidence Ellipse**: Calculated using Student's t-distribution quantiles from the `TDIST_QUANTILE` lookup table:
    $$CI = \frac{\text{TDIST\_QUANTILE}[n]}{\sqrt{n}} \times \sqrt{V}$$
7.  **Extreme Spread (ES)**: Computed in `Group.prototype.updateStats` using an $O(n^2)$ exhaustive pairwise distance scan to identify the two furthest shots.

### C. UI Navigation & Panes (`precan-main.js` / `taran.html`)
The application implements an SPA view switcher controlled by `setActivePane(paneName)`:
*   `project` - Loads `proj-pane.js` to modify caliber, distance, unit system, and displays target sheets.
*   `addimage` - Loads `addimg-pane.js` where users import, rotate, and scale pictures.
*   `target` - Loads `image-pane.js` for canvas actions (scaling, grouping, placing/deleting shots).
*   `summary` - Loads `synth-pane.js` showing computed results, SVG plots, and interactive overlays.
*   `help` - Loads `help-pane.js` static references.

### D. Localization / i18n (`lang-bang.js`)
TARAN relies on a custom dictionary i18n module:
*   Translation files `lang-[code].js` push localized values into the `LSTR['code']` global dictionary object.
*   `LSTX(key)` performs lookup with English as the fallback language.
*   `setInterfaceLanguage(code)` changes current language, saves preferences to `localStorage`, and triggers UI text replacement for nodes with language characteristics.

---

## 5. Coding Style & Design Conventions

When writing or modifying files in this codebase, adhere strictly to the following conventions:

1.  **ES5 JavaScript**: No modern ES6+ features. Avoid `const`, `let`, arrow functions (`=>`), template literals (use string concatenation), classes (use function prototype inheritance), or ES modules.
2.  **Global Namespace**: Variables are scoped globally or bound directly to global state objects (`samevik`, `csheet`, `cgroup`, `synthSVG`, etc.).
3.  **OOP Style**: Constructor functions defining instances:
    ```javascript
    function Shot(x, y) {
        this.x = x;
        this.y = y;
    }
    ```
4.  **Comment Style**: Retain block-closing comments indicating function boundaries:
    ```javascript
    function listenerProjectNew(evt) {
        // ...
    } // function listenerProjectNew(evt)
    ```
5.  **DOM Manipulation**: Use native vanilla browser APIs only (`document.getElementById`, `document.createElement`, and `addEventListener`).
6.  **Clean DOM Text updates**: Helper function `setElementText(id, text)` clears all child nodes and appends a single text node to avoid raw HTML injection issues.

---

## 6. Known Bugs & Limitations

*   **Language Selection Truncation**: On the left toolbar, the language selector dropdown may truncate language names due to fixed width layouts.
*   **Shot Delete Button**: The delete button for shot groups remains visible (though non-functional) when all shots have been deleted.
*   **Lookup Table Size Limit**: The mathematical lookup tables in `trous.js` cap out at $n = 1000$. The application is statistically limited to 1000 shots.
*   **Deprecated Manifest Cache**: HTML5 AppCache is deprecated. Modern browsers may ignore the cache manifest file.

---

## 7. Build, Test, & Deployment

*   **Build system**: **None**. Code runs directly in the browser as-is.
*   **Testing**: No automated tests exist. Verification must be performed manually by running a local server (e.g., Python `http.server` or Apache) and verifying target placement and analysis in the browser.
*   **Offline manifest updates**: If adding, removing, or modifying files, the version timestamp comment (`# revision YYYY-MM-DD`) inside `taran.manifest` must be updated to force clients to clear and reload the AppCache.
