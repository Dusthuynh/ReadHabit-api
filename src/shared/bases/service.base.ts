import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { SuccessResponse } from '../response/success-response';
import { DefaultListDto } from '../dto/default-list-dto';
import {
	DeepPartial,
	FindOptionsOrder,
	FindOptionsRelations,
	FindOptionsSelect,
	FindOptionsWhere,
	ILike,
	Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class BaseService<T> {
	constructor(private _repository: Repository<T>) {}

	async findOne(
		where: FindOptionsWhere<T>,
		select?: FindOptionsSelect<T>,
	): Promise<T> {
		const data = await this._repository.findOne({ select, where });
		if (!data) {
			throw new NotFoundException();
		}
		return data;
	}

	async findOneWithoutThrowError(
		where: FindOptionsWhere<T>,
		select?: FindOptionsSelect<T>,
	): Promise<T> {
		return await this._repository.findOne({ select, where });
	}

	/**
	 *
	 * @returns data with pagination of entity
	 */
	async findMany(
		filter: DefaultListDto,
		select?: FindOptionsSelect<T>,
	): Promise<SuccessResponse<T[], DefaultListDto>> {
		const { limit, offset, sortField, sortOrder, ...condition } = filter;
		try {
			const where = {};
			if (condition?.searchField && condition?.searchValue) {
				where[condition.searchField] = ILike(`%${condition.searchValue}%`);
			}

			const order = {};
			if (sortField && sortOrder) {
				order[sortField] = sortOrder;
			}

			const [count, data] = await Promise.all([
				this._repository.count({
					where,
				}),
				this._repository.find({
					select,
					where,
					order,
					//NOTE: limit 100 rows
					take: limit ? (limit <= 100 ? limit : 100) : 10,
					skip: offset ? offset : 0,
				}),
			]);

			return {
				filter: filter,
				total: count,
				data,
			};
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	/**
	 *
	 * @returns all data of entity
	 */
	async findAll(
		filter: DefaultListDto,
		select?: FindOptionsSelect<T>,
	): Promise<SuccessResponse<T[], DefaultListDto>> {
		const { sortField, sortOrder, ...condition } = filter;
		try {
			const where = {};
			if (condition?.searchField && condition?.searchValue) {
				where[condition.searchField] = ILike(`%${condition.searchValue}%`);
			}

			const order = {};
			if (sortField && sortOrder) {
				order[sortField] = sortOrder;
			}

			const [count, data] = await Promise.all([
				this._repository.count({
					where,
				}),
				this._repository.find({
					select,
					where,
					order,
				}),
			]);

			return {
				filter: filter,
				total: count,
				data,
			};
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	/**
	 *
	 * @param where
	 * @param select
	 * @returns all data with option where entity
	 */
	async findAllData(
		where: FindOptionsWhere<T>,
		select?: FindOptionsSelect<T>,
	): Promise<T[]> {
		try {
			const data = await this._repository.find({ select, where });
			return data;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	/**
	 *
	 * @param where
	 * @param select
	 * @param relations
	 * @returns all data with option where entity and relations
	 */
	async findAllDataWithRelation({
		where,
		select,
		relations,
		order,
		limit,
	}: {
		where: FindOptionsWhere<T>;
		select?: FindOptionsSelect<T>;
		relations?: FindOptionsRelations<T>;
		order?: FindOptionsOrder<T>;
		limit?: number;
	}) {
		try {
			const data = await this._repository.find({
				select,
				where,
				relations,
				order,
				take: limit,
			});
			return data;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	/**
	 *
	 * @param where
	 * @param select
	 * @param relations
	 * @returns one data with option where entity and relations
	 */
	async findOneWithRelation({
		where,
		select,
		relations,
		order,
	}: {
		where: FindOptionsWhere<T>;
		select?: FindOptionsSelect<T>;
		relations?: FindOptionsRelations<T>;
		order?: FindOptionsOrder<T>;
	}) {
		try {
			const data = await this._repository.findOne({
				select,
				where,
				relations,
				order,
			});
			return data;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async createOne(input: DeepPartial<T>): Promise<T> {
		try {
			const newUser = this._repository.create(input);
			return await this._repository.save(newUser);
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateOne(
		where: FindOptionsWhere<T>,
		input: QueryDeepPartialEntity<T>,
	): Promise<T> {
		try {
			const resUpdate = await this._repository.update(where, input);
			if (resUpdate.affected === 1) {
				const data = await this._repository.findOne({ where });
				if (!data) {
					throw new NotFoundException();
				}
				return data;
			}
			throw new BadRequestException('Data invalid!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updateMany(
		where: FindOptionsWhere<T>,
		input: QueryDeepPartialEntity<T>,
	): Promise<{ success: boolean }> {
		try {
			const resUpdate = await this._repository.update(where, input);
			if (resUpdate.affected >= 1) {
				return { success: true };
			}
			throw new BadRequestException('Update failed!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteOne(
		criteria: number | FindOptionsWhere<T>,
	): Promise<{ success: boolean }> {
		try {
			const data = await this._repository.softDelete(criteria);
			if (data.affected === 1) {
				return { success: true };
			}
			throw new BadRequestException('Delete failed!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async deleteMany(criteria: number | FindOptionsWhere<T>) {
		try {
			const res = await this._repository.softDelete(criteria);
			if (res.affected === 0) {
				return { success: false };
			}
			return { success: true };
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	/**
	 * soft remove entities with all children
	 * @param entities
	 * @returns
	 */

	async removeMany(entities: DeepPartial<T>[]) {
		try {
			const res = await this._repository.softRemove(entities);
			if (!res?.length) {
				return { success: false };
			}
			return { success: true };
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async hardDeleteOne(
		criteria: number | FindOptionsWhere<T>,
	): Promise<{ success: boolean }> {
		try {
			const data = await this._repository.delete(criteria);
			if (data.affected === 1) {
				return { success: true };
			}
			throw new BadRequestException('Delete failed!');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
