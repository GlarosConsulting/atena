import 'dotenv/config';
import 'reflect-metadata';

import { container, injectable, inject } from 'tsyringe';

import '@shared/container';

import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import IBrowser from '@scraper/shared/modules/browser/models/IBrowser';
import IPage from '@scraper/shared/modules/browser/models/IPage';
import IBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/models/IBrowserProvider';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import ProposalDataHandler from '@modules/proposal_data/infra/handlers';
import { By } from '@modules/search/dtos/ISearchDTO';
import AgreementsListPage from '@modules/search/infra/puppeteer/pages/AgreementsListPage';
import SiconvSearchPage from '@modules/search/infra/puppeteer/pages/SearchPage';
import IAgreement from '@modules/search/models/IAgreement';

import BackToAgreementsListHandler from '../../handlers/BackToAgreementsListHandler';
import BackToMainHandler from '../../handlers/BackToMainHandler';

@injectable()
class Executor {
  constructor(
    @inject('BrowserProvider')
    private browserProvider: IBrowserProvider<Browser>,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async run(): Promise<void> {
    const browser = await this.browserProvider.launch({ headless: false });
    const page = await browser.newPage();

    container.registerInstance<IBrowser<any, any>>('Browser', browser);
    container.registerInstance<IPage<any>>('Page', page);

    const siconvSearchPage = new SiconvSearchPage();

    await siconvSearchPage.search({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreementsListPage = new AgreementsListPage();

    const agreements = await agreementsListPage.getAll();

    console.log(agreements);

    await browser.use(BackToMainHandler);

    for (const agreement of agreements) {
      let cacheAgreement = agreement;

      console.log(agreement.agreement_id);

      await this.cacheProvider.save('agreement', cacheAgreement);

      await agreementsListPage.openById(agreement.agreement_id);

      await browser.run(page, ProposalDataHandler, BackToAgreementsListHandler);

      cacheAgreement = await this.cacheProvider.recover<IAgreement>(
        'agreement',
      );

      if (cacheAgreement) {
        console.log(JSON.stringify(cacheAgreement));
      }
    }
  }
}

const executor = container.resolve(Executor);

executor.run().catch(err => {
  console.log('Occurred an unexpected error:');
  console.log(err);
});
