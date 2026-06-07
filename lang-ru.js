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

LANG_AVAILABLE.push({ru: 'Русский'});

LSTR['ru'] = {
    dafuq: '*** Ошибка "жопа есть, а слова нет". В версии "ru" нет текста для: ',

    // units
    mm: 'мм',
    m: 'м',
    inches: 'дюймов',
    yards: 'ярдов',
    
    // UI
    appname: 'стрелковый целкометр',
    description: 'Название',
    unitsselect: 'Выбрать систему мер',
    unitslabel: 'Система мер',
    unitsmetricname: 'метрическая',
    unitsmetricdescription: 'Метрическая (весь мир, кроме США и Либерии)',
    unitsimpname: 'английская',
    unitsimpdescription: 'Английская, ярды/футы/дюймы (США и Либерия)',
    defaultnewdescription: '[безымянный прожэкт]',

    inputsanitydesc: 'как назовём прожэкт?',
    inputsanitydistinvalid: 'от 5 до 3000',
    inputsanitycalinvalid: 'калибр > 0 и до 20мм / 0.8"',
    inputsanityyousure: 'что, правда?',
    inputsanityok: 'OK',

    inputeditinfo: 'Изменить (ИЗМЕНА!)',
    inputok: 'Так его!',
    inputcancel: 'Отказать',

    confirmnewproj: 'Всё забыть, начать сначала?',
    
    targetadd: 'Добавить мишень',
    targetdelconfirm: 'Удалить мишень?',
    
    targetlabel: 'Мишень',
    grouplabel: 'Серия',
    espread: 'Маразб',
    noimgselected: 'Шалом. Надо выбрать картинку с мишенью.',
    
    uifooter: 'Пуля дура!',
    
    addimgtitle: 'повернуть как надо, и подтвердить',
    optimiseimgcheck: 'Оптимизировать разрешение картинки (чтобы не тормозило)',

    notyetknown: '[пока неизвестно]',
    
    resetscaleconfirm: 'Масштаб для этой мишени уже задан. Поменять?',
    deletegroupconfirm: 'Удалить серию со всеми ея пробоинами?',
    deleteshotconfirm: 'Удалить последнюю пробоину в серии?',
    
    showinfoboxes: 'Рисовать информацию о сериях',

    // summary pane
    noshotsselected: 'Анализировать пока нечего. Сперва надо отметить пробоины.',
    
    distance: 'Дистанция',
    calibre: 'Калибр',
    shotcount: 'Выстрелов',
    confidenceinterval: 'Довер. инт.',
    avgpoi: 'СТП',
    grid: 'Сетка',
    poatargetcentre: 'Точка прицеливания', 
    r95confmargin: 'R95 и Д.И.',
    
    confimetertitle: 'Уровень достоверности',
    
    cnfdEXCELLENT: 'ОТЛИЧНО',
    cnfdGOOD: 'ХОРОШО',
    cnfdFAIR: 'СРЕДНЕ',
    cnfdPOOR: 'ПЛОХО',
    cnfdCRAP: 'ЕРУНДА',
    cnfdBSTS: '(порог туфты)',
    
    cnfdURURA: 'ШКАЛА УРУРА:',
    cnfdmargin: 'довер. интервал',
    
    confitxt0l1: 'Вздор',
    confitxt0l2: '',
    confitxt1l1: 'Едва ли',
    confitxt1l2: 'значимо',
    confitxt2l1: 'Плохо',
    confitxt2l2: '',
    confitxt3l1: 'Средне',
    confitxt3l2: '',
    confitxt4l1: 'Выше',
    confitxt4l2: 'среднего',
    confitxt5l1: 'Хорошо',
    confitxt5l2: '',
    confitxt6l1: 'Очень',
    confitxt6l2: 'хорошо',
    confitxt7l1: 'Отлично',
    confitxt7l2: '(IDKFA!)',

    // summary / analysis pane
    display: 'Показывать',
    sigma: 'сигма',
    gridnone: 'откл.',
    
    helpdocstitle: 'Инструкции',
    helpdocscontent: '<p>Хомяк (англ.): <a href="http://guns.ptosis.ch/ru/taran-ru">http://guns.ptosis.ch/ru/taran-ru</a></p>' +
        '<p>Инструкция по эксплуатации (англ.): <a href="http://guns.ptosis.ch/node/26">http://guns.ptosis.ch/node/26</a></p>' +
        '<p>Ответы на вопросы (англ.): <a href="http://guns.ptosis.ch/faq-page">http://guns.ptosis.ch/faq-page</a></p>' +
        '<p>Скачать последнюю версию: <a href="http://guns.ptosis.ch/node/43">http://guns.ptosis.ch/node/43</a></p>' +
        '<p>Использовать последнюю версию прямо с сайта: <a href="http://taran.ptosis.ch/">http://taran.ptosis.ch/</a></p>' +
        '<p>Обратная связь (баги, фичи, комментарии): <a href="http://guns.ptosis.ch/contact">http://guns.ptosis.ch/contact/</a></p>',
    helpinspirtitle: 'Вдохновление',
    helpthankstitle: 'Благодарности'
};

