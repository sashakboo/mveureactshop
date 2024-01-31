export interface IErrorMessageProps {
  message: string,
  close: () => void
}

export default function ErrorMessage (props: IErrorMessageProps) {
  return (
    <div className="alert alert-danger alert-dismissible fade show my-2" role="alert">
      {props.message}
      <button type="button" className="btn-close" aria-label="Close" onClick={props.close}></button>
    </div>
  )
}