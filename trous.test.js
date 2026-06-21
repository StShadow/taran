import { describe, test, expect, beforeEach } from 'vitest';

// ---------------------------------------------------------
// 1. Mock Browser Environment Globals
// ---------------------------------------------------------
global.document = {
    getElementById: function(id) {
        return {
            id: id,
            tagName: 'svg',
            appendChild: function() {},
            setAttribute: function() {}
        };
    }
};

global.SynthSVG = function(svgElement) {
    this.svg = svgElement;
    this.makeAll = function() {};
};

global.synthSVG = new global.SynthSVG(global.document.getElementById('svgcan'));

global.Image = function() {
    var self = this;
    setTimeout(function() {
        if (typeof self.onload === 'function') {
            self.onload({});
        }
    }, 0);
};

global.XMLSerializer = function() {
    this.serializeToString = function(node) {
        if (!node) return '';
        // Return simulated image tag content
        return '<image>dummy_base64_image_data</image>';
    };
};

global.canvas = {
    width: 0,
    height: 0,
    toDataURL: function() {
        return 'dummy_base64_image_data';
    }
};

global.context = {
    drawImage: function() {}
};

// UI updates helper mocks
global.setElementText = function(id, text) {};
global.displayTargetsInfo = function() {};
global.displayProjectInfo = function() {};
global.LSTX = function(key) {
    return key;
};

global.imgloading_current = 0;
global.imgloading_total = 0;

// ---------------------------------------------------------
// 2. Load trous.js exports
// ---------------------------------------------------------
const {
    distBetween,
    Shot,
    GroupStats,
    Group,
    Sheet,
    Samevik,
    valFromXMLnode,
    escapeXML,
    unescapeXML,
    stripXMLSpecials
} = require('./trous.js');

// ---------------------------------------------------------
// 3. Lightweight Mock XML Parser for Deserialization Tests
// ---------------------------------------------------------
function parseXMLToMockDOM(xmlString) {
    return {
        getElementsByTagName: function(name) {
            const regex = new RegExp('<' + name + '\\b(?:[^>]*)>([\\s\\S]*?)<\\/' + name + '\\b>', 'g');
            const matches = [];
            let match;
            while ((match = regex.exec(xmlString)) !== null) {
                const innerContent = match[1];
                matches.push({
                    nodeName: name,
                    childNodes: [{
                        nodeValue: innerContent.trim()
                    }],
                    getElementsByTagName: function(subName) {
                        return parseXMLToMockDOM(innerContent).getElementsByTagName(subName);
                    }
                });
            }
            // Handle self-closing tags like <image />
            const selfClosingRegex = new RegExp('<' + name + '\\b\\s*\\/>', 'g');
            if (selfClosingRegex.test(xmlString)) {
                matches.push({
                    nodeName: name,
                    childNodes: []
                });
            }
            return matches;
        },
        documentElement: null
    };
}

function parseProjectXML(xmlString) {
    const mockDom = parseXMLToMockDOM(xmlString);
    const samevikNodes = mockDom.getElementsByTagName('samevik');
    if (samevikNodes.length > 0) {
        const rootnode = samevikNodes[0];
        return {
            documentElement: rootnode
        };
    }
    return {
        documentElement: mockDom
    };
}

// ---------------------------------------------------------
// 4. Test Suites
// ---------------------------------------------------------
describe('Mathematical Utilities (distBetween)', () => {
    test('Standard positive coordinates (3-4-5 triangle)', () => {
        expect(distBetween({ x: 0, y: 0 }, { x: 3, y: 4 })).toBeCloseTo(5, 9);
    });

    test('Standard floating point coordinates', () => {
        expect(distBetween({ x: 1.5, y: 2.5 }, { x: 4.5, y: 6.5 })).toBeCloseTo(5, 9);
    });

    test('Negative coordinates', () => {
        expect(distBetween({ x: -1, y: -2 }, { x: 2, y: 2 })).toBeCloseTo(5, 9);
    });

    test('Identical points (zero distance)', () => {
        expect(distBetween({ x: 10, y: 20 }, { x: 10, y: 20 })).toBe(0);
    });

    test('Missing arguments should return false', () => {
        expect(distBetween(undefined, undefined)).toBe(false);
        expect(distBetween({ x: 5, y: 5 }, undefined)).toBe(false);
        expect(distBetween(undefined, { x: 5, y: 5 })).toBe(false);
        expect(distBetween(null, null)).toBe(false);
        expect(distBetween({ x: 1, y: 1 }, null)).toBe(false);
    });
});

