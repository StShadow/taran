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

var version = '1.1 (yojeg1)';
var homeurl = 'http://taran.ptosis.ch/';

var samevik = null;
var csheet = null; // current sheet
var cgroup = null; // current group
var activepane = '';

var instructions = ""; // instructions for current step

function displayInstructions(text) {
    instructions = (text) ? text : "";
    // document.getElementById("instructions").innerHTML = instructions;
} // function displayInstructions(text)

function promptDownload(content, filename) {
    var contentType = 'application/octet-stream';
    var a = document.getElementById("download-file");
    var blob = new Blob([content], {'type':contentType});
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    a.href="#";
} // function promptDownload(content, filename)

function handleProjectOpen(evt) {
    var file = evt.target.files[0];

    console.log("opening...");
    
    if (file) {
        console.log("reading...");
        var reader = new FileReader();
        reader.onload = function(e) {
            console.log("onload kicked in");
            var xmlString = e.target.result;
            // console.log(xml);
            samevik = new Samevik();
            csheet = null;
            cgroup = null;
            dragon = false;
            // gotimg = false;
            zoom = 1;
            zoomfit = true;
            settingscale = false;
            instructions = "";
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlString, "text/xml");
            samevik.fromXML(xmlDoc);
            if (samevik.sheets[0]) {
                csheet = samevik.sheets[0];
                if (csheet.groups[0]) {
                    cgroup = csheet.groups[0];
                }
            }
            console.log("done reading from xml");
            // document.getElementById('btn-analyse').addEventListener('click', listenerAnalyse, false);
            setActivePane('project');
            displayProjectInfo();
            displayTargetsInfo();
            synthSVG.gridSVG.mrad = samevik.metric;
        };
        console.log(file.name);
        reader.readAsText(file);
    }
} // function handleProjectOpen(evt)

function listenerProjectOpen(evt) {
    console.log("open clicked");
    document.getElementById('input-open-project').click();
} // function listenerProjectOpen(evt)

function listenerProjectSave(evt) {
    var filename = samevik.description.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    filename = (filename) ? (filename + '.xml') : 'noname_taran.xml';
    promptDownload(samevik.toXML(), filename);
} // function listenerProjectSave(evt)

function listenerProjectNew(evt) {
    if (samevik.dist) {
        var answer = confirm(LSTX('confirmnewproj'));
        if (!answer) {
            console.log("user canceled new project");
            return false;
        }        
    }
    
    samevik = new Samevik();
    csheet = null;
    cgroup = null;
    dragon = false;
    // gotimg = false;
    displayProjectInfo();
    displayTargetsInfo();    
} // function listenerProjectNew(evt)

function selectShtGrp(id) {
    var nsi = -1; // new sheet
    var ngi = -1; // new group
    var sg = null; // temp array
    var jumptotarget = false; // whether to switch to target pane
    var dodeletetarget = false;
    
    // get sheet and group ids
    if (id.substr(0,18) == 'table-info-target-') {
        nsi = parseInt(id.substr(18));
        dodeletetarget = true;
    }
    else if (id.substr(0,17) == 'table-info-group-') {
        sg = id.substr(17).split('-');
        nsi = parseInt(sg[0]);
        ngi = parseInt(sg[1]);
    }
    else if (id.substr(0,17) == 'table-info-image-') {
        nsi = parseInt(id.substr(17));
        jumptotarget = true;
    }
    else {
        console.log("select sht+grp wrong id given: " + id);
        return false;
    }
    
    if ( (nsi < 0) || (nsi >= samevik.sheets.length) ) { return false; }
    if (!(samevik.sheets[nsi].groups.length)) {
        ngi = -1;
    }
    else if ( (ngi < 0) || (ngi >= samevik.sheets[nsi].groups.length) ) {
        ngi = 0;
    }
    
    csheet = samevik.sheets[nsi];
    cgroup = samevik.sheets[nsi].groups[ngi];
    imgObj = csheet.image;
    // gotimg = true;    
    if (jumptotarget) {
        csheet.updateStats();
        setActivePane('target');
        drawScreen();
        // displayProjectInfo();
    }
    else {
        if ( dodeletetarget && confirm(LSTX('targetdelconfirm')) ) {
            samevik.sheets.splice(nsi,1);
            csheet = null;
            cgroup = null;
            imgObj = null;
            // gotimg = false;              
        }
        displayTargetsInfo();
    }
} // function selectShtGrp(evt.target.parentNode.id)

function setElementText(id, text) {
    var el = document.getElementById(id);
    while (el.lastChild) {
        el.removeChild(el.lastChild);
    }
    var t = document.createTextNode(text);
    el.appendChild(t);
} // function setText(elid, text)

function hideElement(id) {
    var el = document.getElementById(id);
    if (!el.className.match(/hidden/)) {
        el.className += ' hidden';
    }
} // function hideElement(id)

function unhideElement(id) {
    var el = document.getElementById(id); 
    el.className = el.className.replace(/\s*hidden\s*/g,' ');;
} // function unhideElement(id)

function highlightButton(id) {
    var el = document.getElementById(id);
    if (!el.className.match(/tb-btn-selected/)) {
        el.className += ' tb-btn-selected';
    }
} // function highlightButton(id)

