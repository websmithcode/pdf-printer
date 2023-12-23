import { promisify } from 'util';
import { exec as execCb } from 'child_process';
import pdfToPrinter from "pdf-to-printer";

const exec = promisify(execCb);


export default class Printers {

  static async getPaperSizes(deviceID) {
    try {
      const stdout = await exec(`wmic printer where deviceID="${deviceID}" get PrinterPaperNames`);
      const lines = stdout.trim().split('\n');
      const paperSizes = lines[1]
        .replace(/^\{|\}$/g, '')
        .split(',')
        .map(size => size
          .trim()
          .replace(/^"|"$/g, '')
        );
      return paperSizes;
    } catch (error) {
      throw error;
    }
  }
  static async get() {
    try {
      const res = await exec('wmic printer get name, deviceID, status');
      const lines = res.stdout.trim().split('\n');
      const printers = lines.slice(1).map(line => {
        const [name, deviceId, status] = line.trim().split(/\s{2,}/);
        return { name, deviceId, status };
      });
      return printers;
    } catch (error) {
      throw error;
    }
  }

  static async print(...args) {
    try {
      await pdfToPrinter.print(...args);
    } catch (error) {
      throw error;
    }
  }

}