describe('Group Calculation Engine (updateStatsGroup)', () => {
    test('Empty group / group with < 2 shots should reset stats', () => {
        const group = new Group();
        group.cx = 100;
        group.cy = 100;
        
        // 0 shots
        const res0 = group.updateStats();
        expect(res0).toBeNull();
        expect(group.stats.es).toBe(0);
        expect(group.stats.poix).toBeNull();
        expect(group.stats.poiy).toBeNull();

        // 1 shot
        group.shots.push(new Shot(105, 105));
        const res1 = group.updateStats();
        expect(res1).toBeNull();
        expect(group.stats.es).toBe(0);
        expect(group.stats.poix).toBeNull();
        expect(group.stats.poiy).toBeNull();
    });

    test('Exactly 2 shots', () => {
        const group = new Group();
        group.cx = 100;
        group.cy = 100;
        group.shots.push(new Shot(100, 100));
        group.shots.push(new Shot(103, 104)); // distance is 5
        
        const res = group.updateStats();
        expect(res).toBe(true);
        expect(group.stats.es).toBeCloseTo(5, 9);
        expect(group.stats.poix).toBe(101.5);
        expect(group.stats.poiy).toBe(102);
        expect(group.stats.m1).toBe(0);
        expect(group.stats.m2).toBe(1);
    });

    test('Three or more shots (extreme spread selection)', () => {
        const group = new Group();
        group.cx = 100;
        group.cy = 100;
        // Triangle: (100,100), (103, 104) [dist=5], (106, 108) [dist=10 from first, dist=5 from second]
        group.shots.push(new Shot(100, 100));
        group.shots.push(new Shot(103, 104));
        group.shots.push(new Shot(106, 108));

        const res = group.updateStats();
        expect(res).toBe(true);
        expect(group.stats.es).toBeCloseTo(10, 9); // furthest are index 0 and 2
        expect(group.stats.poix).toBe(103); // average of 100, 103, 106
        expect(group.stats.poiy).toBe(104); // average of 100, 104, 108
        expect(group.stats.m1).toBe(0);
        expect(group.stats.m2).toBe(2);
    });
});

describe('XML Helper utilities', () => {
    test('escapeXML & unescapeXML roundtrip', () => {
        const original = 'Taran\'s "Target" & Shot analysis < precision >';
        const escaped = escapeXML(original);
        expect(escaped).toBe('Taran&apos;s &quot;Target&quot; &amp; Shot analysis &lt; precision &gt;');
        expect(unescapeXML(escaped)).toBe(original);
    });

    test('stripXMLSpecials', () => {
        const original = 'Taran\'s "Target" & Shot analysis < precision >';
        expect(stripXMLSpecials(original)).toBe('Tarans Target  Shot analysis  precision ');
    });

    test('valFromXMLnode', () => {
        const xmlString = '<x>12.34</x><y>abc</y>';
        const mockDom = parseXMLToMockDOM(xmlString);
        
        // Parse float
        expect(valFromXMLnode(mockDom, 'x', true)).toBe(12.34);
        // Parse string
        expect(valFromXMLnode(mockDom, 'x', false)).toBe('12.34');
        expect(valFromXMLnode(mockDom, 'y', false)).toBe('abc');
        // Missing node
        expect(valFromXMLnode(mockDom, 'z', false)).toBe('');
    });
});

