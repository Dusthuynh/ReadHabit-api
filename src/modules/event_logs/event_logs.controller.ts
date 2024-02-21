import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { GetEventLogDto } from './dto/get-event-logs.dto';

@Controller('event-logs')
@ApiTags('event-logs')
export class EventLogsController {
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many Event logs',
	})
	getManyEventLog(@Query() filter: GetEventLogDto) {
		return filter;
	}
}
