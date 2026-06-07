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

var seltarget = -1; // index of target selected in the UI
var selgroup = -1; // index of group selected in the UI

var imgloading_total = 0;   // for project load progress display
var imgloading_current = 0;

function setProjpaneLanguage() {
    document.title = 'TARAN ' + version + ' -- ' + LSTX('appname'); 
    setElementText('project-info-string',
        ((samevik.description) ? samevik.description : LSTX('defaultnewdescription')) + ': ' +
        ((samevik.dist) ? (samevik.printDist(samevik.dist)  + ', ') : '') +
        ((samevik.cal) ? (samevik.cal + sUnitsLen()) : '') );
    /* setElementText('info-proj-distance-label', LSTX('distance') + ':');
    setElementText('info-proj-calibre-label', LSTX('calibre') + ':');
    setElementText('info-proj-metric-label', LSTX('unitslabel') + ':');*/
    // setElementText('ui-footer', LSTX('uifooter'));

    setElementText('proj-input-desc-label', LSTX('description') + ':');
    setElementText('proj-input-units-label', LSTX('unitslabel') + ':');
    setElementText('proj-input-units-metric', LSTX('unitsmetricname'));
    setElementText('proj-input-units-imp', LSTX('unitsimpname'));

    listenerUnitsChange();
    
    document.getElementById('proj-input-btn-ok').value = LSTX('inputok');
    document.getElementById('proj-input-btn-edit').value = LSTX('inputeditinfo');
    document.getElementById('proj-input-btn-cancel').value = LSTX('inputcancel');
    listenerValidateChange();
} // setProjpaneLanguage()

function listenerUnitsChange(evt) {
    // console.log(evt.target.value);
    if (document.getElementById('proj-input-units').value == 'metric') {
        setElementText('proj-input-dist-label', LSTX('distance') + ', ' + LSTX('m') + ':');
        setElementText('proj-input-cal-label', LSTX('calibre') + ', ' + LSTX('mm') + ':');
    }
    else {
        setElementText('proj-input-dist-label', LSTX('distance') + ', ' + LSTX('yards') + ':');
        setElementText('proj-input-cal-label', LSTX('calibre') + ', ' + LSTX('inches') + ':');
    }
    listenerValidateChange();
} // listenerUnitsChange(evt)

function listenerValidateChange(evt) {
    var sane = true;
    
    document.getElementById('proj-input-desc').value = stripXMLSpecials(document.getElementById('proj-input-desc').value);
    
    // sanity checks
    if (document.getElementById('proj-input-desc').value) {
        document.getElementById('proj-input-desc-note').className = 'textcolorokay';
        setElementText('proj-input-desc-note', LSTX('inputsanityok'));
    }
    else {
        document.getElementById('proj-input-desc-note').className = 'textcolorwarning';
        setElementText('proj-input-desc-note', LSTX('inputsanitydesc'));
    }
    
    var dist = document.getElementById('proj-input-dist').value;
    
    if ( (dist <= 5) || (dist > 3000) ) {
        document.getElementById('proj-input-dist-note').className = 'textcolorerror';
        setElementText('proj-input-dist-note', LSTX('inputsanitydistinvalid'));
        sane = false;
    }
    else if (dist > 1000) {
        document.getElementById('proj-input-dist-note').className = 'textcolorwarning';
        setElementText('proj-input-dist-note', LSTX('inputsanityyousure'));
    }
    else {
        document.getElementById('proj-input-dist-note').className = 'textcolorokay';
        setElementText('proj-input-dist-note', LSTX('inputsanityok'));
    }
    
    var cal = document.getElementById('proj-input-cal').value;
    if (document.getElementById('proj-input-units').value == 'imp') {
        cal = cal * 25.4;
    }
    
    if ( (cal <= 0) || (cal > 20) ) {
        document.getElementById('proj-input-cal-note').className = 'textcolorerror';
        setElementText('proj-input-cal-note', LSTX('inputsanitycalinvalid'));
        sane = false;
    }
    else if ( (cal < 5) || (cal > 15) ) {
        document.getElementById('proj-input-cal-note').className = 'textcolorwarning';
        setElementText('proj-input-cal-note', LSTX('inputsanityyousure'));
    }
    else {
        document.getElementById('proj-input-cal-note').className = 'textcolorokay';
        setElementText('proj-input-cal-note', LSTX('inputsanityok'));
    }
    
    if (sane) {
        document.getElementById('proj-input-btn-ok').disabled = false;
        // unhideElement('proj-input-btn-ok');
    }
    else {
        document.getElementById('proj-input-btn-ok').disabled = true;
        // hideElement('proj-input-btn-ok');
    }
    
    if (samevik.dist) {
        unhideElement('proj-input-btn-cancel');
    }
    else {
        hideElement('proj-input-btn-cancel');
    }
} // listenerValidateChange(evt)

