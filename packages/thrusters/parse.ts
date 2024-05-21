import { readFile } from 'node:fs/promises';
import { WorkSheet, read } from 'xlsx';

const spreadsheet = await readFile('performance-data.xlsx');

const workbook = read(spreadsheet, { type: 'buffer' });

const sheets = Object.fromEntries(
	Object.entries(workbook.Sheets).filter(([key]) => key !== 'READ ME FIRST')
);

// We want data that shows the force -> (current, pwm)
// as we want to work with *force* and be able to balance current.

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
					.filter(([k]) => [
						'A', // pwm
						'C', // current
						'F', // force
					].includes(k[0]))
					// drop the first row
					.filter(([k]) => !(k.length === 2 && k.includes("1")))
					// trimming labels
					.map(([k, v]) => [k, typeof v.v === 'string' ? v.v.trim() : v.v])
			);
		})
	)
);
