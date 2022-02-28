import { jsonGenerator } from './utils/jsonGenerator';

export async function run(): Promise<void> {
  await jsonGenerator.build();
}
