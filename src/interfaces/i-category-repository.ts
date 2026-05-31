export interface ICategoryRepository {
  existsForUser(categoryId: string, userId: string): Promise<boolean>;
}
