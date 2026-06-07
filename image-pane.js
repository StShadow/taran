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

var point = new Shot(0, 0);
var ptradius = 5;
var ptfill = 'green';
var ptstroke = '#003300';

var canvas = document.getElementById('imgCanvas');
var context = canvas.getContext('2d');

var MAX_CANVAS_X = canvas.width;
var MAX_CANVAS_Y = canvas.height;
var imgObj;

var MIN_IMG_SIZE = 200; // pixels
var MAX_IMG_SIZE = 4000;

var dragon = false;
// var gotimg = false;

var imgoffsetx = 0;
var imgoffsety = 0;
var zoom = 1;
var zoomfit = true;

var ctrlmode = '';

var showinfoboxes = false;

function scrollCanvasTo(tox, toy) {
    window.scrollBy(tox + 256 - window.pageXOffset - window.innerWidth/2, toy - window.pageYOffset - window.innerHeight/2);
} // function scrollCanvasTo(tox, toy)

function handlerWindowResizePaneImage(evt) {
    if (activepane == 'target') {
        var box = document.getElementById("canvasbox");
        canvas.width  = box.offsetWidth;
        canvas.height = box.offsetHeight;
        MAX_CANVAS_X = canvas.width;
        MAX_CANVAS_Y = canvas.height;
        if (imgObj && zoomfit) { setZoomFit(); }
        drawScreen();
    }
} // handlerWindowResizePaneImage(evt)

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
} // function getMousePos(evt)

function writeMessage(message) {
    drawScreen();
    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '20px sans-serif';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
} // function writeMessage(message)

function drawCircle(x, y, radius, colour, border) {
    var r = (radius <= 0) ? (samevik.cal * csheet.scale * zoom / 2) : radius;
    // console.log("radius = " + radius + " / r = " + r);
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.fillStyle = colour;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = border;
    context.stroke();        
} // function drawCircle(x, y)

function drawLine(x1, y1, x2, y2, colour) {
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = colour;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();    
} // function drawLine()

function drawScale() {
    if (csheet.scale) {
        // console.log("scale = " + csheet.scale + " :: len " + csheet.scalelen);
        drawLine(csheet.scalept1.x * zoom, csheet.scalept1.y  * zoom, csheet.scalept2.x * zoom, csheet.scalept2.y * zoom, 'green');
        context.font = '20px sans-serif';
        context.fillStyle = 'green';
        context.strokeStyle = 'white';
        context.lineWidth = '0.5';
        context.textAlign = 'center';
        context.textBaseline = 'bottom';
        context.fillText("" + csheet.scalelen + sUnitsLen(), (csheet.scalept1.x + csheet.scalept2.x) * zoom / 2, (csheet.scalept1.y + csheet.scalept2.y) * zoom / 2);
        context.strokeText("" + csheet.scalelen + sUnitsLen(), (csheet.scalept1.x + csheet.scalept2.x) * zoom / 2, (csheet.scalept1.y + csheet.scalept2.y) * zoom / 2);
        // context.fillText("" + csheet.scalelen + "мм", 20, 20);
    }
    else switch (ctrlmode) {
    case 'scale3':
        drawCircle(csheet.scalept2.x * zoom, csheet.scalept2.y * zoom, ptradius, 'lime', 'white');
        drawLine(csheet.scalept1.x * zoom, csheet.scalept1.y * zoom, csheet.scalept2.x * zoom, csheet.scalept2.y * zoom, 'lime');
    case 'scale2':
        drawCircle(csheet.scalept1.x * zoom, csheet.scalept1.y * zoom, ptradius, 'lime', 'white');
    }
} // function drawScale()

function drawPOA(selectall) {
    var colour = '';
    var stroke = '';
    for (var i = 0; i < csheet.groups.length; i++) {
        if ( selectall || (csheet.groups[i] == cgroup) ) { // selected group
            colour = 'rgba(255, 0, 0, 1)';
            stroke = 'white';
        }
        else {
            colour = 'rgba(128, 0, 0, 1)';
            stroke = 'black';
        }        // console.log("POA = " + cgroup.cx * zoom + " : " + cgroup.cy * zoom);
        drawCircle(csheet.groups[i].cx * zoom, csheet.groups[i].cy * zoom, -1, colour, stroke);
    }
} // function drawPOA()

