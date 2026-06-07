/*
Copyright 2015 Alexandre Trofimov

This file is part of TARAN, target analysis and precision calculator.

TARAN is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

TARAN is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with TARAN.  If not, see <http://www.gnu.org/licenses/>.
*/

var synthSVG = null; // global object, initialised in samevik constructor
    // recreated on samevik load from file

var CONFI_LEVELS = [
    {l:0.5, c:'#7a5901'}, // bullshit
    {l:0.45, c:'#FF0000'}, // barely significant
    {l:0.4, c:'#FF5B00'}, // poor
    {l:0.35, c:'#FFA500'}, // fair
    {l:0.3, c:'#FFD200'}, // above average
    {l:0.25, c:'#FFFF00'}, // good
    {l:0.2, c:'#80FF00'}, // very good
    {l:0, c:'#00FF00'} // excellent
    ];

var CONFI_LEVELS_SCORE = [
    '0',
    '1',
    '1+',
    '2',
    '2+',
    '3',
    '3+',
    '4'
    ];

var gridunits = ''; 

function handlerWindowResizePaneSynth(evt) {
    if (activepane != 'summary') { return false; }
    
    var panel = document.getElementById('pane-content-analysis');
    panel.style.width = (window.innerWidth - 96) + 'px';
    
    synthSVG.setScale();
    synthSVG.applyView();

    var sliderbox = document.getElementById('synth-slider-box');
    sliderbox.style.left = (panel.offsetLeft + synthSVG.sizex * 0.625 - sliderbox.offsetWidth / 2) + 'px';
    sliderbox.style.top = (panel.offsetTop + 8) + 'px';
} // function handlerWindowResizePaneSynth(evt)


function setScaleSVG(boxwidth, boxheight) {
    var bx;
    var by;
    
    if (boxwidth && boxheight) {
        bx = boxwidth
        by = boxheight;
    }
    else {
        var box = document.getElementById("pane-content-analysis");
        bx = box.offsetWidth - 8;
        by = box.offsetHeight - 8;
    }
    
    
    if (bx * 3 > by * 4) {
        // wider than 4:3
        this.sizex = by * 4 / 3;
        this.sizey = by;
    }
    else {
        // taller than 4:3 
        this.sizex = bx;
        this.sizey = bx * 3 / 4;
    }
    var half = this.sizey / 2;
    
    // calculate scale
    this.maxd = Math.max(
        samevik.boxhi.x,
        samevik.boxhi.y,
        - samevik.boxlo.x,
        - samevik.boxlo.y,
        Math.abs(samevik.poi.x),
        Math.abs(samevik.poi.y),
        samevik.sigma * 3.03 // R99 circle
    );
    this.scale = half / this.maxd / 1.05; // pixels/mm
        // to fit the target box area with 5% margin
        
    this.tx = samevik.poi.x;
    this.ty = samevik.poi.y;
} // function setScaleSVG()

function getSVGsumpaneX(x) { // transpose coordinates to summary box
    return (x - this.maxd*5/3);
} // function getSVGsumpaneX(x)

function getSVGsumpaneY(y) { // transpose coordinates to summary box
    return (y - this.maxd);
} // function getSVGsumpaneY(y)


function applyViewSVG(savetofile) {
    var svg = '';

    if (!samevik.pts.length) {
        hideElement('synth-slider-box');
        svg = '<text style="font-size:24px;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;writing-mode:lr-tb;text-anchor:middle;fill:#000000;fill-opacity:1;stroke:none;font-family:Sans;" x="400" y="300">' + LSTX('noshotsselected') + '</text>';
        svg = '<svg version="1.1" baseProfile="full" height="600" width="800" xmlns="http://www.w3.org/2000/svg">' + "\n" + svg + "\n</svg>";
        this.domel.innerHTML = svg;
        return "";
    } // nothing to do

    unhideElement('synth-slider-box');
    
    
    if (this.r95SVG.show) { svg = svg + this.r95SVG.s; }
    if (this.moaSVG.show) { svg = svg + this.moaSVG.s; }
    if (this.a5xSVG.show) { svg = svg + this.a5xSVG.s; }
    if (this.a10xSVG.show) { svg = svg + this.a10xSVG.s; }
    if (this.sigmaSVG.show) { svg = svg + this.sigmaSVG.s; }
    if (this.r50SVG.show) { svg = svg + this.r50SVG.s; }
    if (this.r99SVG.show) { svg = svg + this.r99SVG.s; }
    
    if (this.gridSVG.show) { svg = svg + this.gridSVG.s; }
    svg = svg + this.tgtSVG;
    
    svg = svg + this.alsoSVG;
    
    if (savetofile) {
        var dt = new Date();
        svg = svg + '<text fill="black" font-weight="bold" font-family="Sans" font-size="' + (samevik.metric ? (1.5) : (0.06)) + 'px" text-anchor="end" x="' + (samevik.poi.x + this.maxd) + '" y="' + (samevik.poi.y + this.maxd) + '">TARAN v.' + version + ' - ' + homeurl + ' - ' + dt.toString() + '</text>' + "\n";
    }
    
    svg = svg + this.sumSVG;
    svg = svg + this.cmeterSVG;
    
    svg = this.defsSVG + '<g id="combi-target" transform="translate(' + (this.sizex-0.5*this.sizey-this.tx*this.scale) + " " + (0.5*this.sizey-this.ty*this.scale) + ') scale(' + this.scale + ")\">\n" + svg + "</g>\n";
    svg = svg + '<rect x="0" y="0" width="' + this.sizex + '" height="' + this.sizey + '" style="fill:none;stroke:black;stroke-width:2" />';
    svg = '<svg version="1.1" baseProfile="full" height="' + this.sizey + '" width="' + this.sizex + '" xmlns="http://www.w3.org/2000/svg">' + "\n" + svg + "\n</svg>";
    
    // console.log(svg);
    if (savetofile) {
        var filename = samevik.description.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
        filename = (filename) ? (filename + '.svg') : 'taran.svg';
        promptDownload('<?xml version="1.0" encoding="UTF-8" standalone="no"?>' + "\n" + svg, filename);
    }
    else {
        this.domel.innerHTML = svg;
        if (document.getElementById('synth-btn-sigma')) { document.getElementById('synth-btn-sigma').addEventListener('click', listenerSynthClickSigma, false); }
        if (document.getElementById('synth-btn-r50')) { document.getElementById('synth-btn-r50').addEventListener('click', listenerSynthClickR50, false); }
        if (document.getElementById('synth-btn-d5x')) { document.getElementById('synth-btn-d5x').addEventListener('click', listenerSynthClickD5x, false); }
        if (document.getElementById('synth-btn-d10x')) { document.getElementById('synth-btn-d10x').addEventListener('click', listenerSynthClickD10x, false); }
        if (document.getElementById('synth-btn-r99')) { document.getElementById('synth-btn-r99').addEventListener('click', listenerSynthClickR99, false); }

        if (document.getElementById('synth-btn-grid-none')) { document.getElementById('synth-btn-grid-none').addEventListener('click', listenerSynthClickGridNone, false); }
        if (document.getElementById('synth-btn-grid-mrad')) { document.getElementById('synth-btn-grid-mrad').addEventListener('click', listenerSynthClickGridMrad, false); }
        if (document.getElementById('synth-btn-grid-moa')) { document.getElementById('synth-btn-grid-moa').addEventListener('click', listenerSynthClickGridMOA, false); }
    }
} // function applyViewSVG()

