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

var LANG_AVAILABLE = new Array();

var LANG = 'en'; // global language variable
// available: en, fr, ru
var FALLBACK_LANG = 'en'; // fallback in case translation is not available

var LSTR = new Array();
var CONFI_LEVELS_TXT = new Array();

function LSTX(key) {
    var ltxt = LSTR[LANG][key];
    if (typeof ltxt !== 'undefined') { return ltxt; }
    ltxt = LSTR[FALLBACK_LANG][key];
    if (typeof ltxt !== 'undefined') { return ltxt; }
    return(LSTR[LANG]['dafuq'] + key);
}

function sUnitsDist() {
    return ( (samevik.metric) ? LSTX('m')  : LSTX('yards') ); 
} // function sUnitsDist()

function sUnitsLen() {
    return ( (samevik.metric) ? LSTX('mm')  : LSTX('inches') ); 
} // function sUnitsDist()

function setInterfaceLanguage(lang) {
    if (!lang) {lang = LANG;}
    for (var i = 0; i < LANG_AVAILABLE.length; i++) {
        if (LANG_AVAILABLE[i][lang]) {
            LANG = lang;
            // project info entry
            fillHelpText();
            setProjpaneLanguage();
            displayProjectInfo();
            displayTargetsInfo();
            setAddimgPaneLanguage();
            synthSVG.makeAll();
            synthSVG.applyView();
            return true;
        }
    }
    return false;
} // function setInterfaceLanguage(lang)

function handleLanguageChange() {
    setInterfaceLanguage(document.getElementById('language-selector').value);
    localStorage.setItem('defaults.lang', LANG);
} // function handleLanguageChange()

function createLanguageSelector() {
    var selector = document.getElementById('language-selector');
    var opt;
    var txt;
    
    for (var i = 0; i < LANG_AVAILABLE.length; i++) {
        for (var langcode in LANG_AVAILABLE[i]) {
            // console.log(langcode + ": " + LANG_AVAILABLE[i][langcode]);
            opt = document.createElement('option');
            opt.value = langcode;
            txt = document.createTextNode(LANG_AVAILABLE[i][langcode]);
            opt.appendChild(txt);
            selector.appendChild(opt);
        }
    }
    selector.value = LANG;
    selector.addEventListener('change', handleLanguageChange, false);
} // function createLanguageSelector()
