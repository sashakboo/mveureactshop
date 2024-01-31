import fs from 'fs';
import { executeCommand } from "../database/database";
import { IProduct, IBasketProduct, ICreatedProduct, ICategory, IUpdatedProduct, IListProduct } from "../models";

export async function GetCategories(onlyActive: boolean): Promise<Array<ICategory>> {
  let commandText = 'select id, title, cast(active as string) as active from productscategory';
  let params: Array<any> = [];
  if (onlyActive){
    commandText += ' where active = $1::boolean'
    params = [...params, onlyActive];
  }

  const results = await executeCommand(commandText, params);
  return results.rows.map(r => {
    return {
      id: parseInt(r['id']),
      title: r['title'],
      active: r['active'] === 'true',
    } as ICategory;
  });
}

export async function CreateCategory(categoryName: string): Promise<ICategory> {
  const commandText = 'insert into public.productscategory(title) values ($1::string) RETURNING id;';
  const results = await executeCommand(commandText, [ categoryName ]);
  if (results.rowCount === 0){
    throw new Error(`Не удалось создать категорию ${categoryName}`);
  }

  return {
    id: parseInt(results.rows[0]['id']),
    title: categoryName
  } as ICategory;
}

export async function UpdateCategory(category: ICategory): Promise<ICategory> {
  const commandText = 'update public.productscategory set title = $1::string, active = $2::boolean where id = $3::int';
  await executeCommand(commandText, [ category.title, category.active, category.id ]);
  return category;
}

export async function GetProduct(id: number): Promise<IProduct | null> {
  const commandText = 'SELECT ' +
    'p.id, p.title, c.id as categoryid, c.title as categorytitle, cast(c.active as string) as categoryactive, p.price, cast(p.active as string) active, convert_from(p.icon, \'UTF8\') as icon ' + 
    'FROM public.products as p inner join public.productscategory c on p.category = c.id where p.id = $1::int';
  const results = await executeCommand(commandText, [id]);
  if (results.rowCount !== 1)
    return null;

  const row = results.rows[0];
  const product: IProduct = {
    id: parseInt(row["id"]),
    category : {
        id: parseInt(row["categoryid"]),
        title: row["categorytitle"],
        active:  row['categoryactive'] === 'true',
    },
    title: row["title"],
    price: parseInt(row["price"]),
    isActive: row['active'] === 'true',
    icon: row['icon']
  }
  return product;
}

export async function GetProducts(categoryId: number | null, isActive: boolean | null): Promise<Array<IProduct>> {
  let commandText = 'SELECT ' +
    'p.id, p.title, c.id as categoryid, c.title as categorytitle, cast(p.active as string) as categoryactive, p.price, cast(p.active as string) as active, convert_from(p.icon, \'UTF8\') as icon ' + 
    'FROM public.products as p inner join public.productscategory c on p.category = c.id ' +
    'where c.active = true ';
  let params: Array<any> = []
  if (isActive != null){
    params = [ ...params, isActive ];
    commandText += ` and p.active = $${params.length}::boolean`;
  }
  if (categoryId != null){
    params = [ ...params, categoryId ];
    commandText += ` and category = $${params.length}::int`;
  }
  commandText += ' order by p.active desc, id desc';

  const results = await executeCommand(commandText, params);
  const products = results.rows.map(r => {
      const product: IProduct = {
          id: parseInt(r["id"]),
          category : {
              id: parseInt(r["categoryid"]),
              title: r["categorytitle"],
              active: r['categoryactive'] === 'true',
          },
          title: r["title"],
          price: parseInt(r["price"]),
          isActive: r['active'] === 'true',
          icon: r['icon']
      }
      return product;
  });
  return Promise.resolve(products);
}