function drawShots(selectall) {
    if (!csheet) {
        return false; // nothing to do, no group defined
    }
    var colour = '';
    var stroke = '';
    for (var i = 0; i < csheet.groups.length; i++) {
        for (var j = 0; j < csheet.groups[i].shots.length; j++) {
            if ( selectall || (csheet.groups[i] == cgroup) ) { // selected group
                colour = 'rgba(0, 0, 255, 0.5)';
                stroke = 'yellow';
            }
            else {
                colour = 'rgba(0, 0, 128, 0.5)';
                stroke = 'black';
            }
            drawCircle(csheet.groups[i].shots[j].x * zoom, csheet.groups[i].shots[j].y * zoom, -1, colour, stroke);
        }
    }
} // function drawShots()

function drawStats(selectall) {
    // console.log('entering draw stats');
    if (selectall) {
        for (var i = 0; i < csheet.groups.length; i++) {
            drawCircle(csheet.groups[i].stats.poix * zoom, csheet.groups[i].stats.poiy * zoom, -1, 'orange', 'white');
            drawLine(csheet.groups[i].shots[cgroup.stats.m1].x * zoom, csheet.groups[i].shots[cgroup.stats.m1].y * zoom,
                csheet.groups[i].shots[cgroup.stats.m2].x * zoom, csheet.groups[i].shots[cgroup.stats.m2].y * zoom,
                'blue');
        }
        return;
    }
    if ( (!cgroup) || (!cgroup.stats.poix) ){
        // console.log('no stats yet');
        return false; // nothing to do, no stats defined
    }
    drawCircle(cgroup.stats.poix * zoom, cgroup.stats.poiy * zoom, -1, 'orange', 'white');
    drawLine(cgroup.shots[cgroup.stats.m1].x * zoom, cgroup.shots[cgroup.stats.m1].y * zoom,
        cgroup.shots[cgroup.stats.m2].x * zoom, cgroup.shots[cgroup.stats.m2].y * zoom,
        'blue');
} // function drawStats()

function drawStatsInfoboxes() {
    var x = 0;
    var y = 0;
    var dx = 0;
    var dy = 0;
    var dd = 0;
    var cals = samevik.cal * csheet.scale * zoom;
    context.strokeStyle = 'black';
    context.lineWidth = cals * 0.03;
    for (var i = 0; i < csheet.groups.length; i++) {
        if (csheet.groups[i].shots.length > 1) {
            // opposite to POI from POA
            dx = (csheet.groups[i].cx - csheet.groups[i].stats.poix);
            dy = (csheet.groups[i].cy - csheet.groups[i].stats.poiy);
            dd = Math.sqrt(dx*dx + dy*dy);
            dx = dx * 4.5 * cals / dd;
            dy = dy * 3 * cals / dd;
            // centre of the box
            x = csheet.groups[i].cx * zoom + dx;
            y = csheet.groups[i].cy * zoom + dy;
            // move to top-left
            x = x - 2.5 * cals;
            y = y - 1.25 * cals;
            
            context.fillStyle = 'rgba(255,255,255,0.2)';
            context.fillRect(x, y, 5 * cals, 2.5 * cals);
            context.fillStyle = 'blue';
            context.textAlign = 'start';
            context.font = cals + 'px sans-serif';
            context.fillText(samevik.printLength(csheet.groups[i].stats.es / csheet.scale), x + 0.2*cals, y + 1.2*cals);
            context.strokeText(samevik.printLength(csheet.groups[i].stats.es / csheet.scale), x + 0.2*cals, y + 1.2*cals);

            var dx = Math.round((csheet.groups[i].stats.poix - csheet.groups[i].cx) / csheet.scale * 10) / 10;
            if (dx > 0) { dx = '+' + dx; }
            var dy = Math.round((csheet.groups[i].cy - csheet.groups[i].stats.poiy) / csheet.scale * 10) / 10;
            if (dy > 0) { dy = '+' + dy; }
            celltext = document.createTextNode(dx + ' : ' + dy);
            context.fillStyle = 'orange';
            context.fillText(dx + ':' + dy, x + 0.2*cals, y + 2.4*cals);
            context.strokeText(dx + ':' + dy, x + 0.2*cals, y + 2.4*cals);
        } // if info to display
    } // iterate over groups in sheet
} // function drawStatsInfoboxes()