function makeAllSVG() {
    if (!samevik.pts.length) { return ""; } // nothing to do
    
    this.setScale();
    
    var lwu = (samevik.metric) ? 1 : 0.04; // line width unit; 1mm ~= 0.04"
    
    // R95
    this.r95SVG.s = '<circle cx="' + samevik.poi.x +'" cy="' + samevik.poi.y + '" r="' + (samevik.sigma * 2.45 * samevik.confidenceUpper) + '" stroke="none" stroke-width="' + lwu + '" fill="#688E23" opacity="0.25" />' + "\n";
    this.r95SVG.s = this.r95SVG.s + '<circle cx="' + samevik.poi.x +'" cy="' + samevik.poi.y +
        '" r="' + (samevik.sigma * 2.45 * samevik.confidenceLower) + '" stroke="none" stroke-width="' + lwu + '" fill="white" opacity="1" />' + "\n";
    this.r95SVG.s = this.r95SVG.s + '<circle cx="' + samevik.poi.x +'" cy="' + samevik.poi.y +
        '" r="' + (samevik.sigma * 2.45) + '" stroke="#688E23" stroke-width="' + lwu + '" fill="none" opacity="1" />' + "\n";

    // sigma
    this.sigmaSVG.s = '<circle cx="' + samevik.poi.x +'" cy="' + samevik.poi.y +
        '" r="' + samevik.sigma + '" stroke="#707070" stroke-width="' + (0.25 * lwu) + '" fill="none" opacity="1" />' + "\n";

    // R50
    this.r50SVG.s = '<circle cx="' + samevik.poi.x +'" cy="' + samevik.poi.y +
        '" r="' + (samevik.sigma * 1.18) + '" stroke="#707070" stroke-width="' + (0.25 * lwu) + '" fill="none" opacity="1" />' + "\n";
    
    // R99
    this.r99SVG.s = '<circle cx="' + samevik.poi.x +'" cy="' + samevik.poi.y +
        '" r="' + (samevik.sigma * 3.03) + '" stroke="#707070" stroke-width="' + (0.25 * lwu) + '" fill="none" opacity="1" />' + "\n";

    // A5
    this.a5xSVG.s = '<circle cx="' + samevik.poi.x +'" cy="' + samevik.poi.y +
        '" r="' + (samevik.sigma * 3.06 / 2) + '" stroke="#707070" stroke-width="' + (0.25 * lwu) + '" fill="none" opacity="1" />' + "\n";

    // A10
    this.a10xSVG.s = '<circle cx="' + samevik.poi.x +'" cy="' + samevik.poi.y +
        '" r="' + (samevik.sigma * 3.79 / 2) + '" stroke="#707070" stroke-width="' + (0.25 * lwu) + '" fill="none" opacity="1" />' + "\n";

    // MOA circle    
    var moar = (samevik.metric) ? (0.2908 / 2 * samevik.dist) : (1.047 / 200 * samevik.dist);
    this.moaSVG.s = '<circle cx="' + samevik.poi.x +'" cy="' + samevik.poi.y +
        '" r="' + moar + '" stroke="#DBA737" stroke-width="' + (0.25 * lwu) + '" stroke-dasharray="' + (2 * lwu) + ',' + (2 * lwu) + '" fill="none" opacity="1" />' + "\n";
    this.moaSVG.show = true;

    // grid + axis
    // this.gridSVG = '<line x1="' + (samevik.poi.x - this.maxd) + '" y1="' + samevik.poi.y + '" x2="' + (samevik.poi.x +this.maxd) + '" y2="' + samevik.poi.y + '" style="stroke:black;stroke-width:0.5" />' + "\n";
    // this.gridSVG = this.gridSVG + '<line x1="' + samevik.poi.x + '" y1="' + (samevik.poi.y -this.maxd) + '" x2="' + samevik.poi.x + '" y2="' + (samevik.poi.y +this.maxd) + '" style="stroke:black;stroke-width:0.5" />' + "\n";
    this.gridSVG.s = '';
    var gstep;  // step of grid
    var gcount; // number of grid steps in each direction
    var gmajor; // major grid every .. lines
    var linewidth;
    if (this.gridSVG.mrad) {
        gstep = (samevik.metric) ? (0.05 * samevik.dist) : (0.0018 * samevik.dist); // steps of 0.05 mrad
        gmajor = 2; // major every 2nd line
    }
    else {
        gstep = (samevik.metric) ? (0.2908 / 4 * samevik.dist) : (0.0026175 * samevik.dist); // 1/4 MOA
        gmajor = 4; // major every 4th line
    }
    gcount = Math.floor(this.maxd / gstep);
    
    for (var i = -gcount; i <= gcount; i++) {
        linewidth = (i % gmajor) ? 0.1 : 0.25;
        this.gridSVG.s = this.gridSVG.s + '<line x1="' + (samevik.poi.x - this.maxd) + '" y1="' + (samevik.poi.y + i * gstep) + '" x2="' + (samevik.poi.x +this.maxd) + '" y2="' + (samevik.poi.y + i * gstep) + '" style="opacity:0.5;stroke:black;stroke-width:' + (linewidth * lwu) + '" />' + "\n";
        this.gridSVG.s = this.gridSVG.s + '<line x1="' + (samevik.poi.x + i * gstep) + '" y1="' + (samevik.poi.y -this.maxd) + '" x2="' + (samevik.poi.x + i * gstep) + '" y2="' + (samevik.poi.y +this.maxd) + '" style="opacity:0.5;stroke:black;stroke-width:' + (linewidth * lwu) + '" />' + "\n";
    }
    
    // POI confidence interval
    this.tgtSVG = '<ellipse cx="' + samevik.poi.x +'" cy="' + samevik.poi.y +
            '" rx="' + samevik.poici.x + '" ry="' + samevik.poici.y + '" fill="orange" opacity="0.25" />' + "\n";
    // POI
    this.tgtSVG = this.tgtSVG + '<circle cx="' + samevik.poi.x +'" cy="' + samevik.poi.y +
            '" r="' + samevik.cal/4 + '" stroke="black" stroke-width="' + (0.5 * lwu) + '" fill="orange" opacity="1"/>' + "\n";
            
    // POA
    this.tgtSVG = this.tgtSVG + '<circle cx="' + 0 +'" cy="' + 0 +
            '" r="' + samevik.cal/4 + '" stroke="black" stroke-width="' + (0.5 * lwu) + '" fill="red" />' + "\n";
    // shots
    for (var i = 0; i < samevik.pts.length; i++) {
        this.tgtSVG = this.tgtSVG + '<circle cx="' + samevik.pts[i].x +'" cy="' + samevik.pts[i].y +
                '" r="' + samevik.cal/2 + '" stroke="white" stroke-width="' + (0.5 * lwu) + '" fill="blue" opacity="0.5" />' + "\n";
    }
    
    // Summary box
    
    var projname = samevik.description.replace(/[^a-z0-9_\-\s]/gi, '_').substr(0,16);
    if (!projname) { projname = 'BFG 9000'; }
    
    this.sumSVG = ' <rect opacity="0.8" height="730" width="350" stroke="#000" y="0.50002" x="0" fill="none"/>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="32px" y="39.390949" x="174.5" font-weight="bold" fill="#000000">' + "\n" +
        '  <tspan y="39.390949" x="174.5">' + projname + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="24px" y="69.947632" x="12.483852" font-weight="bold" fill="#000000">' + "\n" +
        '  <tspan y="69.947632" x="12.483852">' + LSTX('distance') + ':</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="24px" y="98.296829" x="13.491665" font-weight="bold" fill="#000000">' + "\n" +
        '  <tspan y="98.296829" x="13.491665">' + LSTX('calibre') + ':</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="24px" y="126.64616" x="12.964321" font-weight="bold" fill="#000000">' + "\n" +
        '  <tspan y="126.64616" x="12.964321">' + LSTX('shotcount') + ':</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <path stroke-linejoin="miter" d="m11.381,136.43,327.24,0" stroke="#000" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="none" stroke-width="2" fill="none"/>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="24px" y="438.73224" x="14.66948" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="438.73224" x="14.66948">' + "\n" +
        '   <tspan font-weight="bold">' + LSTX('confidenceinterval') + ':</tspan> ' + Math.round((samevik.confidenceLower-1) * 100) + '%..+' + Math.round((samevik.confidenceUpper-1) * 100) + '%</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="24px" y="203.13666" x="14.142137" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="203.13666" x="14.142137">' + "\n" +
        '   <tspan font-weight="bold">SD:</tspan>' + "\n" +
        '  </tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="24px" y="242.4872" x="13.661668" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="242.4872" x="13.661668">' + "\n" +
        '   <tspan font-weight="bold">R50:</tspan>' + "\n" +
        '  </tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="24px" y="281.82599" x="13.661668" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="281.82599" x="13.661668">' + "\n" +
        '   <tspan font-weight="bold">D5x:</tspan>' + "\n" +
        '  </tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="24px" y="321.1767" x="13.661668" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="321.1767" x="13.661668">' + "\n" +
        '   <tspan font-weight="bold">D10x:</tspan>' + "\n" +
        '  </tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <path stroke-linejoin="miter" d="m11.881,557.43,327.24,0" stroke="#000" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="none" stroke-width="1.99999988" fill="none"/>' + "\n" +
        ' <path stroke-linejoin="miter" d="m11.381,175.63,327.24,0" stroke-dashoffset="0" stroke="#000" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="1, 1" stroke-width="1" fill="none"/>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="167.46484" x="151.36107" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="167.46484" x="151.36107" style="text-anchor:middle;text-align:center;" font-weight="bold">' + sUnitsLen() + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <g transform="translate(10.400005,-375.06211)">' + "\n" +
        '  <rect fill-opacity="0.12549" height="30" width="80" stroke="#000" y="517.36" x="204.83" stroke-width="1" fill="#000"/>' + "\n" +
        '  <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="24px" y="541.09851" x="243.78017" font-weight="normal" fill="#000000">' + "\n" +
        '   <tspan y="541.09851" x="243.78017" style="text-anchor:middle;text-align:center;" font-weight="bold">MOA</tspan>' + "\n" +
        '  </text>' + "\n" +
        ' </g>' + "\n" +
        ' <path stroke-linejoin="miter" d="m11.381,214.65,327.24,0" stroke-dashoffset="0" stroke="#000" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="1, 1" stroke-width="1" fill="none"/>' + "\n" +
        ' <path stroke-linejoin="miter" d="m11.381,253.66,327.24,0" stroke-dashoffset="0" stroke="#000" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="1, 1" stroke-width="1" fill="none"/>' + "\n" +
        ' <path stroke-linejoin="miter" d="m11.381,292.68,327.24,0" stroke-dashoffset="0" stroke="#000" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="1, 1" stroke-width="1" fill="none"/>' + "\n" +
        ' <path stroke-linejoin="miter" d="m11.381,331.7,327.24,0" stroke-dashoffset="0" stroke="#000" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="1, 1" stroke-width="1" fill="none"/>' + "\n" +
        ' <g id="synth-btn-sigma" cursor="pointer" transform="translate(0,-382.9621)">' + "\n" + // sigma circle
        '  <rect fill-opacity="0.12549" height="30" width="30" stroke="#000" y="562.36" x="310" stroke-width="1" fill="#000"/>' + "\n" +
        '  <path fill="' + ( (synthSVG.sigmaSVG.show) ? '#008000' : '#FFFFFF') + '" d="m337.64,579.36c0,5.5789-5.1445,10.102-11.49,10.102-6.346,0-11.49-4.5226-11.49-10.102,0-5.5789,5.1445-10.102,11.49-10.102,6.346,0,11.49,4.5226,11.49,10.102z" transform="matrix(1.0878566,0,0,1.2374369,-29.80771,-139.55719)"/>' + "\n" +
        ' </g>' + "\n" +
/*        ' <g id="synth-btn-d10x" cursor="pointer" transform="translate(0,-264.91054)">' + "\n" + // D10x circle
        '  <rect fill-opacity="0.12549" height="30" width="30" stroke="#000" y="562.36" x="310" stroke-width="1" fill="#000"/>' + "\n" +
        '  <path fill="' + ( (synthSVG.a10xSVG.show) ? '#008000' : '#FFFFFF') + '" d="m337.64,579.36c0,5.5789-5.1445,10.102-11.49,10.102-6.346,0-11.49-4.5226-11.49-10.102,0-5.5789,5.1445-10.102,11.49-10.102,6.346,0,11.49,4.5226,11.49,10.102z" transform="matrix(1.0878566,0,0,1.2374369,-29.80771,-139.55719)"/>' + "\n" +
        ' </g>' + "\n" +*/
/*        ' <g id="synth-btn-d5x" cursor="pointer" transform="translate(0,-304.26104)">' + "\n" + // D5x circle
        '  <rect fill-opacity="0.12549" height="30" width="30" stroke="#000" y="562.36" x="310" stroke-width="1" fill="#000"/>' + "\n" +
        '  <path fill="' + ( (synthSVG.a5xSVG.show) ? '#008000' : '#FFFFFF') + '" d="m337.64,579.36c0,5.5789-5.1445,10.102-11.49,10.102-6.346,0-11.49-4.5226-11.49-10.102,0-5.5789,5.1445-10.102,11.49-10.102,6.346,0,11.49,4.5226,11.49,10.102z" transform="matrix(1.0878566,0,0,1.2374369,-29.80771,-139.55719)"/>' + "\n" +
        ' </g>' + "\n" +*/
        ' <g id="synth-btn-r50" cursor="pointer" transform="translate(0,-343.61159)">' + "\n" + // R50 circle
        '  <rect fill-opacity="0.12549" height="30" width="30" stroke="#000" y="562.36" x="310" stroke-width="1" fill="#000"/>' + "\n" +
        '  <path fill="' + ( (synthSVG.r50SVG.show) ? '#008000' : '#FFFFFF') + '" d="m337.64,579.36c0,5.5789-5.1445,10.102-11.49,10.102-6.346,0-11.49-4.5226-11.49-10.102,0-5.5789,5.1445-10.102,11.49-10.102,6.346,0,11.49,4.5226,11.49,10.102z" transform="matrix(1.0878566,0,0,1.2374369,-29.80771,-139.55719)"/>' + "\n" +
        ' </g>' + "\n" +
        ' <path stroke-linejoin="miter" d="m11.381,410.23,327.24,0" stroke-dashoffset="0" stroke="#000" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="1, 1" stroke-width="1" fill="none"/>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="201.02148" x="151.33655" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="201.02148" x="151.33655">' + samevik.printUnit(samevik.sigma) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="200.9939" x="253.14" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="200.9939" x="253.14">' + samevik.printInMOA(samevik.sigma) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="24px" y="360.3808" x="13.661668" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="360.3808" x="13.661668">' + "\n" +
        '   <tspan font-weight="bold">R95:</tspan>' + "\n" +
        '  </tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <path stroke-linejoin="miter" d="m11.381,370.71,327.24,0" stroke-dashoffset="0" stroke="#000" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="1, 1" stroke-width="1" fill="none"/>' + "\n" +
/*        ' <g transform="translate(0,-225.56002)">' + "\n" + // R95 circle
        '  <rect fill-opacity="0.12549" height="30" width="30" stroke="#000" y="562.36" x="310" stroke-width="1" fill="#000"/>' + "\n" +
        '  <path fill="' + ( (synthSVG.r95SVG.show) ? '#008000' : '#FFFFFF') + '" d="m337.64,579.36c0,5.5789-5.1445,10.102-11.49,10.102-6.346,0-11.49-4.5226-11.49-10.102,0-5.5789,5.1445-10.102,11.49-10.102,6.346,0,11.49,4.5226,11.49,10.102z" transform="matrix(1.0878566,0,0,1.2374369,-29.80771,-139.55719)"/>' + "\n" +
        ' </g>' + "\n" + */
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="24px" y="399.88965" x="13.661668" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="399.88965" x="13.661668">' + "\n" +
        '   <tspan font-weight="bold">R99:</tspan>' + "\n" +
        '  </tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <g id="synth-btn-r99" cursor="pointer" transform="translate(0,-186.20948)">' + "\n" + // R99 circle
        '  <rect fill-opacity="0.12549" height="30" width="30" stroke="#000" y="562.36" x="310" stroke-width="1" fill="#000"/>' + "\n" +
        '  <path fill="' + ( (synthSVG.r99SVG.show) ? '#008000' : '#FFFFFF') + '" d="m337.64,579.36c0,5.5789-5.1445,10.102-11.49,10.102-6.346,0-11.49-4.5226-11.49-10.102,0-5.5789,5.1445-10.102,11.49-10.102,6.346,0,11.49,4.5226,11.49,10.102z" transform="matrix(1.0878566,0,0,1.2374369,-29.80771,-139.55719)"/>' + "\n" +
        ' </g>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="240.795" x="151.65295" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="240.795" x="151.65295">' + samevik.printUnit(samevik.sigma * 1.18) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="280.56866" x="151.29553" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="280.56866" x="151.29553">' + samevik.printUnit(samevik.sigma * 3.06) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="320.34235" x="151.31897" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="320.34235" x="151.31897">' + samevik.printUnit(samevik.sigma * 3.79) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="360.11597" x="151.44202" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="360.11597" x="151.44202">' + samevik.printUnit(samevik.sigma * 2.45) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="399.88965" x="151.52405" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="399.88965" x="151.52405">' + samevik.printUnit(samevik.sigma * 3.03) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="240.7729" x="253.14" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="240.7729" x="253.14">' + samevik.printInMOA(samevik.sigma * 1.18) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="280.55206" x="253.14" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="280.55206" x="253.14">' + samevik.printInMOA(samevik.sigma * 3.06) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="320.33124" x="253.14" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="320.33124" x="253.14">' + samevik.printInMOA(samevik.sigma * 3.79) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="360.11047" x="253.14" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="360.11047" x="253.14">' + samevik.printInMOA(samevik.sigma * 2.45) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-family="sans-serif" font-size="24px" y="399.88965" x="253.14" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="399.88965" x="253.14">' + samevik.printInMOA(samevik.sigma * 3.03) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:end;text-align:end;" font-family="sans-serif" font-size="24px" y="69.947632" x="315.96649" font-weight="bold" fill="#000000">' + "\n" +
        '  <tspan y="69.947632" x="315.96649">' + samevik.dist + "" + sUnitsDist() + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:end;text-align:end;" font-family="sans-serif" font-size="24px" y="98.296829" x="315.96649" font-weight="bold" fill="#000000">' + "\n" +
        '  <tspan y="98.296829" x="315.96649">' + samevik.cal + sUnitsLen() + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:end;text-align:end;" font-family="sans-serif" font-size="24px" y="126.64616" x="315.96649" font-weight="bold" fill="#000000">' + "\n" +
        '  <tspan y="126.64616" x="315.96649">' + samevik.pts.length + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:end;text-align:end;" font-family="sans-serif" font-size="px" y="480.52219" x="582.32599" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="480.52219" x="329.56366" font-size="24px" style="text-anchor:end;text-align:end;">' + "\n" +
        '   <tspan style="text-anchor:end;text-align:end;" font-weight="bold">' + LSTX('avgpoi') + '</tspan>' + "\n" +
        '  </tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="px" y="590.79425" x="9.462182" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan font-size="24px" y="590.79425" x="9.462182" font-weight="bold">' + LSTX('grid') + ':</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <g id="synth-btn-grid-none" cursor="pointer" transform="translate(0,-329.96263)">' + "\n" +
        '  <rect height="30" width="60" stroke="#000" y="896.81" x="78.571" stroke-width="1" fill="' + ( (synthSVG.gridSVG.show) ? '#FFFFFF' : '#008000') + '"/>' + "\n" +
        '  <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" stroke-width="0.5" font-family="sans-serif" stroke-dasharray="none" font-size="24px" stroke="#ffffff" stroke-miterlimit="4" y="920.54602" x="108.98744" font-weight="normal" fill="#000000">' + "\n" +
        '   <tspan stroke-width="0.5" style="text-anchor:middle;text-align:center;" stroke-dasharray="none" stroke="#ffffff" stroke-miterlimit="4" y="920.54602" x="108.98744" font-weight="bold">OFF</tspan>' + "\n" +
        '  </text>' + "\n" +
        ' </g>' + "\n" +
        ' <g id="synth-btn-grid-mrad" cursor="pointer" transform="translate(0,-329.96263)">' + "\n" +
        '  <rect height="30" width="100" stroke="#000" y="896.81" x="144.29" stroke-width="1" fill="' + ( (synthSVG.gridSVG.show && synthSVG.gridSVG.mrad) ? '#008000' : '#FFFFFF') + '"/>' + "\n" +
        '  <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" stroke-width="0.5" font-family="sans-serif" stroke-dasharray="none" font-size="24px" stroke="#ffffff" stroke-miterlimit="4" y="920.54602" x="193.98804" font-weight="normal" fill="#000000">' + "\n" +
        '   <tspan stroke-width="0.5" stroke-dasharray="none" stroke="#ffffff" stroke-miterlimit="4" y="920.54602" x="193.98804" font-weight="bold">0.05‰</tspan>' + "\n" +
        '  </text>' + "\n" +
        ' </g>' + "\n" +
        ' <g id="synth-btn-grid-moa" cursor="pointer" transform="translate(45.184998,49.484758)">' + "\n" +
        '  <rect height="30" width="90" stroke="#000" y="517.36" x="204.83" stroke-width="1" fill="' + ( (synthSVG.gridSVG.show && !synthSVG.gridSVG.mrad) ? '#008000' : '#FFFFFF') + '"/>' + "\n" +
        '  <text style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" stroke-width="0.5" font-family="sans-serif" stroke-dasharray="none" font-size="24px" stroke="#ffffff" stroke-miterlimit="4" y="541.09851" x="249.29579" font-weight="normal" fill="#000000">' + "\n" +
        '   <tspan stroke-width="0.5" stroke-dasharray="none" stroke="#ffffff" stroke-miterlimit="4" y="541.09851" x="249.29579" font-weight="bold">¼MOA</tspan>' + "\n" +
        '  </text>' + "\n" +
        ' </g>' + "\n" +
        ' <path d="m48.468,621.02a10.056,10.056,0,0,1,-20.111,0,10.056,10.056,0,1,1,20.111,0z" stroke="#000" stroke-dasharray="none" stroke-miterlimit="4" stroke-width="2.49999952" fill="#F00"/>' + "\n" +
        ' <g transform="translate(-0.06420803,4.0996807)" stroke="#000" stroke-dasharray="none" stroke-miterlimit="4" fill="#ffa500">' + "\n" +
        '  <rect opacity="0.25" stroke-dashoffset="0" height="30" width="50" y="453.82" x="16.429" stroke-width="1"/>' + "\n" +
        '  <path d="m51.485,468.82a10.056,10.056,0,0,1,-20.111,0,10.056,10.056,0,1,1,20.111,0z" stroke-width="2.49999952"/>' + "\n" +
        ' </g>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="px" y="629.96033" x="59.275055" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan y="629.96033" x="59.275055" font-size="24px">' + LSTX('poatargetcentre') + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <path stroke-linejoin="miter" d="m11.381,452.37,327.24,0" stroke-dashoffset="0" stroke="#000" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="1, 1" stroke-width="1" fill="none"/>' + "\n" +
        ' <path stroke-linejoin="miter" d="m11.381,602.4,327.24,0" stroke-dashoffset="0" stroke="#000" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="1, 1" stroke-width="1" fill="none"/>' + "\n" +
        ' <g transform="translate(0,5.0000408)">' + "\n" +
        '  <rect stroke-dasharray="none" stroke-dashoffset="0" height="30" width="50" stroke="#000" stroke-miterlimit="4" y="640.19" x="16.429" stroke-width="1" fill="none"/>' + "\n" +
        '  <path stroke-linejoin="miter" d="m18.571,668.05c15.477-13.42,30.953-19.62,46.429-23.58" stroke-dashoffset="0" stroke="#dba737" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="6, 6" stroke-width="3" fill="none"/>' + "\n" +
        '  <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="px" y="663.92224" x="73.850746" font-weight="normal" fill="#000000">' + "\n" +
        '   <tspan y="663.92224" x="73.850746" font-size="24px">1MOA = ' + samevik.printLength((samevik.metric) ? (0.2908 * samevik.dist) : (0.01047 * samevik.dist)) + '</tspan>' + "\n" +
        '  </text>' + "\n" +
        ' </g>' + "\n" +
        ' <g transform="translate(1.4285717,-306.46191)">' + "\n" +
        '  <rect stroke-dasharray="none" fill-opacity="0.25098" stroke-dashoffset="0" height="30" width="50" stroke="#000" stroke-miterlimit="4" y="993.79" x="15" stroke-width="1" fill="#688e23"/>' + "\n" +
        '  <path stroke-linejoin="miter" d="m17.143,1021.6c15.476-13.419,30.952-19.613,46.429-23.571" stroke-dashoffset="0" stroke="#688e23" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="none" stroke-width="3" fill="none"/>' + "\n" +
        '  <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="px" y="1016.412" x="75.045227" font-weight="normal" fill="#000000">' + "\n" +
        '   <tspan y="1016.412" x="75.045227" font-size="24px">' + LSTX('r95confmargin') + '</tspan>' + "\n" +
        '  </text>' + "\n" +
        ' </g>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="px" y="512.42426" x="15.677292" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan font-size="24px" y="512.42426" x="15.677292">V: ' + samevik.printUnit(-samevik.poi.y) + '±' + samevik.printLength(samevik.poici.y) + '</tspan>' + "\n" +
        ' </text>' + "\n" +
        ' <text style="writing-mode:lr-tb;text-anchor:start;text-align:start;" font-family="sans-serif" font-size="px" y="543.89087" x="13.509324" font-weight="normal" fill="#000000">' + "\n" +
        '  <tspan font-size="24px" y="543.89087" x="13.509324">H: ' + samevik.printUnit(samevik.poi.x) + '±' + samevik.printLength(samevik.poici.x) + '</tspan>' + "\n" +
        ' </text>';
    // move and scale into target canvas coordinates
    var sbscale = this.maxd * 2 / 3 / 350; // sumbox is 350 px wide, space left to the left is maxd*2/3  
    this.sumSVG = '<g id="summary-box" transform="translate(' + (this.tx - this.maxd * 5 / 3) + " " + (this.ty - this.maxd) + ') scale(' + sbscale + ")\">\n" + this.sumSVG + "</g>\n";    
    
    // Confidence-o-meter
    var ci = samevik.confidenceUpper - samevik.confidenceLower; // confidence interval
    // get slider position
    var cipos = 0;
    if (ci > 0.5) {
        cipos = (1.5 - ci) * 0.2;
    }
    else {
        cipos = 1 - (ci - 0.2) * 8 / 3;
    }
    if (cipos < 0) { cipos = 0; }
    if (cipos > 1) { cipos = 1; }
        // go to real pixels, invert scale
    cipos = (1 - cipos) * 250;
    
    // confi info box
    var confilevel = 0;
    for (confilevel = 0; confilevel < CONFI_LEVELS.length; confilevel++) {
        if (ci > CONFI_LEVELS[confilevel].l) { break; }
    }
    
    console.log('level  = ' + confilevel);
    console.log('colour = ' + CONFI_LEVELS[confilevel].c);
    console.log(LANG);
    console.log('txt    = ' + LSTX('confitxt' + confilevel + 'l1'));
    console.log('score  = ' + CONFI_LEVELS_SCORE[confilevel]);

    
    this.cmeterSVG = ' <path opacity="0.8" d="m158.58,792.31-20.894-12.063-20.894-12.063,20.894-12.063,20.894-12.063,0,24.126z" transform="matrix(1,0,0,1,38.46192,' + (cipos-727.03748) + ')" stroke="#202020" stroke-miterlimit="4" stroke-dasharray="none" stroke-width="2" fill="#808080"/>' + "\n" +
        ' <rect transform="matrix(0,-1,-1,0,0,0)" height="150" width="250" y="-150" x="-291.17" fill="url(#linearGradient4894)"/>' + "\n" +
        ' <text style="writing-mode:lr-tb;letter-spacing:0px;text-anchor:middle;word-spacing:0px;text-align:center;" font-size="32px" font-style="normal" font-variant="normal" y="254.20155" x="75.004776" xml:space="preserve" fill="#000000"><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-weight="bold" font-size="13px" font-style="normal" font-variant="normal" y="254.20155" x="75.004776" font-family="sans-serif" fill="#ffffff">' + LSTX('cnfdBSTS') + '</tspan></text>' + "\n" +
        ' <path stroke-linejoin="miter" d="m1,240.17,148,0" stroke-dashoffset="0" stroke="#FFF" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="2, 2" stroke-width="2" fill="none"/>' + "\n" +
        ' <path opacity="0.8" stroke-linejoin="miter" d="m1,' + (cipos+41.172) + ',155.9,0" stroke-dashoffset="0" stroke="#FFFFFF" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="none" stroke-width="6" fill="none"/>' + "\n" +
        ' <path opacity="0.8" stroke-linejoin="miter" d="m1,' + (cipos+41.172) + ',155.9,0" stroke-dashoffset="0" stroke="#202020" stroke-linecap="butt" stroke-miterlimit="4" stroke-dasharray="none" stroke-width="4" fill="none"/>' + "\n" +
        ' <text style="writing-mode:lr-tb;letter-spacing:0px;text-anchor:middle;word-spacing:0px;text-align:center;" font-size="32px" font-style="normal" font-variant="normal" y="280" x="74.661179" xml:space="preserve" fill="#ffffff"><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-weight="bold" font-size="16px" font-style="normal" font-variant="normal" y="280.69568" x="74.661179" font-family="sans-serif" fill="#ffffff">' + LSTX('cnfdCRAP') + '</tspan></text>' + "\n" +
        ' <text style="writing-mode:lr-tb;letter-spacing:0px;text-anchor:middle;word-spacing:0px;text-align:center;" font-size="32px" font-style="normal" font-variant="normal" y="210" x="74.450089" xml:space="preserve" fill="#000000"><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-weight="bold" font-size="16px" font-style="normal" font-variant="normal" y="210" x="74.450089" font-family="sans-serif" fill="#000000">' + LSTX('cnfdPOOR') + '</tspan></text>' + "\n" +
        ' <text style="writing-mode:lr-tb;letter-spacing:0px;text-anchor:middle;word-spacing:0px;text-align:center;" font-size="32px" font-style="normal" font-variant="normal" y="160" x="74.450089" xml:space="preserve" fill="#000000"><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-weight="bold" font-size="16px" font-style="normal" font-variant="normal" y="160" x="74.450089" font-family="sans-serif" fill="#000000">' + LSTX('cnfdFAIR') + '</tspan></text>' + "\n" +
        ' <text style="writing-mode:lr-tb;letter-spacing:0px;text-anchor:middle;word-spacing:0px;text-align:center;" font-style="normal" xml:space="preserve" font-size="32px" font-variant="normal" y="110" x="75.0205" fill="#000000"><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-weight="bold" font-size="16px" font-style="normal" font-variant="normal" y="110" x="75.0205" font-family="sans-serif" fill="#000000">' + LSTX('cnfdGOOD') + '</tspan></text>' + "\n" +
        ' <text style="writing-mode:lr-tb;letter-spacing:0px;text-anchor:middle;word-spacing:0px;text-align:center;" font-size="32px" font-style="normal" font-variant="normal" y="60" x="74.196297" xml:space="preserve" fill="#000000"><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-weight="bold" font-size="16px" font-style="normal" font-variant="normal" y="60" x="74.196297" font-family="sans-serif" fill="#000000">' + LSTX('cnfdEXCELLENT') + '</tspan></text>' + "\n" +
        ' <rect height="250" width="150" y="41.172" x="200" fill="' + CONFI_LEVELS[confilevel].c + '"/>' + "\n" +
        ' <text style="writing-mode:lr-tb;letter-spacing:0px;text-anchor:middle;word-spacing:0px;text-align:center;" font-weight="bold" font-size="28px" font-style="normal" font-variant="normal" y="86.882248" x="274.8913" font-family="sans-serif" xml:space="preserve" fill="#000000"><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" y="86.882248" x="274.8913">' + LSTX('confitxt' + confilevel + 'l1') + '</tspan><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" y="121.88222" x="274.8913">' + LSTX('confitxt' + confilevel + 'l2') + '</tspan></text>' + "\n" +
        ' <text style="writing-mode:lr-tb;letter-spacing:0px;text-anchor:middle;word-spacing:0px;text-align:center;" font-weight="bold" font-style="normal" font-variant="normal" y="161.82967" x="275.00067" font-family="sans-serif" xml:space="preserve" fill="#000000"><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-size="16px" y="161.82967" x="275.00067">' + LSTX('cnfdURURA') + '</tspan><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-size="36px" y="201.76465" x="275.00067">' + CONFI_LEVELS_SCORE[confilevel] + '</tspan></text>' + "\n" +
        ' <text style="writing-mode:lr-tb;letter-spacing:0px;text-anchor:middle;word-spacing:0px;text-align:center;" font-weight="bold" font-style="normal" font-variant="normal" y="238.86211" x="275.13739" font-family="sans-serif" xml:space="preserve" fill="#000000"><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-size="14px" y="238.86211" x="275.13739">' + LSTX('cnfdmargin') + '</tspan><tspan style="writing-mode:lr-tb;text-anchor:middle;text-align:center;" font-size="16px" y="258.35559" x="275.13739">' + Math.round((samevik.confidenceLower-1) * 100) + '%..+' + Math.round((samevik.confidenceUpper-1) * 100) + '%</tspan></text>' + "\n" +
        ' <text style="writing-mode:lr-tb;letter-spacing:0px;text-anchor:start;word-spacing:0px;text-align:start;" font-size="32px" font-style="normal" font-variant="normal" y="23.552696" x="1.5185343" xml:space="preserve" fill="#000000"><tspan font-weight="bold" font-size="31px" font-style="normal" font-variant="normal" y="23.552696" x="1.5185343" font-family="sans-serif">' + LSTX('confimetertitle') + '</tspan></text>' + "\n";
    // move and scale into target canvas coordinates
    var cmscale = this.maxd * 2 / 3 / 350; // cmeter is 350 px wide, space left to the left is maxd*2/3  
    this.cmeterSVG = '<g id="confi-meter" transform="translate(' + (this.tx - this.maxd * 5 / 3) + " " + (this.ty + this.maxd - 300*cmscale) + ') scale(' + cmscale + ")\">\n" + this.cmeterSVG + "</g>\n";
    
/*     // tag A5
    svg = svg + '<text fill="#707070" x="' + samevik.poi.x + '" y="' + (samevik.poi.y + samevik.sigma * 3.06 / 2) + '" text-anchor="middle" font-size="5px" font-family="sans-serif" stroke="black" stroke-width="0.1">Rx5=' + roundToUnits(samevik.sigma * 3.06 / 2) + "</text>\n";
    // tag A10
    svg = svg + '<text fill="#707070" x="' + samevik.poi.x + '" y="' + (samevik.poi.y + samevik.sigma * 3.79 / 2) + '" text-anchor="middle" font-size="5px" font-family="sans-serif" stroke="black" stroke-width="0.1">Rx10=' + roundToUnits(samevik.sigma * 3.79 / 2) + "</text>\n";
    // tag R95
    svg = svg + '<text fill="#688E23" x="' + samevik.poi.x + '" y="' + (samevik.poi.y + samevik.sigma * 2.45) + '" text-anchor="middle" font-size="5px" font-family="sans-serif" stroke="black" stroke-width="0.1">R95=' + roundToUnits(samevik.sigma * 2.45) + ' / [' + roundToUnits(samevik.sigma * 2.45 * samevik.confidenceLower) + ' .. ' + roundToUnits(samevik.sigma * 2.45 * samevik.confidenceUpper)  + "]</text>\n";
    // tag MOA
    svg = svg + '<text fill="#DBA737" x="' + samevik.poi.x + '" y="' + (samevik.poi.y - moar) + '" text-anchor="middle" font-size="5px" font-family="sans-serif" stroke="black" stroke-width="0.1">MOA=' + roundToUnits(moar) + "</text>\n"; */
    
} // function makeAllSVG()

