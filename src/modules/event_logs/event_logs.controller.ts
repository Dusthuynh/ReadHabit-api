import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetEventLogDto } from './dto/get-event-logs.dto';
import { EventLogsService } from './event_logs.service';

@Controller('event-logs')
@ApiTags('event-logs')
export class EventLogsController {
	constructor(private readonly eventLogsService: EventLogsService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Event logs',
	})
	async getManyEventLog(@Query() filter: GetEventLogDto) {
		return await this.eventLogsService.getManyEventLog(filter);
	}
}
