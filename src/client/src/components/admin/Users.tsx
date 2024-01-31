import { useState, useContext, useEffect } from "react";
import { EditableTable, IEditableTableProps, InputTypes } from "../EditableTable";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { IUser } from "../../models";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";

export interface IUserProps {
  users: Array<IUser>,
  updateUser: (user: IUser) => void
}

export default function Users(props: IUserProps) {
  const [ users, setUsers ] = useState<Array<IUser>>([...props.users]);
  const { request, error, clearError, loading } = useHttp();
  const auth = useContext(AuthContext);

  const isActiveSelectItems = [ { id: 1, title: 'Да' }, { id: 0, title: 'Нет' } ];
  const tableProps: IEditableTableProps = {
    columnsIds: [ 'id', 'email', 'role', 'password', 'active' ],
    columnsTitle: [ 'ID', 'Email', 'Роль', 'Пароль', 'Вкл'],
    inputTypes: [ null, null, InputTypes.text, InputTypes.text, InputTypes.select ],
    selectItems: [ null, null, null, null, isActiveSelectItems ],
    values: users.map((u) => {
      return [ u.id, u.email, u.role, '', u.active ? 'Да' : 'Нет' ]
    }),
    sourceObjs: [ ...users ],
    canAddNew: false,
    updateItem: async (sourceObj, form) => {
      const user = sourceObj as IUser;
      const newUser: IUser = { 
        ...user, 
        password: (form.get('password') as string ?? user.password), 
        role: (form.get('role') as string ?? user.role),
        active: form.get('active') != null ? form.get('active') == 1 : user.active
      };
      const result = await updateUser(newUser);
      setUsers(users.map(u => {
        if (u.id === result?.id)
          return result;

        return u;
      }));
      props.updateUser(result)
    },
    addNewItem: () => { }
  }

  const updateUser = async (user: IUser) => {
    const apiUrl = '/api/users/update';
    const response = await request(apiUrl, 'POST', JSON.stringify(user), { Authorization: `Bearer ${auth.token}` });
    return response as IUser;
  }

  return (
    <div className="container">
      { error != null && <ErrorMessage message={error} close={clearError}/> }
      {loading && <Loader />}
      <EditableTable {...tableProps}/>
    </div>
  )
}