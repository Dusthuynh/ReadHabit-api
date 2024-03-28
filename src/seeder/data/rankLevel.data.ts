import { RankLevel } from 'src/modules/rank_levels/entities/rank_level.entity';

type IRankLevel = Partial<RankLevel>;
export const rankLevelData: IRankLevel[] = [
	{ name: 'Sắt', imageURL: 'files/rankLevel/iron.png' },
	{ name: 'Đồng', imageURL: 'files/rankLevel/bronze.png' },
	{ name: 'Bạc', imageURL: 'files/rankLevel/silver.png' },
	{ name: 'Vàng', imageURL: 'files/rankLevel/gold.png' },
	{ name: 'Bạch Kim', imageURL: 'files/rankLevel/platinum.png' },
	{ name: 'Kim Cương', imageURL: 'files/rankLevel/diamond.png' },
	{ name: 'Ascendant', imageURL: 'files/rankLevel/ascendant.png' },
	{ name: 'Immortal', imageURL: 'files/rankLevel/immortal.png' },
	{ name: 'Radiant', imageURL: 'files/rankLevel/radiant.png' },
];
