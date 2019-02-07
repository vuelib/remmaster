import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import {store} from "../store";
import ITableParams, {IComponentsFilter} from "../../interfaces/ITableParams";
import {QueryBuilder} from "../../utils/QueryBuilder";
import {AxiosResponse} from "axios";
import IResponse from "../../interfaces/IResponse";
import {http} from "../../plugins/axios";
import {apiRoutes} from "../../apiRoutes";
import {snack} from "../../utils/snack";
import {createVendorModel, VendorCollection, VendorScheme} from "../../models/Vendor";
import {
  Component,
  ComponentCollection,
  ComponentScheme,
  createComponentModel,
  defaultComponentModel
} from "../../models/Component";
import {ComponentCategoryScheme} from "../../models/ComponentCategory";
import {createMetaModel, defaultMetaModel, Meta, MetaScheme} from "../../models/Meta";

@Module({name: 'components', store: store, namespaced: true, dynamic: true})
class ComponentsStore extends VuexModule {
  component: Component = defaultComponentModel;
  components: ComponentCollection = [];
  isRequest: boolean = false;
  isUpdateRequest: boolean = false;
  isFilterLoading: boolean = false;
  meta: Meta = createMetaModel(defaultMetaModel);
  message: string = '';
  errors: [] = [];
  tableParams: ITableParams<IComponentsFilter> = {
    page: 1,
    descending: false,
    filter: null,
    rowsPerPage: Number(localStorage.getItem('componentsPerPage')) || 5,
    sortBy: '',
  };
  availableVendors: VendorCollection = [];
  availableCategories: ComponentCategoryScheme[] = [];
  isComponentCreatingRequest: boolean = false;

  /* GETTERS */
  get getComponentById() {
    return (id: number) => this.components.find(c => c.id === id);
  }

  @Mutation setIsComponentCreatingRequest(isRequest: boolean) {
    this.isComponentCreatingRequest = isRequest;
  }

  @Mutation setComponents(components: ComponentScheme[]) {
    this.components = components.map(component => createComponentModel(component));
  }

  @Mutation setIsRequest(isRequest: boolean) {
    this.isRequest = isRequest;
  }

  @Mutation setIsUpdateRequest(isRequest: boolean) {
    this.isRequest = isRequest;
  }

  @Mutation setTableParams(params: ITableParams<IComponentsFilter>) {
    if (params.rowsPerPage) localStorage.setItem('componentsPerPage', params.rowsPerPage.toString());
    this.tableParams = params;
  }

  @Mutation setMeta(meta: MetaScheme) {
    this.meta = createMetaModel(meta);
  }

  @Mutation setMessage(message: string) {
    this.message = message;
  }

  @Mutation resetFilter() {
    this.tableParams = {...this.tableParams, filter: null};
  }

  @Mutation setFilterLoading(isLoading: boolean) {
    this.isFilterLoading = isLoading;
  }

  @Mutation setAvailableVendors(vendors: VendorScheme[]) {
    this.availableVendors = vendors.map(vendor => createVendorModel(vendor));
  }

  @Mutation setAvailableCategories(categories: { id: number, title: string }[]) {
    this.availableCategories = categories;
  }

  @Mutation setComponent(component: ComponentScheme) {
    this.component = createComponentModel(component);
  }

  @Action
  async getComponents() {
    this.setIsRequest(true);
    try {
      const queryString = (new QueryBuilder<IComponentsFilter>(this.tableParams)).build();
      const componentsRes: AxiosResponse<IResponse<ComponentScheme[]>> = (
        await http.get(apiRoutes.components.index, {params: queryString})
      );
      this.setMeta(componentsRes.data.meta);
      this.setComponents(componentsRes.data.data);

    } catch (e) {
      this.setMessage(e.response.data.message);

    } finally {
      this.setIsRequest(false);
    }
  }

  @Action
  async getAvailableVendors() {
    this.setFilterLoading(true);
    try {
      const vendorsRes: AxiosResponse<IResponse<VendorScheme[]>> = await http.get(apiRoutes.components.availableVendors);
      this.setAvailableVendors(vendorsRes.data.data);
    } finally {
      this.setFilterLoading(false);
    }
  }

  @Action
  async getAvailableCategories() {
    this.setFilterLoading(true);
    try {
      const categoriesRes: AxiosResponse<IResponse<{ id: number, title: string }[]>>
        = await http.get(apiRoutes.components.availableCategories);
      this.setAvailableCategories(categoriesRes.data.data);
    } finally {
      this.setFilterLoading(false);
    }
  }

  @Action
  async createComponent(component: ComponentScheme) {
    this.setIsComponentCreatingRequest(true);
    try {
      const componentRes: AxiosResponse<IResponse<ComponentScheme>> = await http.post(apiRoutes.components.create, component);
      this.setComponent(componentRes.data.data);
      snack.success('messages.components.createdSuccess', {
        title: this.component.title,
        article: this.component.article
      });
    } catch (e) {
      snack.err(e.response.data.message);
    } finally {
      this.setIsComponentCreatingRequest(false);
    }
  }

  @Action
  async getComponent(id: number) {
    this.setIsRequest(true);
    try {
      const componentRes: AxiosResponse<IResponse<ComponentScheme>> = await http.get(apiRoutes.components.show(id));
      this.setComponent(componentRes.data.data);
    } catch (e) {
      snack.err(e.response.data.message);
    } finally {
      this.setIsRequest(false);
    }
  }

  @Action
  async updateComponent(component: Component) {
    this.setIsUpdateRequest(true);
    try {
      if (component.id != null) {
        const componentRes: AxiosResponse<IResponse<ComponentScheme>> = await http.put(apiRoutes.components.update(component.id), component);
        this.setComponent(componentRes.data.data);
        snack.success('messages.components.updatedSuccess');
      }
    } catch (e) {
      snack.err(e.response.data.message);
    } finally {
      this.setIsUpdateRequest(false);
    }
  }

  @Action
  async deleteComponent({id, title = ''}: { id: number, title: string | null }) {
    this.setIsRequest(true);
    try {
      const response: AxiosResponse<IResponse<{}>> = await http.delete(apiRoutes.components.delete(id));
      if (title) snack.info('messages.components.deletedSuccess', {title});
    } catch (e) {
      snack.err(e.response.data.message);
    } finally {
      this.getComponents();
    }
  }
}

export const componentsStore = getModule(ComponentsStore);
