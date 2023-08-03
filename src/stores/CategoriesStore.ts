import { action, makeObservable, observable } from 'mobx';
import { CategoryResponse } from '../data/api/productsAPI';

export type CategoryModel = CategoryResponse;
export class CategoriesStore {
  @observable categories: CategoryModel[];

  constructor() {
    this.categories = [];

    makeObservable(this);
  }

  @action setCategories(categories: CategoryModel[]) {
    this.categories = categories;
  }

  public clear() {
    this.categories = [];
  }
}