function drawVersionAndTime() {
    var cals = samevik.cal * csheet.scale * zoom;
    context.strokeStyle = 'white';
    context.lineWidth = cals * 0.01;
    context.font = cals*0.7 + 'px sans-serif';
    var dt = new Date();
    context.fillStyle = 'rgba(255,255,255,0.5)';
    var vers = 'TARAN v.' + version + ' - ' + homeurl + ' - ' + dt.toString();
    var bw = context.measureText(vers).width;
    context.fillRect(imgObj.width * zoom - 1.5*cals - bw, imgObj.height * zoom - 2*cals, bw + 0.5*cals, cals);
    var tit = ((samevik.description) ? samevik.description : LSTX('defaultnewdescription')) + ': ' +
        ((samevik.dist) ? (samevik.printDist(samevik.dist)  + ', ') : '') +
        ((samevik.cal) ? (samevik.cal + sUnitsLen()) : '');
    bw = context.measureText(tit).width;
    context.fillRect(cals, cals, bw + cals, cals);
    context.fillStyle = 'black';
    context.textAlign = 'end';
    context.fillText(vers, imgObj.width * zoom - cals, imgObj.height * zoom - cals);
    context.strokeText(vers, imgObj.width * zoom - cals, imgObj.height * zoom - cals);
    context.textAlign = 'start';
    context.fillText(tit, 1.5*cals, 1.9*cals);
    context.strokeText(tit, 1.5*cals, 1.9*cals);
} // function drawVersionAndTime()

function drawOtherTargetOnOtherCanvas(sheet, can) {
    var ocan = canvas;
    var ocon = context;
    var osheet = csheet;
    var ozoom = zoom;
    // var oscale = scale;

    canvas = can;
    context = canvas.getContext('2d');
    csheet = sheet;
    zoom = can.width / sheet.image.width;
    // scale = sheet.scale;
    context.drawImage(sheet.image, 0, 0, can.width, can.height);

    if (sheet.scale) {
        drawPOA();
        drawShots();
        
        for (var i = 0; i < sheet.groups.length; i++) {
            if (sheet.groups[i] == cgroup) {
                drawStats();
                break;
            }
        }
    }
    
    canvas = ocan;
    context = ocon;
    csheet = osheet;
    zoom = ozoom;
    // scale = oscale;
} // function drawOtherTargetOnOtherCanvas(sheet, can)

function drawScreen(selectall) {
    var iaspect;
    var ox = 0;
    var oy = 0;
    
    context.fillStyle="#AAAAAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // console.log("---redraw---");
    if (csheet) { imgObj = csheet.image; }
    if (imgObj) {
        canvas.width = imgObj.width * zoom; 
        canvas.height = imgObj.height * zoom; 
        context.drawImage(imgObj, 0, 0, canvas.width, canvas.height);
        drawScale();
        drawPOA(selectall);
        drawShots(selectall);
        drawStats(selectall);
        if (selectall || (showinfoboxes && (ctrlmode == 'base')) ) {
            drawStatsInfoboxes();
        }
        displayTargetInfoPane();
    } // if got img
    else {
        context.font = '30px sans-serif';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.fillText(LSTX('noimgselected'), canvas.width / 2, canvas.height / 2);
    } // if no img
    if (selectall) { drawVersionAndTime(); }
} // function drawScreen()

function listenerMouseUp(evt) {
    canvas.addEventListener("mousedown", listenerMouseDown, false);
    canvas.removeEventListener("mouseup", listenerMouseUp);
    canvas.style.cursor = "default";
    if (dragon) {
        dragon = false;
        canvas.removeEventListener("mousemove", listenerMouseMove);
        var mousepos = getMousePos(evt);
        point.x = mousepos.x;
        point.y = mousepos.y;
    }
} // function listenerMouseUp(evt)

