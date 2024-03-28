import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { VibloScrapingService } from './content-source/viblo/viblo-scraping.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PostsService } from '../posts/posts.service';
import { POST_STATUS } from 'src/shared/enum/post.enum';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { PostContent } from 'src/types/generate-post.interface';
import { VnExpressScrapingService } from './content-source/vnExpress/vnExpress-scraping.service';
import { SpiderumScrapingService } from './content-source/spiderum/spiderum-scraping.service';
import { QuickGeneratePostDto } from './dto/quick-generate-post.dto';
import { CurrentUserPayload } from 'src/shared/interfaces/current-user.interface';
import { USER_ROLE } from 'src/shared/enum/user.enum';
import { CONTENT_SOURCE } from 'src/shared/constants/content-source.constant';

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

		// const postsData: CreatePostDto[] = [];
		console.log('	>> Generate with Gemini:');
		for (let index = 0; index < postContents.length; index++) {
			const content = postContents[index];
			const postLength = postContents.length;

			const result = await this.createPostSummaryAndTags(content.data);
			if (!result.isSuccess) {
				console.log(
					`		[${
						index + 1
					}/${postLength}]  (NOT CREATE) Generate doesn't succeed: ${
						content.URL
					}`,
				);
				continue;
			}
			const data: CreatePostDto = {
				originalPostURL: content.URL,
				type: content.type,
				title: result.title,
				content: result.summary,
				tags: result.tags,
				categoryId: content.categoryId,
				status: POST_STATUS.REVIEWING,
				contentSourceId: content.contentSourceId,
			};

			//TODO: createdById: ReadHabit Bot
			await this.postService.createPost(1, data);
			console.log(
				`		[${index + 1}/${postLength}]  (CREATED) post for URL: ${content.URL}`,
			);
		}

		console.timeEnd('generate.post');
		console.log('============ Generate Post Successfull! ============');
	}

	async quickGeneratePost(
		user: CurrentUserPayload,
		input: QuickGeneratePostDto,
	) {
		try {
			if (user.role !== USER_ROLE.ADMIN) {
				throw new ForbiddenException(
					'Do not have permission to use this feature',
				);
			}
			const contentSourceName = CONTENT_SOURCE.find(
				(item) => item.id === input.contentSourceId,
			)?.name;

			if (!contentSourceName) {
				throw new BadRequestException(
					'The contentSource has not been processed for use with this feature',
				);
			}

			const data = {
				originalPostURL: input.url,
				contentSourceId: input.contentSourceId,
				title: '',
				content: '',
				tags: '',
				isSuccess: false,
			};
			let crawlData = '';

			switch (contentSourceName) {
				case 'Viblo':
					crawlData = await this.vibloService.getOneContentByLink(input.url);
					break;

				case 'Spiderum':
					crawlData = await this.spiderumService.getOneContentByLink(input.url);
					break;

				case 'VnExpress':
					crawlData = await this.vnExpressService.getOneContentByLink(
						input.url,
					);
					break;

				default:
					break;
			}

			const generatedData = await this.createPostSummaryAndTags(crawlData);
			if (generatedData != null && generatedData.isSuccess) {
				data.content = generatedData.summary;
				data.title = generatedData.title;
				data.tags = generatedData.tags;
				data.isSuccess = true;
			}

			return data;
		} catch (error) {
			console.log(error);
		}
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
			let data = { title: '', summary: '', tags: '', isSuccess: true };
			let safetyRatings = [];
			let hasHighProbability = false;

			//NOTE: Summary post
			const summaryPrompt = `Tóm tắt văn bản sau đây thành một đoạn nội dung có độ dài không quá 800 từ (format theo kiểu của html, có các thẻ như <p>, <h1>, ...): 
		${text}`;

			const summaryResult =
				await this.genAiProModel.generateContent(summaryPrompt);
			const summaryResponse = await summaryResult.response;
			const blockReason = summaryResponse.promptFeedback.blockReason;
			if (blockReason) {
				data.isSuccess = false;
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
				data.isSuccess = false;
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
				data.isSuccess = false;
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