describe('Serialization and Deserialization (toXML & fromXML)', () => {
    test('Group Serialization Round-Trip', () => {
        const group = new Group();
        group.cx = 120;
        group.cy = 150;
        group.shots.push(new Shot(125, 155));
        group.shots.push(new Shot(115, 145));

        const xmlString = group.toXML();
        expect(xmlString).toContain('<cx>120</cx>');
        expect(xmlString).toContain('<cy>150</cy>');
        expect(xmlString).toContain('<shot>');
        expect(xmlString).toContain('<x>125</x>');
        expect(xmlString).toContain('<y>155</y>');

        const parsedGroup = new Group();
        const mockDom = parseXMLToMockDOM(xmlString);
        // XML wraps in <group>...</group>, find target node
        const groupNode = mockDom.getElementsByTagName('group')[0];
        parsedGroup.fromXML(groupNode);

        expect(parsedGroup.cx).toBe(120);
        expect(parsedGroup.cy).toBe(150);
        expect(parsedGroup.shots.length).toBe(2);
        expect(parsedGroup.shots[0].x).toBe(125);
        expect(parsedGroup.shots[0].y).toBe(155);
    });

    test('Sheet Serialization Round-Trip', () => {
        const mockImage = { width: 100, height: 100 };
        const sheet = new Sheet('Target_01.png', mockImage);
        sheet.description = 'Test Target & Calibration';
        sheet.scalept1 = new Shot(10, 10);
        sheet.scalept2 = new Shot(110, 10);
        sheet.scale = 2.5;
        sheet.scalelen = 40;

        const group = new Group();
        group.cx = 100;
        group.cy = 100;
        group.shots.push(new Shot(105, 105));
        sheet.groups.push(group);

        const xmlString = sheet.toXML();
        expect(xmlString).toContain('<name>Target_01.png</name>');
        expect(xmlString).toContain('Test Target &amp; Calibration');
        expect(xmlString).toContain('<scale>2.5</scale>');

        const parsedSheet = new Sheet(null, mockImage);
        const mockDom = parseXMLToMockDOM(xmlString);
        const sheetNode = mockDom.getElementsByTagName('sheet')[0];
        parsedSheet.fromXML(sheetNode);

        expect(parsedSheet.name).toBe('Target_01.png');
        expect(parsedSheet.description).toBe('Test Target & Calibration');
        expect(parsedSheet.scale).toBe(2.5);
        expect(parsedSheet.scalelen).toBe(40);
        expect(parsedSheet.scalept1.x).toBe(10);
        expect(parsedSheet.scalept2.y).toBe(10);
        expect(parsedSheet.groups.length).toBe(1);
        expect(parsedSheet.groups[0].cx).toBe(100);
    });

    test('Samevik Project Serialization Round-Trip', () => {
        const project = new Samevik();
        project.description = 'Shooting session';
        project.metric = false; // imperial
        project.cal = 0.308;
        project.dist = 100;

        const mockImage = { width: 100, height: 100 };
        const sheet = new Sheet('t1.png', mockImage);
        sheet.scale = 5;
        project.sheets.push(sheet);

        const xmlString = project.toXML();
        expect(xmlString).toContain('<metric>false</metric>');
        expect(xmlString).toContain('<cal>0.308</cal>');
        expect(xmlString).toContain('<dist>100</dist>');

        const parsedProject = new Samevik();
        const parsedDom = parseProjectXML(xmlString);
        parsedProject.fromXML(parsedDom);

        expect(parsedProject.description).toBe('Shooting session');
        expect(parsedProject.metric).toBe(false);
        expect(parsedProject.cal).toBe(0.308);
        expect(parsedProject.dist).toBe(100);
        expect(parsedProject.sheets.length).toBe(1);
        expect(parsedProject.sheets[0].name).toBe('t1.png');
    });
});

describe('Formatting and Conversion Utilities', () => {
    let project;

    beforeEach(() => {
        project = new Samevik();
        project.dist = 100;
        // set global samevik instance as printInMOA / printInMrad refer to it
        global.samevik = project;
    });

    test('printUnit', () => {
        project.metric = true;
        expect(project.printUnit(12.345)).toBe(12); // Math.round

        project.metric = false;
        expect(project.printUnit(12.345)).toBe('12.35'); // toFixed(2)
    });

    test('printInMOA', () => {
        // Metric: value / (0.2908 * dist)
        project.metric = true;
        // For value = 29.08 at dist = 100 => 29.08 / (0.2908 * 100) = 1.00
        expect(project.printInMOA(29.08)).toBe('1.00');

        // Imperial: value / (0.01047 * dist)
        project.metric = false;
        // For value = 1.047 at dist = 100 => 1.047 / (0.01047 * 100) = 1.00
        expect(project.printInMOA(1.047)).toBe('1.00');
    });

    test('printInMrad', () => {
        // Metric: value / (0.1 * dist)
        project.metric = true;
        // For value = 10 at dist = 100 => 10 / (0.1 * 100) = 1.00
        expect(project.printInMrad(10)).toBe('1.00');

        // Imperial: value / (0.00361 * dist)
        project.metric = false;
        // For value = 0.361 at dist = 100 => 0.361 / (0.00361 * 100) = 1.00
        expect(project.printInMrad(0.361)).toBe('1.00');
    });

    test('printLength', () => {
        project.metric = true; // should append mm
        expect(project.printLength(50)).toBe('50mm');

        project.metric = false; // should append "
        expect(project.printLength(2.5)).toBe('2.50"');
    });

    test('printDist', () => {
        project.metric = true; // should append m
        expect(project.printDist(100)).toBe('100m');

        project.metric = false; // should append yards
        expect(project.printDist(100)).toBe('100yards');
    });
});