function listenerMouseDown(evt) {
    var mousePos = getMousePos(evt);
    drawScreen();
    dragon = true;
    canvas.addEventListener("mousemove", listenerMouseMove, false);
    canvas.removeEventListener("mousedown", listenerMouseDown);
	canvas.addEventListener("mouseup", listenerMouseUp, false);
    if (ctrlmode == 'scale2') {
        drawLine(csheet.scalept1.x * zoom, csheet.scalept1.y * zoom, mousePos.x, mousePos.y, ptfill);
    }
    drawCircle(mousePos.x, mousePos.y, ptradius, ptfill, ptstroke);
    canvas.style.cursor = "crosshair";
} // function listenerMouseDown(evt)

function listenerMouseMove(evt) {
    var mousePos = getMousePos(evt);
    var message = 'Mouse position: ' + mousePos.x + ' :: ' + mousePos.y;
    // writeMessage(message);
    drawScreen();
    if (ctrlmode == 'scale2') {
        drawLine(csheet.scalept1.x * zoom, csheet.scalept1.y * zoom, mousePos.x, mousePos.y, ptfill);
    }
    drawCircle(mousePos.x, mousePos.y, ptradius, ptfill, ptstroke);
} // function listenerMouseMove(evt)

function adjustZoom(scale) {
    var newzoom = zoom * scale;
    var imin = (imgObj.width < imgObj.height) ? imgObj.width : imgObj.height;  
    var imax = (imgObj.width > imgObj.height) ? imgObj.width : imgObj.height;  

    // console.log("newzoom = " + newzoom);
    
    zoomfit = false;

    if (imax * newzoom > MAX_IMG_SIZE) {
        zoom = MAX_IMG_SIZE / imax;
        // console.log("newzoom too big");
        return false;
    }

    if (imin * newzoom < MIN_IMG_SIZE) {
        zoom = MIN_IMG_SIZE / imin;
        // console.log("newzoom too small");
        return false;
    }

    zoom = newzoom;
    return true;
} // function adjustZoom(delta)

function setZoomFit() {
    zoom = ((imgObj.width / imgObj.height) > (MAX_CANVAS_X / MAX_CANVAS_Y)) ?
        (MAX_CANVAS_X / imgObj.width) : (MAX_CANVAS_Y / imgObj.height);
    zoomfit = true;
} // function setZoomFit()

function listenerZoomIn(evt) {
    adjustZoom(1.1);
    // console.log("zoomin: " + zoom);
    drawScreen();
} // function listenerZoomIn(evt)

function listenerZoomOut(evt) {
    adjustZoom(0.9);
    //  console.log("zoomout: " + zoom);
    drawScreen();
} // function listenerZoomOut(evt)

function listenerZoomFit(evt) {
    console.log("zoomfit: " + zoom);
    setZoomFit();
    drawScreen();
} // function listenerZoomFit(evt)

function getPoint(radius, fill, stroke) {
    point.x = null;
    point.y = null;
    
    ptradius = radius;
    ptfill = fill;
    ptstroke = stroke;
    canvas.addEventListener('mousedown', listenerMouseDown, false);
}

function saveTargetImage() {
    drawScreen(true);
    var imgurl = canvas.toDataURL();

    // webkit is bork; using imgurl directly as href kills the tab
    // due to some random limit on url deserialisation buffer
    // workaround perversion follows
    
    //take apart data URL
    var parts = imgurl.match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/);

    //assume base64 encoding
    var bin = atob(parts[3]);

    //convert to binary in ArrayBuffer
    var buf = new ArrayBuffer(bin.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < view.length; i++) view[i] = bin.charCodeAt(i);

    var blob = new Blob([view], {'type': parts[1]});

    var a = document.getElementById('download-img');
    a.href = window.URL.createObjectURL(blob);
    var filename = samevik.description.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    filename = (filename) ? (filename + '.png') : 'taran-target.png';
    a.download = filename;
    // a.download = 'taran-target.png';
    a.click();
    a.href="#";
} // function saveTargetImage()


function handleFileSelection(evt) {
    var files = evt.target.files;

    if (files && files.length) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var iob = new Image();
            iob.onload = function(e) {
                console.log("Image loaded -- " + iob.width + ' x ' + iob.height);
                imageAddSelect(iob, files[0].name);
                setActivePane('addimage');
            }
            iob.src = e.target.result;
        };
        reader.readAsDataURL(files[0]);
    }    
} // function handleFileSelection(evt)

