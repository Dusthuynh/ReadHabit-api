import { BadRequestException, Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { POST_TYPE } from 'src/shared/enum/post.enum';
import { PostsService } from 'src/modules/posts/posts.service';
import { PostContent } from 'src/types/generate-post.interface';
import { CATEGORY } from 'src/shared/constants/category.constant';
import { CONTENT_SOURCE } from 'src/shared/constants/content-source.constant';
import { Spiderum_Source } from './sources/spiderum-source';

@Injectable()
export class SpiderumScrapingService {
	constructor(private postService: PostsService) {}

	async getContentsBySource() {
		console.log('*** Spiderum ***');
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});

		const mapLinks = new Map();
		//NOTE: get links
		for (const source of Spiderum_Source) {
			console.log('	source: ', source.link);
			const page = await browser.newPage();
			await page.goto(source.link);
			await page.waitForSelector('#feed');

			const links = await page.evaluate(() => {
				const spiderumCards = document.querySelectorAll('spiderum-card');
				let links = [];
				spiderumCards.forEach((spiderumCard) => {
					const descendants = spiderumCard.querySelectorAll('a.thumbnail');
					links = links.concat(Array.from(descendants));
				});
				return links.map((tag) => tag.href);
			});

			mapLinks.set(source.name, links);
			await page.close();
		}
		await browser.close();

		//NOTE: Remove existing links in the post
		for (const key of mapLinks.keys()) {
			const links = mapLinks.get(key);
			const fillterLinks: string[] = [];

			for (let i = 0; i < links.length; i++) {
				const postsWithLink = await this.postService.findOneWithoutThrowError({
					originalPostURL: links[i],
				});

				if (!postsWithLink && this.isValidPath(links[i])) {
					fillterLinks.push(links[i]);
				}
			}

			if (fillterLinks.length) {
				mapLinks.set(key, fillterLinks);
			} else {
				mapLinks.delete(key);
			}
		}

		//NOTE: generate content by links
		if (mapLinks.size) {
			return await this.getManyContentByLinks(mapLinks);
		}
		return [];
	}

	private isValidPath(path: string): boolean {
		//NOTE: Valid article path format: https://spiderum.com/bai-dang/
		const regex = /^https:\/\/spiderum\.com\/bai-dang\/[^/]+$/;
		return regex.test(path);
	}

	async getManyContentByLinks(
		mapLinks: Map<string, string[]>,
	): Promise<PostContent[]> {
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});
		console.log('	>> Scraping content:');

		const contents: PostContent[] = [];
		let content: string;
		let idx = 1;
		let linkLength = 0;
		for (const [key, value] of mapLinks) {
			linkLength += value.length;
		}
		for (const key of mapLinks.keys()) {
			const links = mapLinks.get(key);
			for (let link of links) {
				console.log(`		[${idx}/${linkLength}]  Goto: `, link);
				const page = await browser.newPage();
				await page.goto(link);

				const isNewPostAvailable = await page.evaluate(() => {
					return !!document.querySelector('new-post');
				});

				const isOldPostAvailable = await page.evaluate(() => {
					return !!document.querySelector('old-post');
				});

				if (isNewPostAvailable) {
					const divElements = await page.$$eval(
						'div.editor > div',
						(elements) => {
							return elements.map((element) => element.innerText);
						},
					);
					content = divElements.join('\n');
				}
				if (isOldPostAvailable) {
					const divElements = await page.$$eval(
						'div.p-content > div',
						(elements) => {
							return elements.map((element) => element.innerText);
						},
					);
					content = divElements.join('\n');
				}

				page.close();

				contents.push({
					URL: link,
					data: content,
					type: POST_TYPE.EXTERNAL_POST,
					categoryId: CATEGORY.find((category) => category.name === key)?.id,
					contentSourceId: CONTENT_SOURCE.find(
						(category) => category.name === 'Spiderum',
					)?.id,
				});
				idx++;
			}
		}

		await browser.close();

		return contents;
	}

	async getOneContentByLink(url: string) {
		const isValidPath = this.isValidPath(url);
		if (!isValidPath) {
			throw new BadRequestException('Invalid Url');
		}

		let content = '';
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});

		const page = await browser.newPage();
		await page.goto(url);

		const isNewPostAvailable = await page.evaluate(() => {
			return !!document.querySelector('new-post');
		});

		const isOldPostAvailable = await page.evaluate(() => {
			return !!document.querySelector('old-post');
		});

		if (isNewPostAvailable) {
			const divElements = await page.$$eval('div.editor > div', (elements) => {
				return elements.map((element) => element.innerText);
			});
			content = divElements.join('\n');
		}

		if (isOldPostAvailable) {
			const divElements = await page.$$eval(
				'div.p-content > div',
				(elements) => {
					return elements.map((element) => element.innerText);
				},
			);
			content = divElements.join('\n');
		}

		page.close();

		console.log(content);
		return content;
	}
}
