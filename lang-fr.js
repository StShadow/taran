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

LANG_AVAILABLE.push({fr: 'Français'});

LSTR['fr'] = {
    dafuq: '*** Erreur: en version linguistique "fr" il n\'y a pas de terme pour: ',

    // units
    mm: 'mm',
    m: 'm',
    inches: '"',
    yards: 'yds',
    
    // UI
    appname: 'Calculette de la précision de tir',
    description: 'Titre',
    unitsselect: 'Sélectionner système',
    unitslabel: 'Système de mesures',
    unitsmetricname: 'métrique',
    unitsmetricdescription: 'Métrique (le monde, à part les USA et le Libéria)',
    unitsimpname: '"imperial"',
    unitsimpdescription: 'Anglo-saxon, yards/pouces/pieds (Etas-Unis et Libéria)',
    defaultnewdescription: '[projet sans nom]',

    inputsanitydesc: 'donnez un nom au projet',
    inputsanitydistinvalid: 'entrez la distance entre 5 et 3000',
    inputsanitycalinvalid: 'entrez le calibre > 0 jusqu\'au 20mm / 0.8"',
    inputsanityyousure: 'c\'est vrai?',
    inputsanityok: 'OK',

    inputeditinfo: 'Changer les paramètres',
    inputok: 'Accepter',
    inputcancel: 'Annuler',

    confirmnewproj: 'Tout oublier, tout recommencer?',
    
    targetadd: 'Ajouter une cible',
    targetdelconfirm: 'Vraiment effacer cette cible?',
    
    targetlabel: 'Cible',
    grouplabel: 'Série',
    espread: 'Disp. max.',
    noimgselected: 'Ça y est. Maintenant il faut choisir une image de cible.',
    
    uifooter: 'Connaissance et conquête!',
    
    notyetknown: '[pas encore connu]',
    
    addimgtitle: 'tourner si nécessaire et confirmer',
    optimiseimgcheck: 'Optimiser la résolution (améliore les performances)',
    
    resetscaleconfirm: 'L\'échelle a déjà été établie pour cette cible. Vraiment la changer?',
    deletegroupconfirm: 'Vraiment effacer ce groupe et les impacts associés?',
    deleteshotconfirm: 'Vraiment effacer le dernier impact dans le groupe?',
    
    showinfoboxes: 'Afficher infos groupes',

    // summary pane
    noshotsselected: 'Il n\'y a rien à analyser. Il faut d\'abord marquer les impacts.',
    
    distance: 'Distance',
    calibre: 'Calibre',
    shotcount: 'Nb. de coups',
    confidenceinterval: 'Int. de confiance',
    avgpoi: 'Moyenne des impacts',
    grid: 'Grille',
    poatargetcentre: 'Point de visée', 
    r95confmargin: 'R95 + marge de confiance',
    
    confimetertitle: 'Indice de confiance',
    
    cnfdEXCELLENT: 'EXCELLENT',
    cnfdGOOD: 'BON',
    cnfdFAIR: 'MOYEN',
    cnfdPOOR: 'MAUVAIS',
    cnfdCRAP: 'VAUT RIEN DIRE',
    cnfdBSTS: '(seuil de foutaises)',
    
    // cnfdURURA: 'ECHELLE NICODIF:',
    cnfdURURA: 'ECHELLE URURA:',
    cnfdmargin: 'int. de confiance',
    
    confitxt0l1: 'Inutile',
    confitxt0l2: '',
    confitxt1l1: 'A peine',
    confitxt1l2: 'intéressant',
    confitxt2l1: 'Faible',
    confitxt2l2: '',
    confitxt3l1: 'Moyen',
    confitxt3l2: '',
    confitxt4l1: 'Au-dessus',
    confitxt4l2: 'de la moyenne',
    confitxt5l1: 'Bon',
    confitxt5l2: '',
    confitxt6l1: 'Très',
    confitxt6l2: 'bon',
    confitxt7l1: 'Excellent',
    confitxt7l2: '(IDKFA!)',

    // summary / analysis pane
    display: 'Afficher',
    sigma: 'sigma',
    gridnone: 'aucune',
    
    helpdocstitle: 'Documentation',
    helpdocscontent: '<p>TARAN habite ici: <a href="http://guns.ptosis.ch/fr/taran-fr">http://guns.ptosis.ch/fr/taran-fr</a></p>' +
        '<p>Manuel utilisateur: <a href="http://guns.ptosis.ch/node/48">http://guns.ptosis.ch/node/48</a></p>' +
        '<p>FAQ (pour l\'instant n\'existe qu\'en innegliche): <a href="http://guns.ptosis.ch/faq-page">http://guns.ptosis.ch/faq-page</a></p>' +
        '<p>Télécharger la dernière version: <a href="http://guns.ptosis.ch/node/43">http://guns.ptosis.ch/node/43</a></p>' +
        '<p>Utiliser la dernière version en ligne: <a href="http://taran.ptosis.ch/">http://taran.ptosis.ch/</a></p>' +
        '<p>Retex (bugs, opinions, commentaires): <a href="http://guns.ptosis.ch/contact">http://guns.ptosis.ch/contact/</a></p>',
    helpinspirtitle: 'Inspiration',
    helpthankstitle: 'Remerciements'
};

