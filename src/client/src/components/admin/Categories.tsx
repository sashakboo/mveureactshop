import { useState, useContext } from "react";
import { EditableTable, IEditableTableProps, InputTypes } from "../EditableTable";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { ICategory } from "../../models";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";

export interface ICategoriesProps {
  categories: Array<ICategory>,
  createCategory: (category: ICategory) => void,
  updateCategory: (category: ICategory) => void
}

export default function Categories(props: ICategoriesProps) {
  const [ categories, setCategories ] = useState<Array<ICategory>>([...props.categories]);
  const { request, error, clearError, loading } = useHttp();
  const auth = useContext(AuthContext);

  const createCategory = async (title: string) => {
    const response = await request(`/api/categories/create/${title}`, 'POST', null, { Authorization: `Bearer ${auth.token}` });
    const category = response as ICategory;
    setCategories([category, ...categories])
    props.createCategory(category);
  }

  const updateCategory = async (category: ICategory) => {
    const response = await request(`/api/categories/update`, 'POST', JSON.stringify(category), { Authorization: `Bearer ${auth.token}` });
    const updatedCategory = response as ICategory;
    setCategories(categories.map(p => {
      if (p.id === category?.id)
        return category;
      return p;
    }));
    props.updateCategory(updatedCategory);
  }

  const isActiveSelectItems = [ { id: 1, title: 'Да' }, { id: 0, title: 'Нет' } ];
  const tableProps: IEditableTableProps = {
    columnsIds: [ 'id', 'title', 'active' ],
    columnsTitle: [ 'ID', 'Наименование', 'Вкл' ],
    inputTypes: [ null, InputTypes.text, InputTypes.select ],
    selectItems: [ null, null, isActiveSelectItems ],
    values: categories.map((p) => {
      return [ p.id, p.title, p.active ? 'Да' : 'Нет' ]
    }),
    sourceObjs: [ ...categories ],
    canAddNew: true,
    updateItem: async (sourceObj, form) => {
      const sourceCategory = sourceObj as ICategory;
      const category = {
        ...sourceCategory,
        title: form.get('title') ?? sourceCategory.title,
        active: form.get('active') == 1
      }
      await updateCategory(category);
    },
    addNewItem: async (form) => {
      await createCategory(form.get('title'));
    }
  }

  return (
    <div className="container">
      { error != null && <ErrorMessage message={error} close={clearError}/> }
      {loading && <Loader />}
        <EditableTable {...tableProps}/>
    </div>
  )
}