import { readFile } from 'node:fs/promises';
import { WorkSheet, read } from 'xlsx';

const spreadsheet = await readFile('performance-data.xlsx');

const workbook = read(spreadsheet, { type: 'buffer' });

const sheets = Object.fromEntries(
	Object.entries(workbook.Sheets).filter(([key]) => key !== 'READ ME FIRST')
);

console.log(
	Object.entries(sheets).map((a) =>
		a.map((x, i) => {
			if (i == 0) {
				return x;
			}

			const sheet = x as WorkSheet;

			return Object.fromEntries(
				Object.entries(sheet)
					// filtering for any actual cells (not any metadata)
					.filter(([k]) => k == k.toUpperCase())
					// selecting certain columns
					.filter(([k]) => ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(k[0]))
					// trimming labels
					.map(([k, v]) => [k, typeof v.v === 'string' ? v.v.trim() : v.v])
			);
		})
	)
);