function unhighlightButton(id) {
    var el = document.getElementById(id); 
    el.className = el.className.replace(/\s*tb-btn-selected\s*/g,' ');;
} // function unhighlightButton(id)

function brightButton(id) {
    var el = document.getElementById(id);
    if (!el.className.match(/tb-btn-bright/)) {
        el.className += ' tb-btn-bright';
    }
} // function brightButton(id)

function unbrightButton(id) {
    var el = document.getElementById(id); 
    el.className = el.className.replace(/\s*tb-btn-bright\s*/g,' ');;
} // function unbrightButton(id)

function setActivePane(pane) {
    activepane = pane;
    switch (pane) {
    case 'project':
        hideElement('toolbox-addimg');
        unhideElement('toolbox-general');

        unhideElement('pane-content-project');
        hideElement('pane-content-addimg');
        hideElement('pane-content-target');
        hideElement('pane-content-analysis');
        hideElement('pane-content-help');

        unhideElement('toolbar-project');
        hideElement('toolbar-target');
        hideElement('toolbar-analysis');
        highlightButton('tb-btn-project');
        unhighlightButton('tb-btn-target');
        unhighlightButton('tb-btn-analysis');
        unhighlightButton('tb-btn-help');
        
        for (var i = 0; i < samevik.sheets.length; i++) {
            samevik.sheets[i].updateStats();
        }
        displayTargetsInfo();
        break;
    case 'addimage':
        unhideElement('toolbox-addimg');
        hideElement('toolbox-general');

        hideElement('pane-content-project');
        unhideElement('pane-content-addimg');
        hideElement('pane-content-target');
        hideElement('pane-content-analysis');
        hideElement('pane-content-help');
        break;
    case 'target':
        hideElement('toolbox-addimg');
        unhideElement('toolbox-general');

        hideElement('pane-content-project');
        hideElement('pane-content-addimg');
        unhideElement('pane-content-target');
        hideElement('pane-content-analysis');
        hideElement('pane-content-help');

        hideElement('toolbar-project');
        unhideElement('toolbar-target');
        hideElement('toolbar-analysis');
        unhighlightButton('tb-btn-project');
        highlightButton('tb-btn-target');
        unhighlightButton('tb-btn-analysis');
        unhighlightButton('tb-btn-help');

        if (csheet) { setCtrlMode('base'); }
        // handlerWindowResizePaneImage();
        break;
    case 'summary':
        hideElement('toolbox-addimg');
        unhideElement('toolbox-general');

        hideElement('pane-content-project');
        hideElement('pane-content-addimg');
        hideElement('pane-content-target');
        unhideElement('pane-content-analysis');
        hideElement('pane-content-help');

        hideElement('toolbar-project');
        hideElement('toolbar-target');
        unhideElement('toolbar-analysis');
        unhighlightButton('tb-btn-project');
        unhighlightButton('tb-btn-target');
        highlightButton('tb-btn-analysis');
        unhighlightButton('tb-btn-help');
        
        // handlerWindowResizePaneSynth();
        synthSVG.setScale();
        samevik.synthStats();
        synthSVG.applyView();
        break;
    case 'help':
        hideElement('toolbox-addimg');
        unhideElement('toolbox-general');

        hideElement('pane-content-project');
        hideElement('pane-content-addimg');
        hideElement('pane-content-target');
        hideElement('pane-content-analysis');
        unhideElement('pane-content-help');

        hideElement('toolbar-project');
        hideElement('toolbar-target');
        hideElement('toolbar-analysis');
        unhighlightButton('tb-btn-project');
        unhighlightButton('tb-btn-target');
        unhighlightButton('tb-btn-analysis');
        highlightButton('tb-btn-help');
        break;
    }
    listenerWindowResize();
} // function setActivePane(pane)

function listenerWindowResize(evt) {
    var maxx = window.innerWidth;
    var maxy = window.innerHeight;
    
    var cpanes = document.getElementsByClassName("pane-content");
    for (var i = 0; i < cpanes.length; i++) {
        cpanes[i].style.width = (maxx - 256) + 'px';
        cpanes[i].style.height = (maxy - 16) + 'px';
    }
    handlerWindowResizePaneImage(evt);
    handlerWindowResizePaneSynth(evt);
} // function listenerWindowResize(evt)

function initAll() {
    samevik = new Samevik();
    
    window.addEventListener("resize", listenerWindowResize);

    // set listeners on main controls
    document.getElementById('input-open-project').addEventListener('change', handleProjectOpen, false);
    document.getElementById('tb-btn-project-new').addEventListener('click', listenerProjectNew, false);
    document.getElementById('tb-btn-project-open').addEventListener('click', listenerProjectOpen, false);
    document.getElementById('tb-btn-project-save').addEventListener('click', listenerProjectSave, false);

    setInterfaceLanguage(localStorage.getItem('defaults.lang'));
    createLanguageSelector();

    initImgPane();
    initAddimgPane()
    initProjPane();
    initSynthPane();
    
    initToolbar();
    
    listenerWindowResize();
    setActivePane('project');
} // function initAll()

initAll();
