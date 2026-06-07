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

function initToolbar() {
    document.getElementById('tb-btn-project').addEventListener('click', function () { setActivePane('project'); }, false);
    document.getElementById('tb-btn-target').addEventListener('click', function () { setActivePane('target'); }, false);
    document.getElementById('tb-btn-analysis').addEventListener('click', function () { setActivePane('summary'); }, false);
    document.getElementById('tb-btn-help').addEventListener('click', function () { setActivePane('help'); }, false);
} // function initToolbar()
