import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function extractFunction(name) {
  const start = html.indexOf('function ' + name + '(');
  assert.notEqual(start, -1, name + ' must exist');
  const brace = html.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < html.length; i++) {
    if (html[i] === '{') depth++;
    if (html[i] === '}') {
      depth--;
      if (depth === 0) return html.slice(start, i + 1);
    }
  }
  assert.fail(name + ' must have a closing brace');
}

const officers = [
  { name: 'S6 Red Queen', season: 'S6' },
  { name: 'S6 White Queen', season: 'S6' },
  { name: 'S7 Liora', season: 'S7' },
  { name: 'S6 Red Queen', season: 'S6' }
];
const identity = new Function(extractFunction('multiOfficerIdentity') + '; return multiOfficerIdentity;')();
const normalize = new Function(
  'officers',
  'maxBadgesForOfficer',
  'multiOfficerIdentity',
  extractFunction('normalizeMultiPlanRows') + '; return normalizeMultiPlanRows;'
)(officers, () => 1600, identity);

test('restored plans discard duplicate Officer rows by name and season, even at different indices', () => {
  const rows = normalize([
    { officerIndex: 0, badgesNeeded: 1600 },
    { officerIndex: 3, badgesNeeded: 800 },
    { officerIndex: 2, badgesNeeded: 500 }
  ]);
  assert.deepEqual(rows, [
    { officerIndex: 0, badgesNeeded: 1600 },
    { officerIndex: 2, badgesNeeded: 500 }
  ]);
});

test('normalization retains distinct Officers in their original order', () => {
  const rows = normalize([
    { officerIndex: 2, badgesNeeded: 300 },
    { officerIndex: 1, badgesNeeded: 700 }
  ]);
  assert.deepEqual(rows.map(row => row.officerIndex), [2, 1]);
});

test('planner dropdown disables duplicate Officer identities across different database indices', () => {
  const start = html.indexOf('function multiOfficerOptions');
  const end = html.indexOf('function renderMultiPlanner', start);
  const optionsFunction = html.slice(start, end);
  assert.match(optionsFunction, /multiOfficerIdentity\(officers\[Number\(r\.officerIndex\)\]\)/);
  assert.match(optionsFunction, /used\.has\(multiOfficerIdentity\(o\)\)/);
  assert.match(optionsFunction, /duplicate\?'disabled':''/);
});

test('adding a row selects the first unused Officer identity', () => {
  assert.match(html, /multiPlanOfficers\.map\(r=>multiOfficerIdentity\(officers\[Number\(r\.officerIndex\)\]\)\)/);
  assert.match(html, /Every Officer is already in the plan/);
});

test('changing a row to an Officer already present is rejected by identity', () => {
  assert.match(html, /This Officer is already in the plan\. Each Officer can only be added once\./);
  assert.match(html, /multiOfficerIdentity\(officers\[Number\(r\.officerIndex\)\]\)===nextIdentity/);
});
