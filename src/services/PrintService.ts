import * as EscPosEncoder from '../esc-pos-encoder';
import type { State } from '../types';
import { displayMessage, displayError, rightAlignNumber, leftAlignText } from '../utils/formatting';

export class PrintService {
  private static _printCharacteristic: unknown = null;
  private static _connectedPrinter: unknown = null;

  static get PrinterName(): string | undefined {
    return (this._printCharacteristic as any)?.service?.device?.name;
  }

  static async printTicket(articlesState: State): Promise<void> {
    const printer = this._connectedPrinter as any;
    if (printer && printer.gatt.connected) {
      await this.print(articlesState);
      displayMessage('Ticket imprimé');
    } else {
      await this.initialize();
      await this.print(articlesState);
      displayMessage('Ticket imprimé');
    }
  }

  private static async initialize(): Promise<void> {
    const SERVICE = '000018f0-0000-1000-8000-00805f9b34fb';
    const WRITE = '00002af1-0000-1000-8000-00805f9b34fb';
    let localDevice: unknown;
    const nav = window.navigator as any;
    const device = await nav.bluetooth.requestDevice({ filters: [{ services: [SERVICE] }] });
    localDevice = device;
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE);
    const characteristic = await service.getCharacteristic(WRITE);
    this._connectedPrinter = localDevice;
    this._printCharacteristic = characteristic;
  }

  private static async print(articlesState: State): Promise<void> {
    const encoder: any = new (EscPosEncoder as any).default({ width: 42 });
    const lines: Uint8Array[] = [];

    lines.push(encoder.raw([0x1c, 0x2e]).codepage('cp437').encode());

    if (articlesState.title1?.length) {
      lines.push(
        encoder.bold(true).invert(true).width(3).height(3)
          .line(articlesState.title1)
          .bold(false).invert(false).encode()
      );
    }

    if (articlesState.title2?.length) {
      lines.push(
        encoder.bold(true).invert(true).width(3).height(3)
          .line(articlesState.title2)
          .bold(false).invert(false).encode()
      );
    }

    lines.push(encoder.newline().encode());
    lines.push(encoder.bold(true).width(2).height(2).line('Qte  Article        Prix').bold(false).encode());
    lines.push(encoder.bold(true).width(1).height(1).line('================================================').bold(false).encode());

    for (const article of articlesState.articles.filter(a => a.visible && a.quantity > 0)) {
      const line = rightAlignNumber(article.quantity, 2) + ' ' + leftAlignText(article.name, 10) + ' ';
      const price = rightAlignNumber(article.quantity * article.price, 6, 2);
      lines.push(
        encoder.bold(true).width(3).height(3).text(line)
          .width(1).height(1).line(price).bold(false).encode()
      );
    }

    lines.push(encoder.bold(true).width(1).height(1).line('================================================').bold(false).encode());

    const total = articlesState.articles.filter(a => a.quantity > 0).reduce((a, b) => a + b.quantity * b.price, 0);
    const totalLine = leftAlignText('Total', 17) + ' ';
    const totalPrice = rightAlignNumber(total, 6, 2);
    lines.push(
      encoder.bold(true).width(2).height(2).text(totalLine)
        .width(2).height(2).line(totalPrice).bold(false).encode()
    );
    lines.push(encoder.line('').line('').line('').line('').cut().encode());

    const characteristic = this._printCharacteristic as any;
    try {
      for (const line of lines) {
        await characteristic.writeValue(line);
      }
    } catch (err: any) {
      displayError(err.message);
    }
  }
}
