import fs from "fs";
import { PDFDocument } from "pdf-lib";
import { select, input } from "@inquirer/prompts";
import cliProggress from "cli-progress";
import { exit } from "process";
import ptpm, { getPagesNumbers } from "pdf-to-printer-modern";

async function print(pdf: string, printer: string, numOfPages: number) {
  try {
    const pages = await input({
      message: "Введите страницы к печати: ",
      default: "1-" + numOfPages,
    });
    const pagesArr = getPagesNumbers(pages).sort((a, b) => a - b);

    const proggress = new cliProggress.SingleBar(
      {},
      cliProggress.Presets.shades_classic,
    );
    proggress.start(pagesArr.length, 0);

    for (let i = 0; i < pagesArr.length; i++) {
      await ptpm.print(pdf, {
        printer: printer,
        pages: String(pagesArr[i]),
        scale: "noscale", // "noscale" | "fit" | "shrink"
        printDialog: false,
      });
      proggress.increment();
    }

    proggress.stop();
  } catch (error) {
    console.error(
      "Ошибка печати.\nУкажите номера страниц в одном из форматов:\n1-3\n1,2,3\n1,2,3-5\n1-3,5",
    );
    await print(pdf, printer, numOfPages);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const pdf = (
    args[0] ?? (await input({ message: "Перетащите PDF файл в окно: " }))
  ).replace(/^"|"$/g, "");

  const numOfPages = await PDFDocument.load(fs.readFileSync(pdf)).then(
    (pdf) => pdf.getPages().length,
  );

  const printers = await ptpm.getPrinters();
  const printer = await select({
    message: "Выберите принтер: ",
    choices: printers.map((printer) => ({
      name: printer.name,
      value: printer.deviceId,
    })),
  });

  await print(pdf, printer, numOfPages);
  exit(0);
}

main();