function SynthSVG(domel) { // domel = containing DOM element
    this.domel = domel;

    this.sizex = 0;
    this.sizey = 0;
    this.tx = 0; // coordinates translation
    this.ty = 0;
    this.scale = 0; // px per mm
    
    // defs section of SVG
    this.defsSVG = ' <defs>' + "\n" +
        '  <linearGradient id="linearGradient4894" y2="320" gradientUnits="userSpaceOnUse" x2="656.63" gradientTransform="matrix(0.45830916,0,0,0.37688435,-342.68551,-195.6045)" y1="320" x1="112.82">' + "\n" +
        '   <stop stop-color="#7a5901" offset="0"/>' + "\n" +
        '   <stop stop-color="#7a5901" offset="0.17"/>' + "\n" +
        '   <stop stop-color="#F00" offset="0.4"/>' + "\n" +
        '   <stop stop-color="#ffa500" offset="0.6"/>' + "\n" +
        '   <stop stop-color="#FF0" offset="0.8"/>' + "\n" +
        '   <stop stop-color="#0F0" offset="1"/>' + "\n" +
        '  </linearGradient>' + "\n" +
        ' </defs>' + "\n";
        
    this.sumSVG = ''; // summary pane
    this.tgtSVG = '';  // combined target
    this.gridSVG = { s: '', mrad: true, show: true };
    this.maxd = 0; // max distance from centre (POI) to draw on the image

    this.a5xSVG = { s: '', show: false };
    this.a10xSVG = { s: '', show: false };
    this.sigmaSVG = { s: '', show: false };
    this.r50SVG = { s: '', show: false };
    this.r95SVG = { s: '', show: true };
    this.r99SVG = { s: '', show: false };
    this.moaSVG = { s: '', show: true };
    this.alsoSVG  = '';
    
    this.cmeterSVG = ''; // confidence-o-meter
    
    this.setScale = setScaleSVG;
    this.gsX = getSVGsumpaneX;
    this.gsY = getSVGsumpaneY;
    this.applyView = applyViewSVG; 
    this.makeAll = makeAllSVG;
} // SynthSVG(domel) constructor

