import fs from "fs";
import Printers from "./lib/printers.js";
import { PDFDocument } from 'pdf-lib'
import { select, input } from '@inquirer/prompts';
import cliProggress from 'cli-progress';
import { exit } from "process";

const args = process.argv.slice(2);
const pdf = args[0] ?? await input({ message: "Перетащите PDF файл в окно: " });
const numOfPages = await PDFDocument.load(fs.readFileSync(pdf)).then(pdf => pdf.getPages().length);

const printers = await Printers.get();
const printer = await select({
  message: "Выберите принтер: ",
  choices: printers.map(printer => ({ name: printer.name, value: printer.deviceId }))
})

const proggress = new cliProggress.SingleBar({}, cliProggress.Presets.shades_classic);
proggress.start(numOfPages, 0);

for (let i = 0; i < numOfPages; i++) {
  await Printers.print(pdf, {
    printer: printer,
    pages: String(i + 1),
    printDialog: false,
    win32: ['-print-settings "fit"']
  });
  proggress.increment();
}

proggress.stop();
exit(0);