import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { POST_TYPE } from 'src/shared/enum/post.enum';
import { RSS_Viblo } from './rss/viblo-rss';
import { PostsService } from 'src/modules/posts/posts.service';
import { PostContent } from 'src/types/generate-post.interface';
import { CATEGORY } from 'src/shared/constants/category.constant';
import { CONTENT_SOURCE } from 'src/shared/constants/content-source.constant';

@Injectable()
export class VibloScrapingService {
	constructor(private postService: PostsService) {}

	async getContentsByRss() {
		console.log('*** Viblo ***');
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});

		const links: string[] = [];
		//NOTE: get links
		for (const rss of RSS_Viblo) {
			console.log('	rss: ', rss.link);
			const page = await browser.newPage();
			await page.goto(rss.link);
			await page.waitForSelector('item');
			const newLinks = await page.evaluate(() => {
				const items = Array.from(document.querySelectorAll('item'));
				const links = items.map((item) => {
					const linkElement = item.querySelector('link');
					return linkElement ? linkElement.textContent : null;
				});
				return links.filter((link) => link !== null);
			});

			links.push(...newLinks);
			await page.close();
		}
		await browser.close();

		//NOTE: Remove existing links in the post
		const fillterLinks: string[] = [];
		for (let i = 0; i < links.length; i++) {
			const postsWithLink = await this.postService.findOneWithoutThrowError({
				originalPostURL: links[i],
			});

			if (!postsWithLink && this.isValidPath(links[i])) {
				fillterLinks.push(links[i]);
			}
		}

		//NOTE: generate content by links
		if (fillterLinks.length) {
			return await this.getManyContentByLinks(fillterLinks);
		}
		return [];
	}

	private isValidPath(path: string): boolean {
		//NOTE: Valid article path format: https://viblo.asia/p/
		const regex = /^https:\/\/viblo\.asia\/p\/[^/]+$/;
		return regex.test(path);
	}

	async getManyContentByLinks(links: string[]): Promise<PostContent[]> {
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});
		console.log('	>> Scraping content:');

		const page = await browser.newPage();
		const contents: PostContent[] = [];
		let idx = 1;
		const linkLength = links.length;
		for (let link of links) {
			console.log(`		[${idx}/${linkLength}]  Goto: `, link);
			await page.goto(link);
			await page.waitForSelector('.md-contents');
			const isSelectorExists = await page.evaluate(() => {
				return !!document.querySelector('.md-contents');
			});

			if (isSelectorExists) {
				const content = await page.evaluate(() => {
					const allowedTags = [
						'p',
						'h1',
						'h2',
						'h3',
						'h4',
						'h5',
						'h6',
						'ul',
						'ol',
					];
					const filteredTextArray = [];
					const elements = document.querySelectorAll('.md-contents *');
					elements.forEach((element) => {
						if (allowedTags.includes(element.tagName.toLowerCase())) {
							filteredTextArray.push(element.textContent.trim());
						}
					});

					return filteredTextArray.join('\n');
				});
				contents.push({
					URL: link,
					data: content.slice(0, 5000),
					type: POST_TYPE.EXTERNAL_POST,
					categoryId: CATEGORY.find(
						(category) => category.name === 'Khoa học - Công nghệ',
					)?.id,
					contentSourceId: CONTENT_SOURCE.find(
						(category) => category.name === 'Viblo',
					)?.id,
				});
			}
			idx++;
		}
		await browser.close();

		return contents;
	}
}
