export interface OrdersInterface {
  list: (
    seller_id: string,
    limit: number,
    offset: number,
    sort: string
  ) => Promise<any>;
  readById: (resourceId: any) => Promise<any>;
  updateById: (resourceId: any) => Promise<void | undefined>;
  deleteById: (resourceId: any) => Promise<void | undefined>;
}
