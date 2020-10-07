import AccountabilityHandler from '@modules/accountability/infra/handlers';
import AgreementsListPage from '@modules/agreements_list/infra/puppeteer/pages/AgreementsListPage';
import CovenantExecutionHandler from '@modules/covenant_execution/infra/handlers';
import ProposalDataHandler from '@modules/proposal_data/infra/handlers';
import { By } from '@modules/search/dtos/ISearchDTO';
import SiconvSearchPage from '@modules/search/infra/puppeteer/pages/SearchPage';
import { container, injectable, inject } from 'tsyringe';

import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import IBrowser from '@scraper/shared/modules/browser/models/IBrowser';
import IPage from '@scraper/shared/modules/browser/models/IPage';
import IBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/models/IBrowserProvider';

import Timer from '@utils/timer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAgreement from '@shared/models/IAgreement';

import GoBackFromAgreementHandler from '../handlers/GoBackFromAgreementHandler';
import GoBackToMainHandler from '../handlers/GoBackToMainHandler';

interface IRequest {
  company: string;
  headless?: boolean;
  verbose?: boolean;
}

@injectable()
export default class Launcher {
  constructor(
    @inject('BrowserProvider')
    private browserProvider: IBrowserProvider<Browser>,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async launch({ company, headless, verbose }: IRequest): Promise<void> {
    const log = (str: string) => {
      if (verbose) {
        console.log(str);
      }
    };

    const timer = new Timer(`agreements-scraping-${company}`);

    timer.start();

    const browser = await this.browserProvider.launch({ headless });
    const page = await browser.newPage();

    container.registerInstance<IBrowser<any, any>>('Browser', browser);
    container.registerInstance<IPage<any>>('Page', page);

    const siconvSearchPage = new SiconvSearchPage();

    await siconvSearchPage.search({
      by: By.CNPJ,
      value: company,
    });

    const agreementsListPage = new AgreementsListPage();

    const currentPage = await agreementsListPage.getCurrentPage();
    const totalPages = await agreementsListPage.getTotalPages();

    await browser.use(GoBackToMainHandler);

    /* // await agreementsListPage.navigateToPage(2);

    const agreements = await agreementsListPage.getAll();

    const agreement = agreements.find(
      findAgreement => findAgreement.agreement_id === '876519/2018',
      // findAgreement => findAgreement.agreement_id === '837439/2016',
    );

    let cacheAgreement = agreement;

    await this.cacheProvider.save('agreement', cacheAgreement);

    await agreementsListPage.openById(agreement.agreement_id);

    await browser.run(
      page,
      ProposalDataHandler,
      CovenantExecutionHandler,
      AccountabilityHandler,
      GoBackFromAgreementHandler,
    );

    cacheAgreement = await this.cacheProvider.recover<IAgreement>('agreement');

    if (cacheAgreement) {
      console.log(JSON.stringify(cacheAgreement));
    } */

    const scrapedAgreements: IAgreement[] = [];

    for (let i = currentPage; i <= totalPages; i++) {
      if (i > 1) {
        await agreementsListPage.navigateToPage(i);
      }

      const agreements = await agreementsListPage.getAll();

      for (const agreement of agreements) {
        if (i > 1) {
          const nowTotalPages = await agreementsListPage.getTotalPages();

          if (nowTotalPages < totalPages) {
            await agreementsListPage.openById(agreements[0].agreement_id);

            await browser.run(page, GoBackFromAgreementHandler);
          }

          await agreementsListPage.navigateToPage(i);
        }

        let cacheAgreement = agreement;

        const agreementIndex = agreements.indexOf(agreement) + 1;

        log(`\nPage: ${i}/${totalPages}`);
        log(
          `Scraping agreement (${agreementIndex}/${agreements.length}): ${agreement.agreement_id}`,
        );

        await this.cacheProvider.save('agreement', cacheAgreement, true);

        await agreementsListPage.openById(agreement.agreement_id);

        await browser.run(
          page,
          ProposalDataHandler,
          CovenantExecutionHandler,
          AccountabilityHandler,
          GoBackFromAgreementHandler,
        );

        cacheAgreement = await this.cacheProvider.recover<IAgreement>(
          'agreement',
          true,
        );

        if (cacheAgreement) {
          scrapedAgreements.push(cacheAgreement);
        }
      }
    }

    timer.stop();

    const formattedTimer = timer.format();

    console.log(
      `\nElapsed time for company CNPJ '${company}': ${formattedTimer}`,
    );
  }
}
