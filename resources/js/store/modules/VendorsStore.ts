import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import {buildVendorsQuery} from "../../utils/queryBuilders";

import {store} from "../store";
import {http} from "../../utils/axios";
import {apiRoutes} from "../../apiRoutes";
/* Interfaces */
import {AxiosResponse} from "axios";
import IMeta from "../../models/IMeta";
import ApiResponse from "../../models/IResponse";
import ITableParams, {IVendorsFilter} from "../../models/ITableParams";
import IVendor from "../../models/IVendor";

@Module({name: 'vendors', store: store, namespaced: true, dynamic: true})
class VendorsStore extends VuexModule {
  meta: IMeta = {};
  requestInProgress: boolean = false;
  vendors: IVendor[] = [];
  message: string = '';
  errors: [] = [];
  vendor: IVendor = {
    id: 0,
    name: '',
    components_count: 0,
    components_cost: 0,
    note: '',
    components: [],
    contacts: [],
    created_at: {date: '', timezone_type: 0, timezone: ''},
    updated_at: {date: '', timezone_type: 0, timezone: ''},
    deleted_at: {date: '', timezone_type: 0, timezone: ''}
  };
  tableParams: ITableParams<IVendorsFilter> = {
    page: 1,
    descending: false,
    filter: null,
    rowsPerPage: Number(localStorage.getItem('rowsPerPage')) || 5,
    sortBy: '',
  };

  @Mutation
  setRequestInProgress(isRequest: boolean) {
    this.requestInProgress = isRequest;
  }

  @Mutation
  setTableParams(params: ITableParams<IVendorsFilter>) {
    if (params.rowsPerPage) localStorage.setItem('rowsPerPage', params.rowsPerPage.toString());
    this.tableParams = params;
  }

  @Mutation
  resetFilter() {
    this.tableParams = {...this.tableParams, filter: null};
  }

  @Mutation
  setVendor(vendor: IVendor) {
    this.vendor = vendor;
  }

  @Mutation
  setVendors(vendors: IVendor[]) {
    this.vendors = vendors;
  }

  @Mutation
  setMeta(meta: IMeta) {
    this.meta = meta;
  }

  /*   ACTIONS   */
  @Action
  async getVendors() {
    this.context.commit('setRequestInProgress', true);
    try {
      const queryString = buildVendorsQuery(this.tableParams);
      const vendors: AxiosResponse<ApiResponse<IVendor[]>> = (
        await http.get(apiRoutes.vendors.index, {params: queryString})
      );
      this.context.commit('setMeta', vendors.data.meta);
      this.context.commit('setVendors', vendors.data.data);
    } catch (e) {
    } finally {
      this.context.commit('setRequestInProgress', false);
    }
  }
}

export const vendorsStore = getModule(VendorsStore);
