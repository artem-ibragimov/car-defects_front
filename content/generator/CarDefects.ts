type CarName = string;
type ModelID = string;
type Entity = { [name: CarName]: { modelID: ModelID } };
type Key = 'age' | 'mileage';
type DataParams = { norm?: boolean; by_mileage?: boolean; by_age?: boolean };
type DefectData = Record<number, number>;

const MAX_CARS = 4;
const ORIGIN = 'https://car-defects.com/data/defect/';

export class CarDefects {
	static searchForCars(cars: string[]): Promise<(Entity | null)[]> {
		const entities_fetching = cars
			.map((car_name) => car_name.toLowerCase())
			.map((car_name) =>
				fetch(`https://car-defects.com/data/search/?query=${encodeURI(car_name)}`)
					.then((res) => res.json())
					.then((data: { models: Record<string, string> }) => findModelName(car_name, data.models))
			);
		return Promise.all(entities_fetching);
	}

	static removeDublicates(entities: (Entity | null)[]) {
		const entity_params = entities
			.filter((e): e is Entity => !!e)
			.reduce((acc, cur) => Object.assign(acc, cur), {});

		const params_reversed = Object.fromEntries(
			Object.entries(entity_params).map(([title, params]) => [JSON.stringify(params), title])
		);
		const params = Object.fromEntries(
			Object.entries(params_reversed).map(([params, title]) => [title, JSON.parse(params)])
		);
		return Object.fromEntries(Object.entries(params).slice(0, MAX_CARS));
	}

	static getDefects({ byMilage }: { byMilage: boolean }) {
		return (entities: Entity) =>
			getDefects({ byMilage, isNorm: true }, entities).catch(() =>
				getDefects({ byMilage, isNorm: false }, entities)
			);
	}
}

function findModelName(carName: string, models: Record<ModelID, string> = {}): Entity | null {
	const countNameMatches = createCountNameMathes(carName);
	const matches = Object.entries(models).map(countNameMatches);
	const modelID = matches.sort((a, b) => b[1] - a[1])[0];
	if (!modelID) {
		return null;
	}
	return { [carName]: { modelID: modelID[0] } };
}

function createCountNameMathes(carName: CarName): (entry: [string, string]) => [string, number] {
	const car_name_parts = carName.split(/\s|\-/);
	return ([id, name]: [string, string]) => {
		const parts = name.split(/\s|\-/);
		const match_amount = car_name_parts.reduce(
			(match_amount, car_name_part) => match_amount + (parts.includes(car_name_part) ? 1 : 0),
			0
		);
		return [id, match_amount];
	};
}
function getDefects(cfg: { isNorm: boolean; byMilage: boolean }, entities: Entity = {}) {
	const dataParams: DataParams = {
		norm: cfg.isNorm,
		by_age: !cfg.byMilage,
		by_mileage: cfg.byMilage
	};
	const url = `https://car-defects.com/#entity_params=${JSON.stringify(
		entities
	)}&${new URLSearchParams({ data_params: JSON.stringify(dataParams) })}`;
	const fetching = Object.entries(entities).map(
		([carName, entity]): Promise<[CarName, DefectData]> => {
			const query = `${ORIGIN}${cfg.byMilage ? 'mileage' : ('age' as Key)}?${new URLSearchParams({ ...entity, ...{ norm: cfg.isNorm ? 'true' : 'false' } })}`;
			return fetch(query)
				.then((res) => res.json())
				.then((data: DefectData) => {
					if (Object.keys(data).length === 0) {
						throw new Error('no defects for ' + carName);
					}
					return data;
				})
				.then((data) => [carName, data]);
		}
	);
	return Promise.all(fetching).then((defects) => {
		const cars: CarName[] = defects.map(([carName, _]) => carName);
		if (defects.length < 2) {
			throw new Error(cars.join() + ': no data');
		}
		return { defects: Object.fromEntries(defects), cars, dataParams, url };
	});
}
