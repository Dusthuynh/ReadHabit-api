import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { POST_TYPE } from 'src/shared/enum/post.enum';
import { PostsService } from 'src/modules/posts/posts.service';
import { PostContent } from 'src/types/generate-post.interface';
import { CATEGORY } from 'src/shared/constants/category.constant';
import { CONTENT_SOURCE } from 'src/shared/constants/content-source.constant';
import { RSS_VnExpress } from './rss/vnExpress-rss';

@Injectable()
export class VnExpressScrapingService {
	constructor(private postService: PostsService) {}

	async getContentsByRss() {
		console.log('*** VnExpress ***');
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});

		const mapLinks = new Map();
		//NOTE: get links
		for (const rss of RSS_VnExpress) {
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

			mapLinks.set(rss.name, newLinks);
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
		//NOTE: Valid article path format: https://vnexpress.net/
		const regex = /^https:\/\/vnexpress\.net\/[^/]+$/;
		return regex.test(path);
	}

	async getManyContentByLinks(
		mapLinks: Map<string, string[]>,
	): Promise<PostContent[]> {
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});

		const contents: PostContent[] = [];
		let content: string;

		for (const key of mapLinks.keys()) {
			const links = mapLinks.get(key);
			let i = 1;
			for (let link of links) {
				console.log('		goto: ', link);
				const page = await browser.newPage();
				await page.goto(link, {
					timeout: 10000,
					waitUntil: 'domcontentloaded',
				});

				const isSelectorExists = await page.evaluate(() => {
					return !!document.querySelector('.fck_detail');
				});

				if (isSelectorExists) {
					content = await page.evaluate(() => {
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
						const elements = document.querySelectorAll('.fck_detail *');
						if (elements.length > 1) {
							elements.forEach((element) => {
								if (allowedTags.includes(element.tagName.toLowerCase())) {
									filteredTextArray.push(element.textContent.trim());
								}
							});
						}

						return filteredTextArray.join('\n');
					});
				}

				page.close();

				contents.push({
					URL: link,
					data: content,
					type: POST_TYPE.EXTERNAL_POST,
					categoryId: CATEGORY.find((category) => category.name === key)?.id,
					contentSourceId: CONTENT_SOURCE.find(
						(category) => category.name === 'VnExpress',
					)?.id,
				});

				//TODO: delete break
				if (i == 1) break;
				i++;
			}
		}
		await browser.close();

		return contents;
	}
}
