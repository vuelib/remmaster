import {DateTime} from "./DateTime";
import {Vendor} from "./Vendor";
import {ComponentCategory} from "./ComponentCategory";
import {Type} from "class-transformer";
import {Response as ResponseModel, ResponseScheme} from "./Response";
import {AxiosResponse} from "axios";
import {http} from "../plugins/axios";

export class Component {
  id: number | null = null;
  title: string | null = null;
  article: string | null = null;
  category_id: number | null = null;
  cost: number | null = null;
  count: number | null = null;
  vendor_id: number | null = null;
  @Type(() => ComponentCategory) category: ComponentCategory | null = null;
  @Type(() => Vendor) vendor: Vendor | null = null;
  @Type(() => DateTime) created_at: DateTime | null = null;
  @Type(() => DateTime) deleted_at: DateTime | null = null;
  @Type(() => DateTime) updated_at: DateTime | null = null;

  /**
   * @param query
   */
  static async all(query?: {}): Promise<ResponseModel<Component[]>> {
    const res: AxiosResponse<ResponseScheme<Component[]>> = await http.get(`components`, {params: query});
    return new ResponseModel(res.data, Component);
  }

  /**
   * @param component
   */
  static async create(component: Component): Promise<ResponseModel<Component>> {
    const res: AxiosResponse<ResponseScheme<Component>> = await http.post(`components`, component);
    return new ResponseModel(res.data, Component);
  }

  /**
   * @param identifier
   */
  static async get(identifier: number): Promise<ResponseModel<Component>> {
    const res: AxiosResponse<ResponseScheme<Component>> = await http.get(`components/${identifier}`);
    return new ResponseModel(res.data, Component);
  }

  /**
   * @param component
   */
  static async update(component: Component): Promise<ResponseModel<Component>> {
    const res: AxiosResponse<ResponseScheme<Component>> = await http.put(`components/${component.id}`, component);
    return new ResponseModel(res.data, Component);
  }

  /**
   * @param identifier
   */
  static async delete(identifier: number): Promise<ResponseModel<{ new(): { message?: string, errors?: [] } }>> {
    const res: AxiosResponse<ResponseModel<{ new(): { message?: string, errors?: [] } }>> = await http.delete(`components/${identifier}`);
    return new ResponseModel(res.data, class {
      message?: string;
      errors?: [];
    });
  }
}

