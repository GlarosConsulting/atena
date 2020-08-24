import Page from '../models/Page';
import getTextBySelector from './getTextBySelector.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  function getTextBySelector(
    selector: string,
    parent?: Element | Document,
  ): string | undefined;
}

async function inject(page: Page): Promise<void> {
  await page.driver.addScriptTag({
    content: `
    ${getTextBySelector}
    `,
  });
}

export default inject;
