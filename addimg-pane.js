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

var IAPWMAXSIZE = 500; // max size of preview canvas
var OPTIMGSIZE = 2048; // max resolution to scale down to


var iarot = 0; // rotation of the image being added
    // 0..3 clockwise increments of 90 degrees

var iob = null; // the actual image object

function setAddimgPaneLanguage() {
    setElementText('addimg-title', LSTX('addimgtitle'));
    setElementText('addimg-scaledown-description', LSTX('optimiseimgcheck'));
} // function setAddimgPaneLanguage()

function drawIAPreview() {
    var can = document.getElementById('rotate-tn-canvas');
    var con = can.getContext('2d');
    
    var maxis = (iob.height > iob.width) ? iob.height : iob.width;
    if (maxis <= OPTIMGSIZE) { hideElement('addimg-scaledown-block'); }
    else { unhideElement('addimg-scaledown-block'); }
    var scale = IAPWMAXSIZE / maxis;
    
    can.width = IAPWMAXSIZE;
    can.height = IAPWMAXSIZE;
    
    con.fillStyle="#AAAAAA";
    con.fillRect(0, 0, can.width, can.height);
    con.save();
    con.translate(can.width / 2, can.height / 2);
    con.rotate(iarot * Math.PI / 2);
    con.drawImage(iob, -(iob.width * scale / 2), -(iob.height * scale / 2), iob.width * scale, iob.height * scale);
    con.restore();
} // function drawIAPreview()

function drawIAGood() {
    var can = document.getElementById('rotate-bg-canvas');
    var con = can.getContext('2d');
    
    var maxis = (iob.height > iob.width) ? iob.height : iob.width;
    var scale = OPTIMGSIZE / maxis;

    if ( (scale > 1) || !(document.getElementById('addimg-scaledown').checked) ) { scale = 1; }
        
    if (iarot % 2) {
        can.width = iob.height * scale;
        can.height = iob.width * scale;
    }
    else {
        can.height = iob.height * scale;
        can.width = iob.width * scale;
    }
    con.save();
    con.translate(can.width / 2, can.height / 2);
    con.rotate(iarot * Math.PI / 2);
    con.drawImage(iob, -(iob.width * scale / 2), -(iob.height * scale / 2), iob.width * scale, iob.height * scale);
    con.restore();
} // function drawIAGood()

function imageAddSelect(img, filename) {
    iarot = 0;
    iob = img;
    ifn = filename;
    drawIAPreview();
} // function imageAddSelect()

function imageAddRotateLeft() {
    iarot = (iarot - 1) % 4;
    drawIAPreview();
} // function imageAddRotateLeft()

function imageAddRotateRight() {
    iarot = (iarot + 1) % 4;
    drawIAPreview();
} // function imageAddRotateRight()

function imageAddAccept() {
    drawIAGood();
    // unhideElement('rotate-bg-canvas');
    // return;

    imgObj = new Image();
    imgObj.onload = function(e) {
        var sheet = new Sheet(ifn, imgObj);
        samevik.sheets.push(sheet);
        csheet = sheet;
        cgroup = null;
        // gotimg = true;
        setZoomFit();
        drawScreen();
        displayTargetsInfo();
        displayProjectInfo();
        setActivePane('target');
    }
    imgObj.src = document.getElementById('rotate-bg-canvas').toDataURL();
    
} // function imageAddAccept()

function imageAddCancel() {
    iob = null;
    document.getElementById('fileSelector').value = null;
    setActivePane('project');
} // function imageAddCancel()

function initAddimgPane() {
    document.getElementById('tb-btn-img-rotate-left').addEventListener('click', imageAddRotateLeft, false);
    document.getElementById('tb-btn-img-rotate-right').addEventListener('click', imageAddRotateRight, false);
    document.getElementById('tb-btn-ok').addEventListener('click', imageAddAccept, false);
    document.getElementById('tb-btn-cancel').addEventListener('click', imageAddCancel, false);
} // function initAddimgPane()

