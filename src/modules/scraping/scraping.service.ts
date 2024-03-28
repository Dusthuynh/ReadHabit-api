import { Injectable } from '@nestjs/common';
import { VibloScrapingService } from './viblo/viblo-scraping.service';
import { ConfigService } from '@nestjs/config';
import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from '@google/generative-ai';
import { PostsService } from '../posts/posts.service';
import { POST_STATUS } from 'src/shared/enum/post.enum';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { PostContent } from 'src/types/generate-post.interface';
import { VnExpressScrapingService } from './vnExpress/vnExpress-scraping.service';
import { SpiderumScrapingService } from './spiderum/spiderum-scraping.service';

@Injectable()
export class ScrapingService {
	private genAI: any;
	private genAiProModel: any;

	constructor(
		private vibloService: VibloScrapingService,
		private readonly configService: ConfigService,
		private postService: PostsService,
		private vnExpressService: VnExpressScrapingService,
		private spiderumService: SpiderumScrapingService,
	) {
		this.genAI = new GoogleGenerativeAI(
			this.configService.get('GEMINI_API_KEY'),
		);

		this.genAiProModel = this.genAI.getGenerativeModel({
			model: 'gemini-pro',
		});
	}

	@OnEvent('generate.post')
	async generatePosts() {
		console.log('============ Generate Post Processing! ============');
		console.time('generate.post');

		const postContents: PostContent[] = await this.getAllContent();

		const postsData: CreatePostDto[] = [];
		console.log('	Generate with Gemini');
		for (let content of postContents) {
			const result = await this.createPostSummaryAndTags(content.data);
			if (!result.isSafety) {
				console.log(`		(NOT CREATE) This URL unsafe: ${content.URL}`);
				continue;
			}
			postsData.push({
				originalPostURL: content.URL,
				type: content.type,
				title: result.title,
				content: result.summary,
				tags: result.tags,
				categoryId: content.categoryId,
				status: POST_STATUS.REVIEWING,
				contentSourceId: content.contentSourceId,
			});
			console.log(`		(CREATED) post for URL: ${content.URL}`);
		}

		//TODO: createdById: ReadHabit Bot
		for (let data of postsData) {
			try {
				await this.postService.createPost(1, data);
			} catch (error) {
				console.error(error);
			}
		}

		console.timeEnd('generate.post');
		console.log('============ Generate Post Successfull! ============');
	}

	async getAllContent() {
		const vibloContent = await this.vibloService.getContentsByRss();
		const expressContent = await this.vnExpressService.getContentsByRss();
		const spiderumContent = await this.spiderumService.getContentsBySource();

		let contents: PostContent[] = [];

		if (vibloContent.length) {
			contents = contents.concat(vibloContent);
		}
		if (expressContent.length) {
			contents = contents.concat(expressContent);
		}
		if (spiderumContent.length) {
			contents = contents.concat(spiderumContent);
		}
		console.log(`  === ToTal content: ${contents.length} ===`);

		return contents;
	}

	async createPostSummaryAndTags(text: string) {
		try {
			const data = { title: '', summary: '', tags: '', isSafety: true };
			let safetyRatings = [];
			let hasHighProbability = false;

			//NOTE: Summary post
			const summaryPrompt = `Tóm tắt văn bản sau đây thành một đoạn nội dung có độ dài không quá 800 từ (format theo kiểu của html, có các thẻ như <p>, <h1>, ...): 
		${text}`;
			// console.log(summaryPrompt);
			const summaryResult =
				await this.genAiProModel.generateContent(summaryPrompt);
			const summaryResponse = await summaryResult.response;
			const blockReason = summaryResponse.promptFeedback.blockReason;
			if (blockReason) {
				data.isSafety = false;
				return data;
			} else {
				data.summary = summaryResponse.text();
			}

			//NOTE: generate title and tags
			const titlePrompt = '(không in đậm) Tiêu đề của nội dung trên là gì?';
			const tagsPrompt =
				'Cho tôi các nhãn dán cho bài viết trên (trả về dưới dạng chuỗi các từ ngăn cách nhau bởi dấu phẩy, Ví dụ: "Đồng bộ,code,Công nghệ,Lập trình,Hướng dẫn")';
			const history = [
				{
					role: 'user',
					parts: [{ text: summaryPrompt }],
				},
				{
					role: 'model',
					parts: [{ text: data.summary }],
				},
			];

			const titlePromise = await this.genAiProModel
				.startChat({ history })
				.sendMessage(titlePrompt);
			const titleResponse = await titlePromise.response;

			safetyRatings = titleResponse.candidates[0].safetyRatings;
			hasHighProbability = safetyRatings.some(
				(item) => item.probability === 'HIGH',
			);
			if (hasHighProbability) {
				data.isSafety = false;
				return data;
			} else {
				data.title = titleResponse.text();
			}

			const tagsPromise = await this.genAiProModel
				.startChat({ history })
				.sendMessage(tagsPrompt);
			const tagsResponse = await tagsPromise.response;

			safetyRatings = tagsResponse.candidates[0].safetyRatings;
			hasHighProbability = safetyRatings.some(
				(item) => item.probability === 'HIGH',
			);
			if (hasHighProbability) {
				data.isSafety = false;
				return data;
			} else {
				data.tags = tagsResponse.text();
			}

			return data;
		} catch (error) {
			console.log(error);
		}
	}
}
