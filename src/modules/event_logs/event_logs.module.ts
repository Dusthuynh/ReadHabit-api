import { Module } from '@nestjs/common';
import { EventLogsController } from './event_logs.controller';
import { EventLogsService } from './event_logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLog } from './entities/event_log.entity';

@Module({
	imports: [TypeOrmModule.forFeature([EventLog])],
	controllers: [EventLogsController],
	providers: [EventLogsService],
	exports: [EventLogsService],
})
export class EventLogsModule {}