function displayTargetInfoPane() {
    // find name
    for (var i = 0; i < samevik.sheets.length; i++) {
        if (samevik.sheets[i] == csheet) {
            setElementText('target-lp-header', samevik.sheets[i].name);
            break;
        }
    }
    // draw thumbnail
    var can = document.getElementById('target-thumbnail');
    can.height = can.width * csheet.image.height / csheet.image.width;
    drawOtherTargetOnOtherCanvas(csheet, can);
    
    // build groups table
    var contel = document.getElementById('groups-info-container');
    while (contel.lastChild) {
        contel.removeChild(contel.lastChild);
    }

    var tabel = document.createElement('table');
    var tabodel = document.createElement('tbody');
    tabel.appendChild(tabodel);
    contel.appendChild(tabel);
    
    for (var i = 0; i < csheet.groups.length; i++) {
        var groupel = document.createElement('tr');
        groupel.id = 'table-tgt-group-' + i;
        var cell = document.createElement('td');
        var celltext = document.createTextNode('#' + (i+1) + ', ' + LSTX('shotcount') + ': ' + csheet.groups[i].shots.length);
        cell.className = "td-target";
        if (csheet.groups[i] == cgroup) {cell.className += ' table-selected'} 
        cell.appendChild(celltext);
        groupel.appendChild(cell);
        tabodel.appendChild(groupel);

        groupel = document.createElement('tr');
        cell = document.createElement('td');
        cell.className = "td-target-stats";

        var spanel = document.createElement('span');
        spanel.className = 'infotext-es';
        celltext = document.createTextNode(samevik.printLength(csheet.groups[i].stats.es / csheet.scale));
        spanel.appendChild(celltext);
        cell.appendChild(spanel);
        celltext = document.createTextNode(' : ');
        cell.appendChild(celltext);
        spanel = document.createElement('span');
        spanel.className = 'infotext-poi';
        if (csheet.groups[i].shots.length > 1) {
            var dx = Math.round((csheet.groups[i].stats.poix - csheet.groups[i].cx) / csheet.scale * 10) / 10;
            if (dx > 0) { dx = '+' + dx; }
            var dy = Math.round((csheet.groups[i].cy - csheet.groups[i].stats.poiy) / csheet.scale * 10) / 10;
            if (dy > 0) { dy = '+' + dy; }
            celltext = document.createTextNode(dx + ' : ' + dy);
        }
        else {
            celltext = document.createTextNode('? : ?');
        }
        spanel.appendChild(celltext);
        cell.appendChild(spanel);
        groupel.appendChild(cell);
        tabodel.appendChild(groupel);
    } // groups loop
    
    setElementText('target-show-infoboxes-text', LSTX('showinfoboxes'));
    setElementText('input-scale-units', sUnitsLen());
} // function displayTargetInfoPane()

function selectGroupOnCurrentTarget(index) {
    if ( (!csheet) || (index >= csheet.groups.length) ) { return false; }
    cgroup = csheet.groups[index];
    drawScreen();
} // function selectGroupOnCurrentTarget(index)