function listenerSynthSave(evt) {
    synthSVG.applyView(true);
} // function listenerSynthSave(evt)

function listenerCSVExport(evt) {
    var csv = "ShotX,ShotY,Target,Group,Distance,Description" + "\n";
    for (var i = 0; i < samevik.pts.length; i++) {
        csv = csv + samevik.pts[i].x + ',' + samevik.pts[i].y + ',"' +
            samevik.sheets[samevik.ptstg[i].t].name + '",' +
            (samevik.ptstg[i].g+1) + ',' +
            samevik.dist + ',' +
            samevik.description +
            "\n";
    }
    var filename = samevik.description.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
        filename = (filename) ? (filename + '.csv') : 'taran.csv';
        promptDownload(csv, filename);
} // function listenerCSVExport(evt)

function listenerSynthClickSigma(evt) {
    synthSVG.sigmaSVG.show = !synthSVG.sigmaSVG.show;
    synthSVG.makeAll();
    synthSVG.applyView();
} // function listenerSynthClickSigma(evt)

function listenerSynthClickR50(evt) {
    synthSVG.r50SVG.show = !synthSVG.r50SVG.show;
    synthSVG.makeAll();
    synthSVG.applyView();
} // function listenerSynthClickR50(evt)

function listenerSynthClickD5x(evt) {
    synthSVG.a5xSVG.show = !synthSVG.a5xSVG.show;
    synthSVG.makeAll();
    synthSVG.applyView();
} // function listenerSynthClickD5x(evt)