describe('Statistical Calculations (synthStats)', () => {
    let project;

    beforeEach(() => {
        project = new Samevik();
        global.samevik = project;
    });

    test('Should exit early with false if shotcount < 3', () => {
        const sheet = new Sheet('test.png', null);
        sheet.scale = 1;
        const group = new Group();
        group.cx = 0;
        group.cy = 0;
        group.shots.push(new Shot(0, 0));
        group.shots.push(new Shot(1, 1));
        sheet.groups.push(group);
        project.sheets.push(sheet);

        expect(project.synthStats()).toBe(false);
    });

    test('Should exit early with false if shotcount > 1000', () => {
        const sheet = new Sheet('test.png', null);
        sheet.scale = 1;
        const group = new Group();
        group.cx = 0;
        group.cy = 0;
        for (let i = 0; i < 1005; i++) {
            group.shots.push(new Shot(0, 0));
        }
        sheet.groups.push(group);
        project.sheets.push(sheet);

        expect(project.synthStats()).toBe(false);
    });

    test('Should correctly calculate stats for valid shots', () => {
        const sheet = new Sheet('test.png', null);
        sheet.scale = 2; // 2 pixels per unit
        
        const group = new Group();
        group.cx = 100;
        group.cy = 100;
        
        // Shot coordinates relative to group center in pixels:
        // Shot 1: (90, 90) => relative px (-10, -10) => real units (-5, -5)
        // Shot 2: (100, 100) => relative px (0, 0) => real units (0, 0)
        // Shot 3: (110, 110) => relative px (10, 10) => real units (5, 5)
        group.shots.push(new Shot(90, 90));
        group.shots.push(new Shot(100, 100));
        group.shots.push(new Shot(110, 110));
        
        sheet.groups.push(group);
        project.sheets.push(sheet);

        project.synthStats();

        // Average POI in real units relative to group center should be (0, 0)
        expect(project.poi.x).toBeCloseTo(0, 9);
        expect(project.poi.y).toBeCloseTo(0, 9);

        // Variance:
        // dx for X: -5, 0, 5 => dx^2: 25, 0, 25 => sum(dx^2) = 50 => vx = 50 / (3-1) = 25
        // dy for Y: -5, 0, 5 => dy^2: 25, 0, 25 => sum(dy^2) = 50 => vy = 50 / (3-1) = 25
        // v = (vx + vy) / 2 = 25
        // Rayleigh coeff for shotcount=3: 1.0638460811
        // sigma = Rayleigh_coeff * sqrt(v) = 1.0638460811 * 5 = 5.3192304055
        expect(project.sigma).toBeCloseTo(1.0638460811 * 5, 8);

        // Confidence bounds:
        // lower: Rayleigh_coeff * sqrt(CONF_LOWER[3] * v) / sigma = sqrt(CONF_LOWER[3])
        // CONF_LOWER[3] = 0.3589605184
        // confidenceLower = sqrt(0.3589605184) = 0.599133139
        expect(project.confidenceLower).toBeCloseTo(Math.sqrt(0.3589605184), 8);
        
        // POI confidence intervals (Student's t-dist ellipse boundary):
        // poici.x = Math.sqrt(vx) * TDIST_QUANTILE[3] / Math.sqrt(3)
        // TDIST_QUANTILE[3] = 6.2053468166
        // poici.x = 5 * 6.2053468166 / sqrt(3) = 17.913271
        expect(project.poici.x).toBeCloseTo(5 * 6.2053468166 / Math.sqrt(3), 8);
    });
});