function setCtrlMode(mode) {
    switch (mode) {
    case 'none':
        hideElement('toolbar-target-zoom');
        hideElement('toolbar-target-scale');
        hideElement('toolbar-target-group');
        hideElement('toolbar-target-shot');
        break;
    case 'base':
        unhideElement('toolbar-target-zoom');

        unhideElement('toolbar-target-scale');
        hideElement('input-scale');
        hideElement('input-scale-units');
        hideElement('tb-btn-scale-confirm');
        hideElement('tb-btn-scale-cancel');
        
        if (csheet.scale) { // scale set
            unhideElement('toolbar-target-group');
            if (cgroup) { // group selected
                unhideElement('tb-btn-group-del');
                unhideElement('toolbar-target-shot');
                if (cgroup.shots.length) {
                    unhideElement('tb-btn-shot-del');
                }
                else {
                    hideElement('tb-btn-shot-del');
                }
            }
            else { // no active group
                hideElement('tb-btn-group-del');
                hideElement('toolbar-target-shot');
            }
            hideElement('tb-btn-groupadd-confirm');
            hideElement('tb-btn-groupadd-cancel');
            
            hideElement('tb-btn-shotadd-confirm');
            hideElement('tb-btn-shotadd-cancel');
        }
        else { // scale not set; block anything but set scale
            hideElement('toolbar-target-group');
            hideElement('toolbar-target-shot');
        }
        unbrightButton('tb-btn-scale');
        unbrightButton('tb-btn-group-add');
        unbrightButton('tb-btn-shot-add');
        
        canvas.removeEventListener('mousedown', listenerMouseDown);
        canvas.addEventListener('click', listenerSelectGroup, false);
        break;
    case 'scale1':
    case 'scale2':
        unhideElement('toolbar-target-zoom');
        unhideElement('toolbar-target-scale');
        hideElement('toolbar-target-group');
        hideElement('toolbar-target-shot');

        brightButton('tb-btn-scale');
        hideElement('input-scale');
        hideElement('input-scale-units');
        unhideElement('tb-btn-scale-confirm');
        unhideElement('tb-btn-scale-cancel');
        canvas.removeEventListener('click', listenerSelectGroup);
        break;
    case 'scale3':
        unhideElement('toolbar-target-zoom');
        unhideElement('toolbar-target-scale');
        hideElement('toolbar-target-group');
        hideElement('toolbar-target-shot');

        brightButton('tb-btn-scale');
        unhideElement('input-scale');
        unhideElement('input-scale-units');
        unhideElement('tb-btn-scale-confirm');
        unhideElement('tb-btn-scale-cancel');
        canvas.removeEventListener('click', listenerSelectGroup);
        break;
    case 'addgroup':
        unhideElement('toolbar-target-zoom');
        hideElement('toolbar-target-scale');
        unhideElement('toolbar-target-group');
        hideElement('toolbar-target-shot');

        brightButton('tb-btn-group-add');
        hideElement('tb-btn-group-del');
        unhideElement('tb-btn-groupadd-confirm');
        unhideElement('tb-btn-groupadd-cancel');
        canvas.removeEventListener('click', listenerSelectGroup);
        break;
    case 'addshot':
        unhideElement('toolbar-target-zoom');
        hideElement('toolbar-target-scale');
        hideElement('toolbar-target-group');
        unhideElement('toolbar-target-shot');

        brightButton('tb-btn-shot-add');
        hideElement('tb-btn-shot-del');
        unhideElement('tb-btn-shotadd-confirm');
        unhideElement('tb-btn-shotadd-cancel');
        canvas.removeEventListener('click', listenerSelectGroup);
        break;
    } // switch on mode
    ctrlmode = mode;
} // function setCtrlMode(mode)

function listenerTargetPrev(evt) {
    // find target
    var index = null;
    for (var i = 0; i < samevik.sheets.length; i++) {
        if (samevik.sheets[i] == csheet) {
            index = i;
            index = index - 1;
            if (index < 0) { index = samevik.sheets.length - 1; }
            csheet = samevik.sheets[index];
            if (csheet.groups.length) {
                cgroup = csheet.groups[0];
            }
            else {
                cgroup = null;
            }
            break;
        }
    }
    drawScreen();
} // function listenerTargetPrev(evt)

function listenerTargetNext(evt) {
    var index = null;
    for (var i = 0; i < samevik.sheets.length; i++) {
        if (samevik.sheets[i] == csheet) {
            index = i;
            index = index + 1;
            if (index >= samevik.sheets.length) { index = 0; }
            csheet = samevik.sheets[index];
            if (csheet.groups.length) {
                cgroup = csheet.groups[0];
            }
            else {
                cgroup = null;
            }
            break;
        }
    }
    drawScreen();
} // function listenerTargetNext(evt)

function listenerBtnScale(evt) {
    if (!csheet) return false;
    if ( (csheet.scale) && (!confirm(LSTX('resetscaleconfirm'))) ) {
        return false;
    }
    csheet.scale = 0;
    setCtrlMode('scale1');
    // document.getElementById('btn-ok').addEventListener('click', listenerOkScale, false);
    getPoint(5, 'green', '#003300');
} // function listenerBtnScale(evt)

