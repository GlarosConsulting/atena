import 'dotenv/config';
import 'reflect-metadata';

import '@shared/container';

import { container, injectable, inject } from 'tsyringe';

import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import IBrowser from '@scraper/shared/modules/browser/models/IBrowser';
import IPage from '@scraper/shared/modules/browser/models/IPage';
import IBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/models/IBrowserProvider';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAgreement from '@shared/models/IAgreement';

import AccountabilityHandler from '@modules/accountability/infra/handlers';
import AgreementsListPage from '@modules/agreements_list/infra/puppeteer/pages/AgreementsListPage';
import ProposalDataHandler from '@modules/proposal_data/infra/handlers';
import { By } from '@modules/search/dtos/ISearchDTO';
import SiconvSearchPage from '@modules/search/infra/puppeteer/pages/SearchPage';

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
    console.time('Elapsed time');

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

    const currentPage = await agreementsListPage.getCurrentPage();
    const totalPages = await agreementsListPage.getTotalPages();

    console.log(currentPage);
    console.log(totalPages);

    await browser.use(BackToMainHandler);

    /* await agreementsListPage.navigateToPage(2);

    const agreements = await agreementsListPage.getAll();

    const agreement = agreements.find(
      findAgreement => findAgreement.agreement_id === '837439/2016',
    );

    await agreementsListPage.openById(agreement.agreement_id);

    await browser.run(
      page,
      ProposalDataHandler,
      AccountabilityHandler,
      BackToAgreementsListHandler,
    ); */

    for (let i = currentPage; i <= totalPages; i++) {
      if (i > 1) {
        await agreementsListPage.navigateToPage(i);
      }

      const agreements = await agreementsListPage.getAll();

      for (const agreement of agreements) {
        if (i > 1) {
          await agreementsListPage.navigateToPage(i);
        }

        let cacheAgreement = agreement;

        console.log(agreement.agreement_id);

        await this.cacheProvider.save('agreement', cacheAgreement);

        await agreementsListPage.openById(agreement.agreement_id);

        await browser.run(
          page,
          ProposalDataHandler,
          AccountabilityHandler,
          BackToAgreementsListHandler,
        );

        cacheAgreement = await this.cacheProvider.recover<IAgreement>(
          'agreement',
        );

        if (cacheAgreement) {
          console.log(JSON.stringify(cacheAgreement));
        }
      }
    }

    console.timeEnd('Elapsed time');
  }
}

const executor = container.resolve(Executor);

executor.run().catch(err => {
  console.log('Occurred an unexpected error:');
  console.log(err);
});
