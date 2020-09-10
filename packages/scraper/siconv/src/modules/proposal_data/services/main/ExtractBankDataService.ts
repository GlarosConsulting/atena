import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import siconvConfig from '@config/siconv';

import parseDate from '@utils/parseDate';

import IBankData from '../../models/main/IBankData';

interface IExtractBankData extends Omit<IBankData, 'updated_at'> {
  updated_at: string;
}

@injectable()
export default class ExtractBankDataService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IBankData> {
    const title = await this.page.driver.title();

    if (title !== 'Detalhar Proposta') {
      throw new AppError('You should be on opened agreement page.');
    }

    const findBankDataSubtitles = await this.page.findElementsByText(
      'Dados Bancários',
      'td[@class="subtitulo"]',
    );

    if (findBankDataSubtitles.length === 0) {
      return undefined;
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const originalBankData = await this.page.evaluate<IExtractBankData>(() => {
      const bank = getTextBySelector(
        '#tr-alterarBancoEscolhido > td.field[colspan="4"]',
      );
      const agency = getTextBySelector('#tr-alterarAgencia > td:nth-child(2)');
      const account = getTextBySelector('#tr-alterarAgencia > td:nth-child(4)');
      const status = getTextBySelector(
        '#tr-alterarSituacaoConta > td:nth-child(2)',
      );
      const description = getTextBySelector(
        '#tr-alterarDescricaoConta > td.field',
      );
      const updated_at = getTextBySelector(
        '#tr-alterarSituacaoConta > td:nth-child(4)',
      );

      return {
        bank,
        agency,
        account,
        status,
        description,
        updated_at,
      };
    });

    const bankData: IBankData = {
      ...originalBankData,
      updated_at: parseDate(originalBankData.updated_at, 'dd/MM/yyyy HH:mm:ss'),
    };

    return bankData;
  }
}
