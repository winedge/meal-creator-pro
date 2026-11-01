import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const source = html.match(/<script id="medinjury-meta-pixel">([\s\S]*?)<\/script>/)?.[1];

function setup() {
  assert.ok(source, 'Pixel base loader must exist in the raw page source');
  const scripts = [];
  const window = {};
  runInNewContext(source, {
    window,
    document: {
      createElement: () => ({}),
      head: { appendChild: (script) => scripts.push(script) },
    },
  });
  return { window, scripts };
}

test('raw page setup does not send requests before permission activates it', () => {
  const { window, scripts } = setup();
  assert.equal(scripts.length, 0);
  assert.equal(window.fbq, undefined);
});

test('activation uses the supplied admin ID and installs only once', () => {
  const { window, scripts } = setup();
  window.medInjuryLoadMetaPixel('1234567890');
  window.medInjuryLoadMetaPixel('1234567890');
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, 'https://connect.facebook.net/en_US/fbevents.js');
  assert.equal(window.fbq.queue.length, 2);
  assert.equal(window.fbq.queue[0][1], '1234567890');
  assert.equal(window.fbq.queue[0][3].agent, 'lovable');
  assert.equal(window.fbq.queue[1][1], 'PageView');
});