export async function GetListProducts(userId: number, categoryId: number | null, isActive: boolean | null): Promise<Array<IListProduct>> {
  let commandText = 'SELECT ' +
    'p.id, p.title, c.id as categoryid, c.title as categorytitle, cast(c.active as string) as categoryactive, ' + 
    'p.price, cast(p.active as string) as active, convert_from(p.icon, \'UTF8\') as icon, count(b.id) as basketcount ' + 
    'FROM public.products as p inner join public.productscategory c on p.category = c.id ' +
    'left join public.basket b on b.product = p.id and b.customer = $1::int ' +
    'where c.active = true';
  let params: Array<any> = [ userId ]
  if (isActive != null){
    params = [ ...params, isActive ];
    commandText += ` and p.active = $${params.length}::boolean `;
  }
  if (categoryId != null){
    params = [ ...params, categoryId ];
    commandText += ` and category = $${params.length}::int `;
  }
  commandText += ' group by p.id, p.title, c.id, c.title, c.active, p.price, p.active, p.icon '
  commandText += ' order by p.active desc, id desc';

  const results = await executeCommand(commandText, params);
  const products = results.rows.map(r => {
      const product: IListProduct = {
          id: parseInt(r["id"]),
          category : {
              id: parseInt(r["categoryid"]),
              title: r["categorytitle"],
              active: r['categoryactive'] === 'true',
          },
          title: r["title"],
          price: parseInt(r["price"]),
          isActive: r['active'] === 'true',
          basketCount: parseInt(r['basketcount']),
          icon: r['icon']
      }
      return product;
  });
  return Promise.resolve(products);
}

export async function GetBasketProducts(userId: number): Promise<Array<IBasketProduct>> {
  const commandText = 'select b.id, p.id as productid, p.title, c.title as categorytitle, p.price ' + 
    'from public.basket b ' + 
    'inner join public.products p on p.id = b.product '+ 
    'inner join public.productscategory c on p.category = c.id ' + 
    'where b.customer = $1::int';
  const params = [ userId ];
  const results = await executeCommand(commandText, params);
  const products = results.rows.map(r => {
      const product: IBasketProduct = {
          id: parseInt(r["id"]),
          title: r["title"],
          categoryTitle: r["categorytitle"],
          price: parseInt(r["price"]),
          productId: parseInt(r["productid"])
      }
      return product;
  });
  return Promise.resolve(products);
}

export async function GetBasketCount(userId: number): Promise<number> {
  const commandText = 'select count(id) as count from public.basket where customer = $1::int';
  const params = [ userId ];
  const results = await executeCommand(commandText, params);
  if (results.rowCount !== 1)
    return Promise.resolve(0);

  const count = results.rows[0]['count'] as number
  return Promise.resolve(count);
}

export async function AddToBasket(productId: number, userId: number): Promise<void> {
  const commandText = 'insert into public.basket (product, customer) values ($1::int, $2::int) RETURNING id';
  const params = [ productId, userId ];
  await executeCommand(commandText, params);
}

export async function RemoveFromBasket(id: number): Promise<void> {
  const commandText = 'delete from public.basket where id = $1::int';
  const params = [ id ];
  await executeCommand(commandText, params);
}

export async function CreateProduct(product: ICreatedProduct): Promise<number | null> {
  const commandText = 'insert into public.products (title, category, price, active) ' + 
    'values ($1::string, $2::int, $3::numeric, $4::boolean) ' +
    'RETURNING id';
  const params = [ product.title, product.categoryId, product.price, product.isActive ];
  const result = await executeCommand(commandText, params);
  if (result.rowCount === 1)
    return parseInt(result.rows[0]['id'])

  return null;
}

export async function UpdateProduct(product: IUpdatedProduct) {
  const commandText = 'update public.products set category = $1::int, title = $2::string, price = $3::numeric, active = $4::boolean where id = $5::int';
  const params = [ product.categoryId, product.title, product.price, product.isActive, product.id ];
  await executeCommand(commandText, params);

}

export async function UpdateProductIcon(productId: number, iconPath: string) {
  const iconBase64 = fs.readFileSync(iconPath, 'base64');
  const commandText = 'update public.products set icon = convert_to($1::string, \'UTF8\') where id = $2::int';
  await executeCommand(commandText, [ iconBase64, productId ]);
}