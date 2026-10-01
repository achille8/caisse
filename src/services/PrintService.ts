import * as EscPosEncoder from '../esc-pos-encoder';
import type { State } from '../types';
import { displayMessage, displayError, rightAlignNumber, leftAlignText } from '../utils/formatting';

export class PrintService {
  private static _printCharacteristic: any = null;
  private static _connectedPrinter: any = null;
  private static _encoder: any = new (EscPosEncoder as any).default({ width: 42 });

  static get PrinterName(): string | undefined {
    return (this._printCharacteristic as any)?.service?.device?.name;
  }

  static async printTicket(articlesState: State, multiTickets: boolean): Promise<void> {
    const printer = await this.getPrinter();

    if (printer && printer.gatt.connected) {
      var lines: Uint8Array[] = multiTickets ? 
        this.printMultipleTickets(articlesState) : 
        this.printSingleTicket (articlesState);
      await this.printLines(articlesState, lines);
      //this.appendTicketJournal(articlesState);
      displayMessage('Ticket imprimé');
    } else {
      displayError('Impossible de se connecter à l\'imprimante');
    }
  }

  static async getPrinter(): Promise<any> {
    if (this._connectedPrinter === null || !this._connectedPrinter.gatt.connected) {
      await this.initialize();
    }
    if (this._connectedPrinter === null || !this._connectedPrinter.gatt.connected) {
      return null;
    }
    return this._connectedPrinter;
  }

  private static async initialize(): Promise<void> {
    const SERVICE = '000018f0-0000-1000-8000-00805f9b34fb';
    const WRITE = '00002af1-0000-1000-8000-00805f9b34fb';
    const nav = window.navigator as any;
    const device = await nav.bluetooth.requestDevice({ filters: [{ services: [SERVICE] }] });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE);
    const characteristic = await service.getCharacteristic(WRITE);
    this._connectedPrinter = device;
    this._printCharacteristic = characteristic;
  }

  private static printSingleTicket(articlesState: State): Uint8Array[] {
    const lines: Uint8Array[] = [];
    if (articlesState.title1?.length) {
      lines.push(
        this._encoder.bold(true).invert(true).width(3).height(3)
          .line(articlesState.title1)
          .bold(false).invert(false).encode()
      );
    }

    if (articlesState.title2?.length) {
      lines.push(
        this._encoder.bold(true).invert(true).width(3).height(3)
          .line(articlesState.title2)
          .bold(false).invert(false).encode()
      );
    }

    //lines.push(this._encoder.newline().encode());
    lines.push(this._encoder.bold(true).width(1).height(1).line('================================================').bold(false).encode());
    lines.push(this._encoder.bold(true).width(2).height(2).line('Qte  Article        Prix').bold(false).encode());
    lines.push(this._encoder.bold(true).width(1).height(1).line('================================================').bold(false).encode());

    for (const article of articlesState.articles.filter(a => a.visible && a.quantity > 0)) {
      const line = rightAlignNumber(article.quantity, 2) + ' ' + leftAlignText(article.name, 10) + ' ';
      const price = rightAlignNumber(article.quantity * article.price, 6, 2);
      lines.push(
        this._encoder.bold(true).width(3).height(3).text(line)
          .width(1).height(1).line(price).bold(false).encode()
      );
    }

    lines.push(this._encoder.bold(true).width(1).height(1).line('================================================').bold(false).encode());

    const total = articlesState.articles.filter(a => a.quantity > 0).reduce((a, b) => a + b.quantity * b.price, 0);
    const totalLine = leftAlignText('Total', 17) + ' ';
    const totalPrice = rightAlignNumber(total, 6, 2);
    lines.push(
      this._encoder.bold(true).width(2).height(2).text(totalLine)
        .width(2).height(2).line(totalPrice).bold(false).encode()
    );

    lines.push(this._encoder.line('').line('').line('').line('').cut().encode());

    return lines;
  }

  private static printMultipleTickets(articlesState: State): Uint8Array[] {
    const lines: Uint8Array[] = [];
    for (const article of articlesState.articles.filter(a => a.visible && a.quantity > 0)) {
      lines.push(this._encoder.newline().encode());
      lines.push(this._encoder.bold(true).width(2).height(2).line('Qte  Article        Prix').bold(false).encode());
      lines.push(this._encoder.bold(true).width(1).height(1).line('================================================').bold(false).encode());

      lines.push(this._encoder.cut().encode());

      const line = rightAlignNumber(article.quantity, 2) + ' ' + leftAlignText(article.name, 10) + ' ';
      const price = rightAlignNumber(article.quantity * article.price, 6, 2);
      lines.push(
        this._encoder.bold(true).width(3).height(3).text(line)
          .width(1).height(1).line(price).bold(false).encode()
      );

      lines.push(this._encoder.bold(true).width(1).height(1).line('================================================').bold(false).encode());

      const total = article.quantity * article.price;
      const totalLine = leftAlignText('Total', 17) + ' ';
      const totalPrice = rightAlignNumber(total, 6, 2);
      lines.push(
        this._encoder.bold(true).width(2).height(2).text(totalLine)
          .width(2).height(2).line(totalPrice).bold(false).encode()
      );
    }

    lines.push(this._encoder.line('').line('').line('').line('').cut().encode());

    return lines;
  }

  private static async printLines(articlesState: State, lines2: Uint8Array[]): Promise<void> {

    var lines: Uint8Array[] = [];
    lines.push(this._encoder.raw([0x1c, 0x2e]).codepage('cp437').encode());
    lines.push(...lines2);

    if (articlesState.cashDrawerConnected) {  
      const cashDrawerDeviceId = 0x00;
      const cashDrawerPulseOn = 0x19;
      const cashDrawerPulseOff = 0xFA;
      lines.push(this._encoder.raw([0x1B, 0x70, cashDrawerDeviceId, cashDrawerPulseOn, cashDrawerPulseOff]).encode()); // Standard open drawer command
    }

    const characteristic = this._printCharacteristic as any;
    for (const line of lines) {
      await characteristic.writeValue(line);
    }
  }

  /*
  private static appendTicketJournal(articlesState: State): void {
    const journalKey = 'printed-ticket-journal.csv';
    const timestamp = new Date().toISOString();
    const entries = articlesState.articles
      .filter(article => article.visible && article.quantity > 0)
      .map(article => [
        timestamp,
        this.escapeCsvValue(article.name),
        article.quantity,
        article.price.toFixed(2),
        (article.quantity * article.price).toFixed(2),
      ].join(';'));

    if (entries.length === 0) return;

    const existingJournal = window.localStorage.getItem(journalKey);
    const header = 'datetime;article;quantity;price;total';
    window.localStorage.setItem(journalKey, [existingJournal ?? header, ...entries].join('\n'));
  }
*/

  private static escapeCsvValue(value: string): string {
    return `"${value.replace(/"/g, '""')}"`;
  }
}
