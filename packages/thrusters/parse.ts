import { readFile } from 'node:fs/promises';
import { read } from 'xlsx';

const spreadsheet = await readFile('performance-data.xlsx');

const workbook = read(spreadsheet, { type: 'buffer' });

const sheets = Object.fromEntries(Object.entries(workbook.Sheets).filter(([key]) => key !== 'READ ME FIRST'));
