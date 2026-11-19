import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../v460-features.js', import.meta.url), 'utf8');

function extractFunction(name) {
  const start = source.indexOf('function ' + name + '(');
  assert.notEqual(start, -1, name + ' must exist');
  const brace = source.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  assert.fail(name + ' must have a closing brace');
}

const calculateAdditionalOrv = new Function(
  extractFunction('additionalOrvForBadgeShortfall') + '; return additionalOrvForBadgeShortfall;'
)();

test('Red Queen Upgrade Targets credits the 151 ORV remainder', () => {
  const heldOrv = 13591;
  const orvPerBadge = 240;
  const badgeEquivalents = Math.floor(heldOrv / orvPerBadge);
  const badgeShortfall = 1600 - badgeEquivalents;

  assert.equal(badgeEquivalents, 56);
  assert.equal(heldOrv % orvPerBadge, 151);
  assert.equal(badgeShortfall, 1544);
  assert.equal(calculateAdditionalOrv(badgeShortfall, orvPerBadge, heldOrv), 370409);
});

test('additional ORV is not reduced when held ORV has no remainder', () => {
  assert.equal(calculateAdditionalOrv(10, 240, 4800), 2400);
});

test('additional ORV cannot become negative when held ORV covers the target', () => {
  assert.equal(calculateAdditionalOrv(0, 240, 13591), 0);
});

test('Upgrade Targets production output uses the held ORV remainder-aware calculation', () => {
  assert.ok(source.includes('orvHeldForBadgeCost=orvHeld'));
  assert.ok(source.includes('additionalOrvForBadgeShortfall(badgeShort,Number(o.orv),orvHeldForBadgeCost)'));
});
