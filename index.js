import fs from "fs";
import print from "pdf-to-printer";
import { PDFDocument } from 'pdf-lib'
import { select, input } from '@inquirer/prompts';
import cliProggress from 'cli-progress';
import { exit } from "process";

const args = process.argv.slice(2);
const pdf = args[0] ?? await input({ message: "Перетащите PDF файл в окно: " });
const numOfPages = await PDFDocument.load(fs.readFileSync(pdf)).then(pdf => pdf.getPages().length);

const printers = await print.getPrinters();
const printer = await select({
  message: "Выберите принтер: ",
  choices: printers.map(printer => ({ name: printer.name, value: printer.deviceId }))
})

const proggress = new cliProggress.SingleBar({}, cliProggress.Presets.shades_classic);
proggress.start(numOfPages, 0);
for (let i = 1; i < numOfPages + 1; i++) {
  proggress.update(i);

  // print.print(pdf, {
  //   printer: printer,
  //   pages: i,
  //   printDialog: false,
  //   win32: ['-print-settings "fit"']
  // });
}
proggress.stop();
exit(0);