function listenerApplyProjInfo(evt) {
    samevik.description = stripXMLSpecials(document.getElementById('proj-input-desc').value);
    samevik.dist = document.getElementById('proj-input-dist').value;
    samevik.cal = document.getElementById('proj-input-cal').value;
    samevik.metric = (document.getElementById('proj-input-units').value == 'metric');
    
    localStorage.setItem('defaults.dist', samevik.dist);
    localStorage.setItem('defaults.cal', samevik.cal);
    localStorage.setItem('defaults.metric', (samevik.metric) ? 'true' : 'false');
    
    unhideElement('block-proj-info-display');
    hideElement('block-proj-info-edit');
    displayProjectInfo();
    displayTargetsInfo();
} // function listenerApplyProjInfo(evt)

function listenerDiscardProjInfo(evt) {
    unhideElement('block-proj-info-display');
    hideElement('block-proj-info-edit');
} // function listenerDiscardProjInfo(evt)

function listenerEditProjInfo(evt) {
    if (samevik.dist) {
        document.getElementById('proj-input-desc').value = stripXMLSpecials(samevik.description);
        document.getElementById('proj-input-dist').value = samevik.dist;
        document.getElementById('proj-input-cal').value = samevik.cal;
        document.getElementById('proj-input-units').value = (samevik.metric) ?
            'metric' : 'imp';
    }
    hideElement('block-proj-info-display');
    unhideElement('block-proj-info-edit');
    listenerValidateChange();
} // function listenerDiscardProjInfo(evt)

function displayProjectInfo() {
    var s = '';    // temp

    if (samevik.dist) {
        setElementText('project-info-string',
            ((samevik.description) ? samevik.description : LSTX('defaultnewdescription')) + ': ' +
            ((samevik.dist) ? samevik.printDist(samevik.dist) : '') + ', ' +
            ((samevik.cal) ? (samevik.cal + sUnitsLen()) : '') );
        unhideElement('block-proj-info-display');
        hideElement('block-proj-info-edit');
    }
    else {
        hideElement('block-proj-info-display');
        unhideElement('block-proj-info-edit');
    }
    
} // function displayProjectInfo()

