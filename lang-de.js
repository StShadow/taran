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

LANG_AVAILABLE.push({de: 'Deutsch'});

LSTR['de'] = {
    dafuq: '*** In der Sprachversion "de" ist kein Text definiert fuer: ',

    // units
    mm: 'mm',
    m: 'm',
    inches: 'Zoll',
    yards: 'Yards',
    
    // UI
    appname: 'Auswertung von Zielscheiben und Berechnung der Streuung',
    description: 'Projektname',
    unitsselect: 'Einheitensystem auswaehlen',
    unitslabel: 'Einheitensystem',
    unitsmetricname: 'metrisch',
    unitsmetricdescription: 'Metrisches System (die ganze Welt ausser USA und Liberia)',
    unitsimpname: 'Angloamerikanisch',
    unitsimpdescription: 'Angloamerikanisch, Yards/Pfund/Zoll (USA und Liberia)',
    defaultnewdescription: '[Namenloses Projekt]',

    inputsanitydesc: 'Wie soll das Projekt genannt werden?',
    inputsanitydistinvalid: 'Zwischen 5 und 3000',
    inputsanitycalinvalid: 'Kaliber > 0 und bis 20mm / 0.8"',
    inputsanityyousure: 'Tatsaechlich?',
    inputsanityok: 'OK',

    inputeditinfo: 'Eingaben aendern',
    inputok: 'Bestaetigen',
    inputcancel: 'Abbrechen',

    confirmnewproj: 'Alles vergessen, von vorne beginnen?',
    
    targetadd: 'Zielscheibe hinzufuegen',
    targetdelconfirm: 'Diese Zielscheibe tatsaechlich entfernen?',
    
    targetlabel: 'Zielscheibe',
    grouplabel: 'Schussgruppe',
    espread: 'Maximale Streuung',
    noimgselected: 'Lebe lang und sei erfolgreich! Es muss ein Zielscheibenbild ausgewaehlt werden.',
    
    uifooter: 'Kenne dein Werkzeug!',
    
    addimgtitle: 'Drehen, wenn erforderlich, und bestaetigen',
    optimiseimgcheck: 'Bildaufloesung optiemieren (beschleunigt die Bearbeitung)',

    notyetknown: '[noch nicht bekannt]',
    
    resetscaleconfirm: 'Fuer diese Zielscheibe ist der Massstab bereits vorgegeben. Aendern?',
    deletegroupconfirm: 'Soll diese Gruppe mit allen Treffern wirklich entfernt werden?',
    deleteshotconfirm: 'Soll der letzte Treffer der Gruppe entfernt werden?',
    
    showinfoboxes: 'Gruppen-information anzeigen',

    // summary pane
    noshotsselected: 'Nichts zum Auswerten vorhanden. Zuerst müssen die Treffer markiert werden.',
    
    distance: 'Entfernung',
    calibre: 'Kaliber',
    shotcount: 'Schusszahl',
    confidenceinterval: 'Vertrauensbereich',
    avgpoi: 'Mittlerer Treffpunkt',
    grid: 'Gitter',
    poatargetcentre: 'Zielpunkt', 
    r95confmargin: 'R95 und V.B.',
    
    confimetertitle: 'Vertrauensmesser',
    
    cnfdEXCELLENT: 'SEHR HOCH',
    cnfdGOOD: 'HOCH',
    cnfdFAIR: 'MITTELMAESSIG',
    cnfdPOOR: 'NIEDRIG',
    cnfdCRAP: 'KEIN VERTRAUEN',
    cnfdBSTS: '(Schwelle des Vertrauens)',
    
    cnfdURURA: ' URURA STUFE:',
    cnfdmargin: ' Vertrauensbereich ',
    
    confitxt0l1: 'Unbrauchbar',
    confitxt0l2: '',
    confitxt1l1: 'Kaum',
    confitxt1l2: 'zu gebrauchen',
    confitxt2l1: 'Schlecht',
    confitxt2l2: '',
    confitxt3l1: 'Mittelmaessig',
    confitxt3l2: '',
    confitxt4l1: 'Ueber dem',
    confitxt4l2: 'Durchschnitt',
    confitxt5l1: 'Gut',
    confitxt5l2: '',
    confitxt6l1: 'Sehr',
    confitxt6l2: 'gut',
    confitxt7l1: 'Hervorragend',
    confitxt7l2: '(IDKFA!)',

    // summary / analysis pane
    display: 'Anzeigen',
    sigma: 'Sigma',
    gridnone: 'AUS',
    
    helpdocstitle: 'Hilfe',
    helpdocscontent: '<p>Home page (eng): <a href="http://guns.ptosis.ch/taran-en">http://guns.ptosis.ch/taran-en</a></p>' +
        '<p>Anleitung (eng): <a href="http://guns.ptosis.ch/node/26">http://guns.ptosis.ch/node/26</a></p>' +
        '<p>FAQ (eng): <a href="http://guns.ptosis.ch/faq-page">http://guns.ptosis.ch/faq-page</a></p>' +
        '<p>Download aktuelle Version: <a href="http://guns.ptosis.ch/node/43">http://guns.ptosis.ch/node/43</a></p>' +
        '<p>Aktuelle Version online nutzen: <a href="http://taran.ptosis.ch/">http://taran.ptosis.ch/</a></p>' +
        '<p>Kontakt (Fehler, Funktionen, Kommentare, Meinungen): <a href="http://guns.ptosis.ch/contact">http://guns.ptosis.ch/contact/</a></p>',
    helpinspirtitle: 'Inspiration',
    helpthankstitle: 'Danke an'
};

