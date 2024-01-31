import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";

export enum InputTypes {
  text,
  number,
  image,
  select
}

export interface ISelectItem {
  id: number,
  title: string
}

export interface IEditableTableProps {
  columnsTitle: Array<string>,
  columnsIds: Array<string>,
  inputTypes: Array<InputTypes | null>,
  selectItems: Array<Array<ISelectItem> | null>
  values: Array<Array<string | number>>
  sourceObjs: Array<any>,
  canAddNew: boolean,
  updateItem: (sourceObj: object, form: Map<string, any>) => void
  addNewItem: (form: Map<string, any>) => void
}

export function EditableTable(props: IEditableTableProps) {
  const newRowIndex = -1;
  const [ editableRow, setEditableRow ] = useState<null | number>(null);
  const [ form, setForm ] = useState<Map<string, any>>(new Map());
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

  const validateNewForm = (): boolean => {
    if (editableRow !== newRowIndex)
      return true;

    const editableKeys = props.columnsIds.filter((c, i) => props.inputTypes[i] != null);
    const emptyItems = editableKeys.map((id, i) => {
      if (form.get(id) == null)
        return { id: id, index: i }
      
      return null;      
    }).filter(e => e != null);
    
    return emptyItems.length == 0;
  }

  const changeHandler = (event: React.FormEvent<HTMLSelectElement | HTMLInputElement>) => {
    if (event.currentTarget == null){
      return;
    }
    const key = event.currentTarget.name;
    const value = event.currentTarget.value;
    setForm((previousForm) => previousForm.set(key, value));
  }

  useEffect(() => {
    setEditableRow(null)
    setForm(new Map())
  }, [props])

  const fileChangedHandler = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget == null){
      return;
    }
    const key = event.currentTarget.name;
    const value = event.currentTarget.files?.item(0);
    setForm((previousForm) => previousForm.set(key, value));
  }

  const getInputElement = (rowIndex: number, valueIndex: number, defaultValue: string | number | null) => {
    const inputType = props.inputTypes[valueIndex];
    const className = 'form-control form-control-sm';
    const propertyId = props.columnsIds[valueIndex];
    if (inputType === InputTypes.image){
      return (
        <td key={`${rowIndex}-${valueIndex}`}>
          <input className={className} name={propertyId} onChange={fileChangedHandler} type="file" accept="image/png, image/gif, image/jpeg" />
        </td>
      )
    }

    if (inputType === InputTypes.select) {
      const selectItems = props.selectItems[valueIndex] ?? [];
      let defaultSelect = newRowIndex;
      if (rowIndex != newRowIndex){
        const currentSelect = props.values[rowIndex][valueIndex] as string;
        defaultSelect = selectItems.find(x => x.title === currentSelect)?.id ?? selectItems[0].id;
      }

      return (
        <td key={`${rowIndex}-${valueIndex}`}>
          <select className="form-control form-control-sm" name={propertyId} defaultValue={defaultSelect} onChange={changeHandler}>
            <option disabled={true} value={-1}>-----</option>
            {
              selectItems.map((s, i) => {
                return (
                  <option value={s.id} key={`${s.id}-${i}`}>{s.title}</option>
                )
              })
            }
          </select>
        </td>
      )
    }

    const inputTypeHtml = inputType === InputTypes.number ? 'number' : 'text';
    const disabled = props.inputTypes[valueIndex] == null;
    return (
      <td key={`${rowIndex}-${valueIndex}`}>
        <input className={className} name={propertyId} onChange={changeHandler} disabled={disabled} type={inputTypeHtml}  defaultValue={defaultValue ?? ''} />
      </td>
    )
  }

  const getValueElement = (rowIndex: number, valueIndex: number) => {
    const inputType = props.inputTypes[valueIndex];
    if (rowIndex === editableRow) {
      return getInputElement(rowIndex, valueIndex, props.values[rowIndex][valueIndex]);
    }

    if (inputType === InputTypes.image){
      return (
        <td style={{width: '10rem'}} key={`${rowIndex}-${valueIndex}`}>
          <img className="img img-thumbnail" style={{width: '10rem'}} src={`data:image/png;base64,${props.values[rowIndex][valueIndex]?.toString() ?? ''}`} alt="thumbnail"/>
        </td>
      )
    }

    return (
      <td style={{width: '10rem'}} key={`${rowIndex}-${valueIndex}`}>{props.values[rowIndex][valueIndex]}</td>
    )
  }

  const onEditHanler = (rowIndex: number) => {
    setEditableRow(rowIndex);
  }

  const onSaveHandler = (rowIndex: number) => {
    props.updateItem(props.sourceObjs[rowIndex], form);
    setEditableRow(null);
    setForm(new Map());
  }

  const onCancelHandler = () => {
    setEditableRow(null);
    setForm(new Map());
  }

  const onAddNewHandler = () => {
    setForm(new Map());
    setEditableRow(newRowIndex);
  }

  const onSaveNewHandler = () => {
    const isValid = validateNewForm();
    if (!isValid) {
      setErrorMessage('Заполните все поля формы.');
      return;
    }
    setEditableRow(null);
    props.addNewItem(form);
  }

  return (
    <div className="container my-2">
      { props.canAddNew && (
        <div className="my-2">
            <button className="btn btn-outline-primary btn-sm" onClick={onAddNewHandler}>Добавить</button>
        </div>
      )}      
      <div className="row">
          <div className="col-12">
              <div className="card">
                  <div className="card-body">
                      {errorMessage && <ErrorMessage message={errorMessage} close={() => setErrorMessage(null)} />}
                      <div className="table-responsive">
                          <table className="table table-editable table-nowrap align-middle table-edits">
                              <thead>
                                  <tr style={{cursor: 'pointer'}}>
                                      {props.columnsTitle.map((title, i) => {
                                        return (
                                          <th key={i}>{title}</th>
                                        )
                                      })}
                                      <th key="edit">Действия</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {editableRow === newRowIndex && 
                                    (
                                        <tr key={'newRow'} style={{cursor: 'pointer'}}>
                                          {props.inputTypes.map((t, i) => {
                                            return getInputElement(editableRow, i, null);
                                          })}
                                          <td style={{width: '10rem'}} >
                                            <button className="btn btn-link btn-sm" onClick={onSaveNewHandler}>Сохранить</button>
                                            <button className="btn btn-link btn-sm" onClick={onCancelHandler}>Отменить</button>
                                          </td>
                                        </tr>
                                    )
                                  }
                                  {props.values.map((v, i) => {
                                    return (
                                      <tr key={i} style={{cursor: 'pointer'}}>
                                        {v.map((d, j) => {
                                          return getValueElement(i, j)
                                        })}
                                        <td style={{width: '10rem'}} >
                                          {editableRow === i && <button className="btn btn-link btn-sm" onClick={() => onSaveHandler(i)}>Сохранить</button>}
                                          {editableRow !== i && <button className="btn btn-link btn-sm" disabled={editableRow != null} onClick={() => onEditHanler(i)}>Изменить</button>}
                                          {editableRow === i && <button className="btn btn-link btn-sm" onClick={onCancelHandler}>Отменить</button>}
                                        </td>
                                      </tr>)
                                  })}                                  
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}