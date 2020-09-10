import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import IMainData from '../../models/main/IMainData';

@injectable()
export default class ExtractMainDataService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IMainData> {
    const title = await this.page.driver.title();

    if (title !== 'Plataforma +Brasil') {
      throw new AppError('You should be on main accountability page.');
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const mainData = await this.page.evaluate<IMainData>(() => {
      const agreement_object = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(4) > div.unit.unitData.blueBold.xx-big',
      );
      const granting_organ = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(5) > span.unit.unitData.blueBold',
      );
      const covenant_hired = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(6) > span.unit.unitData.blueBold',
      );
      const cnpj = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(7) > span.unit.unitData.blueBold',
      );
      const uf = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(8) > span.unit.unitData.blueBold',
      );
      const modality = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(9) > span.unit.unitData.blueBold',
      );
      const status = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(10) > span.unit.unitData.blueBold',
      );
      const technical_analysis = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(11) > span.unit.unitData.blueBold',
      );
      const number = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(12) > span.unit.unitData.blueBold',
      );

      return {
        agreement_object,
        granting_organ,
        covenant_hired,
        cnpj,
        uf,
        modality,
        status,
        technical_analysis,
        number,
      };
    });

    return mainData;
  }
}
