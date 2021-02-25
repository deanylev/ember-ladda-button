import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ladda-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{ladda-button}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#ladda-button}}
        template block text
      {{/ladda-button}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test("it doesn't send the action if already running", async function (assert) {
    assert.expect(1);
    this.set('execute', async () => {
      assert.ok(true, 'action is called');
    });

    await render(hbs`
      {{#ladda-button class="test-button" action=this.execute}}
        template block text
      {{/ladda-button}}
    `);

    click('.test-button');
    await click('.test-button');
  });
});