function listenerBtnScaleConfirm(evt) {
    switch (ctrlmode) {
    case 'scale3':
        l = document.getElementById('input-scale').value;
        if ( (l <= 0) || (l > 500) ) {
            console.log("wrong scale length");
            return false;
        }
        console.log("got scale length");
        csheet.scalelen = l;
        csheet.scale = distBetween(csheet.scalept1, csheet.scalept2) / l; // pixels per mm
        if (cgroup) { cgroup.updateStats(); }
        setCtrlMode('base');
        break;
    case 'scale1':
        if (point.x == null) {
            console.log("no scale point given");
            return false;
        }
        console.log("got scale pt 1");
        csheet.scalept1.x = point.x / zoom;
        csheet.scalept1.y = point.y / zoom;
        setCtrlMode('scale2');
        getPoint(5, 'green', '#003300');
        break;
    case 'scale2':
        if (point.x == null) {
            console.log("no scale point given");
            return false;
        }
        console.log("got scale pt 2");
        csheet.scalept2.x = point.x / zoom;
        csheet.scalept2.y = point.y / zoom;
        canvas.removeEventListener('mousedown', listenerMouseDown);
        setCtrlMode('scale3');
        break;
    default:
        // we should not be here
        setCtrlMode('base');
        return false;
    }
    drawScreen();
} // function listenerBtnScaleConfirm(evt)

function listenerBtnScaleCancel(evt) {
    canvas.removeEventListener('mousedown', listenerMouseDown);
    setCtrlMode('base');
} // function listenerBtnScaleCancel(evt)

function listenerBtnGroupAdd(evt) {
    getPoint(5, 'green', '#003300');
    setCtrlMode('addgroup');
} // function listenerBtnGroupAdd(evt)

function listenerBtnGroupAddConfirm(evt) {
    if (point.x == null)  {
        console.log("no point selected for new group POI");
        return false;
    } // no point selected
    
    var g = new Group();
    cgroup = g;
    csheet.groups.push(g);

    cgroup.cx = point.x / zoom;
    cgroup.cy = point.y / zoom;
    
    console.log("POA at " + cgroup.cx + " : " + cgroup.cy + " pixels");
    
    canvas.removeEventListener('mousedown', listenerMouseDown);
    cgroup.updateStats();
    setCtrlMode('base');
    drawScreen();
} // function listenerBtnGroupAddConfirm(evt)

function listenerBtnGroupAddCancel(evt) {
    canvas.removeEventListener('mousedown', listenerMouseDown);
    setCtrlMode('base');
    drawScreen();
} // function listenerBtnGroupAddCancel(evt)

function listenerBtnGroupDel(evt) {
    if (!cgroup) { return false; }
    scrollCanvasTo(cgroup.cx * zoom, cgroup.cy * zoom);
    if (!confirm(LSTX('deletegroupconfirm'))) { return false; }
    for (var i = 0; i < csheet.groups.length; i++) {
        if (csheet.groups[i] == cgroup) {
            csheet.groups.splice(i,1);
            if (csheet.groups.length) {
                cgroup=csheet.groups[0];
            }
            else {
                cgroup = null;
            }
            break;
        }
    }
    drawScreen();
} // function listenerBtnGroupDel(evt)

function listenerBtnShotAdd(evt) {
    if ( (!cgroup) || (!csheet.scale) ) { // group not defined, nothing to do
        return false;
    }
    getPoint(-1, 'rgba(128, 128, 255, 0.5)', 'white');
    setCtrlMode('addshot');
} // function listenerBtnShotAdd(evt)

function listenerBtnShotAddConfirm(evt) {
    if (point.x == null)  {
        console.log("no point selected for new shot");
        return false;
    } // no point selected
    
    var hole = new Shot(point.x / zoom, point.y / zoom);    
    cgroup.shots.push(hole);
    
    console.log("shot at " + hole.x + " : " + hole.y + " pixels");
    
    canvas.removeEventListener('mousedown', listenerMouseDown);
    cgroup.updateStats();
    setCtrlMode('base');
    drawScreen();
} // function listenerBtnShotAddConfirm(evt)