function listenerSynthClickD10x(evt) {
    synthSVG.a10xSVG.show = !synthSVG.a10xSVG.show;
    synthSVG.makeAll();
    synthSVG.applyView();
} // function listenerSynthClickD10x(evt)

function listenerSynthClickR99(evt) {
    synthSVG.r99SVG.show = !synthSVG.r99SVG.show;
    synthSVG.makeAll();
    synthSVG.applyView();
} // function listenerSynthClickR99(evt)

function listenerSynthClickGridNone(evt) {
    synthSVG.gridSVG.show = false;
    synthSVG.makeAll();
    synthSVG.applyView();
} //  function listenerSynthClickGridNone(evt)

function listenerSynthClickGridMrad(evt) {
    synthSVG.gridSVG.mrad = true;
    synthSVG.gridSVG.show = true;
    synthSVG.makeAll();
    synthSVG.applyView();
} //  function listenerSynthClickGridMrad(evt)

function listenerSynthClickGridMOA(evt) {
    synthSVG.gridSVG.mrad = false;
    synthSVG.gridSVG.show = true;
    synthSVG.makeAll();
    synthSVG.applyView();
} //  function listenerSynthClickGridMOA(evt)

function listenerSliderMove(evt) {
    var val = document.getElementById('synth-also-slider').value;
    var v = 1 - val / 100;
    // rayleigh quantile
    var q = samevik.sigma * Math.sqrt(-Math.log(v * v));
    
    var txt = val + '%: ' + samevik.printUnit(q) + sUnitsLen() + ' = ' + samevik.printInMrad(q) + 'mrad' + ' = ' + samevik.printInMOA(q) + 'MOA';
    
    if (val == 0) {
        synthSVG.alsoSVG = '';
    }
    else {
        var lwu = (samevik.metric) ? 1 : 0.04;
        synthSVG.alsoSVG = '<circle cx="' + samevik.poi.x +'" cy="' + samevik.poi.y +
        '" r="' + q + '" stroke="#800000" stroke-width="' + (0.25 * lwu) + '" fill="none" opacity="1" />' + "\n" +
        '<text fill="#800000" stroke="white" stroke-width="' + (0.05 * lwu) + '" font-family="sans-serif" font-weight="bold" font-size="' + (3 * lwu) + 'px" font-style="normal" font-variant="normal" text-anchor="middle" x="' + samevik.poi.x + '" y="' + (samevik.poi.y - q) + '">R' + val + '% = ' + samevik.printUnit(q) + sUnitsLen() + '</text>' + "\n";
    }
    synthSVG.applyView();
    
    setElementText('synth-also-slider-text', txt);
    var sliderbox = document.getElementById('synth-slider-box');
    sliderbox.style.left = (document.getElementById('pane-content-analysis').offsetLeft + synthSVG.sizex * 0.625 - sliderbox.offsetWidth / 2) + 'px';
} // function listenerSliderMove(evt)

function initSynthPane() {
    document.getElementById('tb-btn-analysis-save').addEventListener('click', listenerSynthSave, false);
    document.getElementById('tb-btn-analysis-export-csv').addEventListener('click', listenerCSVExport, false);
    document.getElementById('synth-also-slider').addEventListener('change', listenerSliderMove, false);
} // initSynthPane()
