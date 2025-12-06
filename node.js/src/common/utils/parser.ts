import { writeFile } from 'fs/promises';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default class Parser {
  private readonly json_path_prof;
  private readonly json_path_area;
  constructor(json_path_prof: string, json_path_area: string) {
    this.json_path_prof = json_path_prof;
    this.json_path_area = json_path_area;
  }

  async parseTable() {
    try {
      const url =
        'https://profstandart.rosmintrud.ru/obshchiy-informatsionnyy-blok/natsionalnyy-reestr-professionalnykh-standartov/reestr-oblastey-i-vidov-professionalnoy-deyatelnosti/';
      // Adding headers to mimic a real browser request
      const config = {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
      };
      const { data } = await axios.get<string>(url, config);
      const $ = cheerio.load(data);

      const result: Record<string, string> = {};

      const area: Record<string, string> = {};

      $('table tr').each((_, row) => {
        const tds = $(row).find('td');
        if (tds.length >= 2) {
          const code = $(tds[0]).text().trim();
          const activity = $(tds[2]).text().trim();
          // Добавляем только если есть код и активность
          if (code && activity) {
            result[code] = activity;
          }

          const temp = $(tds[1]).text().trim();
          const match = temp.match(/^(\d+)\s+(.+)$/);
          if (match) {
            area[match[1]] = match[2];
          }
        }
      });

      await writeFile(
        this.json_path_prof,
        JSON.stringify(result, null, 2),
        'utf-8',
      );
      await writeFile(
        this.json_path_area,
        JSON.stringify(area, null, 2),
        'utf-8',
      );
      console.log('Parser completed successfully');
    } catch (error) {
      console.error('Parser failed:', error.message);
      console.log('Using existing data files instead');
      // If parsing fails, we'll continue with existing data files
    }
  }
}