function displayTargetsInfo() {
    // generate_table();
    // return false;
    
    var infocont = document.getElementById('targets-info-container');
    while (infocont.lastChild) {
        infocont.removeChild(infocont.lastChild);
    }
    
    var sheetel = null;
    var tabody = null;
    var groupel = null;
    var cell = null;
    var celltext = "";
    var can = null;
    
    var dx; // temp
    var dy; 
    
    for (var i = 0; i < samevik.sheets.length; i++) {
        sheetel = document.createElement('table');
        sheetel.className = "table-info table-info-target";
        tabody = document.createElement("tbody");
        // console.log(sheetel.textContent);

        groupel = document.createElement('tr');
        groupel.id = 'table-info-target-' + i;

        // insert image column
        cell = document.createElement('td');
        cell.width = 300;
        cell.rowSpan = '' + (samevik.sheets[i].groups.length*3 + 1);
        cell.className = 'td-target-image';
        cell.id = 'table-info-image-' + i;
        if (samevik.sheets[i].image.width > 0) { // got img
            can = document.createElement('canvas');
            can.width = 300;
            can.height = samevik.sheets[i].image.height / samevik.sheets[i].image.width * 300;
            drawOtherTargetOnOtherCanvas(samevik.sheets[i], can)
            // can.getContext("2d").drawImage(samevik.sheets[i].image, 0, 0, can.width, can.height);
            cell.appendChild(can);
        }
        groupel.appendChild(cell);
        // insert target title
        cell = document.createElement('th');
        celltext = document.createTextNode(LSTX('targetlabel') +': ' + samevik.sheets[i].name);
        cell.className = "table-hl";
        // if (samevik.sheets[i] == csheet) {cell.className += ' table-selected'} 
        cell.appendChild(celltext);
        groupel.appendChild(cell);
        tabody.appendChild(groupel);

        for (var j = 0; j < samevik.sheets[i].groups.length; j++) {
            groupel = document.createElement('tr');
            groupel.id = 'table-info-group-' + i + '-' + j;
            cell = document.createElement('td');
            celltext = document.createTextNode(LSTX('grouplabel') + ' #' + (j+1) + ', ' + LSTX('shotcount') + ': ' + samevik.sheets[i].groups[j].shots.length);
            cell.className = "td-target";
            if (samevik.sheets[i].groups[j] == cgroup) {cell.className += ' table-selected'} 
            cell.appendChild(celltext);
            groupel.appendChild(cell);
            tabody.appendChild(groupel);

            groupel = document.createElement('tr');
            cell = document.createElement('td');
            celltext = document.createTextNode(LSTX('espread') + ' = ' + samevik.printLength(samevik.sheets[i].groups[j].stats.es / samevik.sheets[i].scale));
            cell.className = "td-target-stats";
            cell.appendChild(celltext);
            groupel.appendChild(cell);
            tabody.appendChild(groupel);

            groupel = document.createElement('tr');
            cell = document.createElement('td');
            // console.log('poi = ' + samevik.sheets[i].groups[j].stats.poix + ' : ' + samevik.sheets[i].groups[j].stats.poiy);
            // console.log('cp  = ' + samevik.sheets[i].groups[j].cx + ' : ' + samevik.sheets[i].groups[j].cy);
            dx = Math.round((samevik.sheets[i].groups[j].stats.poix - samevik.sheets[i].groups[j].cx) / samevik.sheets[i].scale * 10) / 10;
            if (dx > 0) { dx = '+' + dx; }
            dy = Math.round((samevik.sheets[i].groups[j].cy - samevik.sheets[i].groups[j].stats.poiy) / samevik.sheets[i].scale * 10) / 10;
            if (dy > 0) { dy = '+' + dy; }
            celltext = document.createTextNode(LSTX('avgpoi') + ": " + dx + ' : ' + dy);
            cell.className = "td-target-stats";
            cell.appendChild(celltext);
            groupel.appendChild(cell);
            tabody.appendChild(groupel);
        } // groups loop
        
        sheetel.appendChild(tabody);
        infocont.appendChild(sheetel);
    } // sheets loop

    if (samevik.dist) {
        // append "add target" row
        sheetel = document.createElement('table');
        sheetel.className = "table-info table-info-target";
        tabody = document.createElement("tbody");
        groupel = document.createElement('tr');
        groupel.id = 'table-info-add-target';
        cell = document.createElement('th');
        celltext = document.createTextNode(LSTX('targetadd'));
        cell.className = "table-addt";
        cell.appendChild(celltext);
        groupel.appendChild(cell);
        tabody.appendChild(groupel);
        sheetel.appendChild(tabody);
        infocont.appendChild(sheetel);
    }
} // function displayTargetsInfo()

function listenerTargetinfoClick(evt) {
    // console.log(evt.target.tagName);
    // console.log(evt.target.parentNode.id);
    if (evt.target.parentNode.id == 'table-info-add-target') {
        document.getElementById('fileSelector').click();
    }
    else {
        selectShtGrp(evt.target.parentNode.id);
    }
} // function listenerTargetinfoClick(evt)

function initProjPane() {
    if (samevik.dist) {
        document.getElementById('proj-input-dist').value = samevik.dist;
        document.getElementById('proj-input-cal').value = samevik.cal;
        document.getElementById('proj-input-units').value = (samevik.metric) ? 'metric' : 'imp';
    }
    else {
        // pick defaults
        var defdist = localStorage.getItem('defaults.dist');
        if (!defdist) { defdist = 0; } 
        var defcal = localStorage.getItem('defaults.cal');
        if (!defcal) { defcal = 0; }
        var defmetric = ( localStorage.getItem('defaults.metric') != 'false');
        
        document.getElementById('proj-input-dist').value = defdist;
        document.getElementById('proj-input-cal').value = defcal;
        document.getElementById('proj-input-units').value = (defmetric) ? 'metric' : 'imp';
    }
    listenerUnitsChange();
    // listenerValidateChange();

    document.getElementById('proj-input-units').addEventListener('change', listenerUnitsChange, false);
    
    document.getElementById('proj-input-desc').addEventListener('keyup', listenerValidateChange, false);
    document.getElementById('proj-input-dist').addEventListener('keyup', listenerValidateChange, false);
    document.getElementById('proj-input-cal').addEventListener('keyup', listenerValidateChange, false);
    
    document.getElementById('proj-input-btn-ok').addEventListener('click', listenerApplyProjInfo, false);
    document.getElementById('proj-input-btn-cancel').addEventListener('click', listenerDiscardProjInfo, false);
    document.getElementById('proj-input-btn-edit').addEventListener('click', listenerEditProjInfo, false);

    displayProjectInfo();
    document.getElementById('targets-info-container').addEventListener('click', listenerTargetinfoClick, false);
} // initProjPane()
