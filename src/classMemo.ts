export interface xxxRepo {
  index(): Promise<xxx>;
  find(id: string): Promise<xxx>;
  delete(id: string): Promise<void>;
  update(xxx: xxx): Promise<xxx>;
}
