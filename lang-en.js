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

LANG_AVAILABLE.push({en: 'English'});

LSTR['en'] = {
    dafuq: '*** no text defined in language "en" for: ',
    
    // units
    mm: 'mm',
    m: 'm',
    inches: '"',
    yards: 'yds',
    
    // UI
    appname: 'target analysis and shooting precision calculator',
    description: 'Title',
    unitsselect: 'Select units',
    unitslabel: 'Units',
    unitsmetricname: 'metric',
    unitsmetricdescription: 'Metric (The World, except USA and Liberia)',
    unitsimpname: '"imperial"',
    unitsimpdescription: 'Imperial, yards/feet/inches (USA and Liberia)',
    defaultnewdescription: '[noname project]',
    
    inputsanitydesc: 'how\'d you call this project?',
    inputsanitydistinvalid: 'input distance between 5 and 3000',
    inputsanitycalinvalid: 'input calibre > 0 up to 20mm / 0.8"',
    inputsanityyousure: 'for real?',
    inputsanityok: 'OK',
    
    inputeditinfo: 'Change settings',
    inputok: 'OK',
    inputcancel: 'Cancel',
    
    confirmnewproj: 'Forget all things and start anew?',
    
    targetadd: 'Add target',
    targetdelconfirm: 'Are you sure you want to delete this target?',
    
    targetlabel: 'Target',
    grouplabel: 'Group',
    espread: 'ES',
    noimgselected: 'Peace! Please select target image.',
    
    uifooter: 'Know your tool',
    
    notyetknown: '[not yet known]',
    
    addimgtitle: 'rotate if needed, confirm',
    optimiseimgcheck: 'Optimise image resolution (improves performance)',
    
    resetscaleconfirm: 'Scale already set for this target. Want to change?',
    deletegroupconfirm: 'Are you sure you want to delete this group and associated shots?',
    deleteshotconfirm: 'Are you sure you want to delete the last shot in the group?',
    
    showinfoboxes: 'Display groups infoboxes',

    // summary pane
    noshotsselected: 'There is nothing to analyse. Mark your shots first.',
    
    distance: 'Distance',
    calibre: 'Calibre',
    shotcount: 'Shot count',
    confidenceinterval: 'Confidence',
    avgpoi: 'Average POI / zero',
    grid: 'Grid',
    poatargetcentre: 'POA / Target centre', 
    r95confmargin: 'R95 &amp; conf. margin',
    
    // confidence-o-meter
    confimetertitle: 'Confidence-o-meter',
    
    cnfdEXCELLENT: 'EXCELLENT',
    cnfdGOOD: 'GOOD',
    cnfdFAIR: 'FAIR',
    cnfdPOOR: 'POOR',
    cnfdCRAP: 'MEANINGLESS',
    cnfdBSTS: '(bullshit threshold)',

    // cnfdURURA: 'COLERS LEVEL:',
    cnfdURURA: 'URURA LEVEL:',
    cnfdmargin: 'confidence margin',
    
    confitxt0l1: 'Useless',
    confitxt0l2: '',
    confitxt1l1: 'Barely',
    confitxt1l2: 'significant',
    confitxt2l1: 'Poor',
    confitxt2l2: '',
    confitxt3l1: 'Fair',
    confitxt3l2: '',
    confitxt4l1: 'Above',
    confitxt4l2: 'average',
    confitxt5l1: 'Good',
    confitxt5l2: '',
    confitxt6l1: 'Very',
    confitxt6l2: 'good',
    confitxt7l1: 'Awesome',
    confitxt7l2: '(IDKFA!)',
    
    // summary / analysis pane
    display: 'Display',
    sigma: 'sigma',
    gridnone: 'OFF',
    
    helpdocstitle: 'Documentation',
    helpdocscontent: '<p>Home page: <a href="http://guns.ptosis.ch/taran-en">http://guns.ptosis.ch/taran-en</a></p>' +
        '<p>User manual: <a href="http://guns.ptosis.ch/node/26">http://guns.ptosis.ch/node/26</a></p>' +
        '<p>FAQ: <a href="http://guns.ptosis.ch/faq-page">http://guns.ptosis.ch/faq-page</a></p>' +
        '<p>Download latest version: <a href="http://guns.ptosis.ch/node/43">http://guns.ptosis.ch/node/43</a></p>' +
        '<p>Use latest version online: <a href="http://taran.ptosis.ch/">http://taran.ptosis.ch/</a></p>' +
        '<p>Retex (bugs, features, comments, opinions): <a href="http://guns.ptosis.ch/contact">http://guns.ptosis.ch/contact/</a></p>',
    helpinspirtitle: 'Inspiration',
    helpthankstitle: 'Gratitude goes to'
};