function listenerBtnShotAddCancel(evt) {
    canvas.removeEventListener('mousedown', listenerMouseDown);
    setCtrlMode('base');
    drawScreen();
} // function listenerBtnShotAddCancel(evt)

function listenerBtnShotDel(evt) {
    if ( (!cgroup) || (!cgroup.shots.length) ) { return false; }
    var shot = cgroup.shots[cgroup.shots.length -1];
    scrollCanvasTo(shot.x * zoom, shot.y * zoom);
    drawCircle(shot.x * zoom, shot.y * zoom, -1, 'black', 'white');

    if (!confirm(LSTX('deleteshotconfirm'))) {
        drawScreen();
        return false;
    }
    
    cgroup.shots.splice(cgroup.shots.length - 1, 1);
    
    cgroup.updateStats();
    drawScreen();
} // function listenerBtnShotDel(evt)

function listenerSelectGroup(evt) {
    var pos = getMousePos(evt);
    pos.x = pos.x / zoom;
    pos.y = pos.y / zoom;
    var rad = samevik.cal * csheet.scale / 2;
    rad = rad*rad;
    for (var i = 0; i < csheet.groups.length; i++) {
        var dx = csheet.groups[i].cx - pos.x;
        var dy = csheet.groups[i].cy - pos.y;
        if ( (dx*dx+dy*dy) <= rad) {
            selectGroupOnCurrentTarget(i);
            break;
        }
    }
} // function listenerSelectGroup(evt)

function listenerGroupsInfoClick(evt) {
    var id = evt.target.parentNode.id;
    if (!id) { return false; }
    var index = id.match(/^table-tgt-group-(\d+)$/)[1];
    selectGroupOnCurrentTarget(index);
} // function listenerGroupsInfoClick(evt)

function listenerInfoboxesToggle(evt) {
    showinfoboxes = document.getElementById('target-show-infoboxes-check').checked;
    drawScreen();
} // function listenerInfoboxesToggle(evt)


function initImgPane() {
    document.getElementById('fileSelector').addEventListener('change', handleFileSelection, false);
    document.getElementById('tb-btn-target-save-img').addEventListener('click', saveTargetImage, false);
    handlerWindowResizePaneImage();
    
    document.getElementById('tb-btn-target-prev').addEventListener('click', listenerTargetPrev, false);
    document.getElementById('tb-btn-target-next').addEventListener('click', listenerTargetNext, false);
    
    document.getElementById('tb-btn-img-zoomin').addEventListener('click', listenerZoomIn, false);
    document.getElementById('tb-btn-img-zoomout').addEventListener('click', listenerZoomOut, false);
    document.getElementById('tb-btn-img-zoomfit').addEventListener('click', listenerZoomFit, false);

    document.getElementById('tb-btn-scale').addEventListener('click', listenerBtnScale, false);
    document.getElementById('tb-btn-scale-confirm').addEventListener('click', listenerBtnScaleConfirm, false);
    document.getElementById('tb-btn-scale-cancel').addEventListener('click', listenerBtnScaleCancel, false);

    document.getElementById('tb-btn-group-add').addEventListener('click', listenerBtnGroupAdd, false);
    document.getElementById('tb-btn-groupadd-confirm').addEventListener('click', listenerBtnGroupAddConfirm, false);
    document.getElementById('tb-btn-groupadd-cancel').addEventListener('click', listenerBtnGroupAddCancel, false);
    document.getElementById('tb-btn-group-del').addEventListener('click', listenerBtnGroupDel, false);
    
    document.getElementById('tb-btn-shot-add').addEventListener('click', listenerBtnShotAdd, false);
    document.getElementById('tb-btn-shotadd-confirm').addEventListener('click', listenerBtnShotAddConfirm, false);
    document.getElementById('tb-btn-shotadd-cancel').addEventListener('click', listenerBtnShotAddCancel, false);
    document.getElementById('tb-btn-shot-del').addEventListener('click', listenerBtnShotDel, false);
    
    document.getElementById('groups-info-container').addEventListener('click', listenerGroupsInfoClick, false);

    document.getElementById('target-show-infoboxes-check').addEventListener('change', listenerInfoboxesToggle, false);
    
    setCtrlMode('none');
} // function initImgPane()
