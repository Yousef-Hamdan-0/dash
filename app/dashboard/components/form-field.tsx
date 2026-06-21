interface FormFieldProps {
  label:       string
  name:        string
  type?:       string
  value?:      string
  placeholder?: string
  required?:   boolean
  hint?:       string
  rows?:       number
  children?:   React.ReactNode
}

export function FormField({
  label, name, type = 'text', value, placeholder, required, hint, rows, children,
}: FormFieldProps) {
  return (
    <div className="dash-field">
      <label htmlFor={name} className="dash-label">
        {label}{required && <span className="dash-required">*</span>}
      </label>

      {children ? (
        children
      ) : rows ? (
        <textarea
          id={name}
          name={name}
          defaultValue={value}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className="dash-textarea"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          required={required}
          className="dash-input"
        />
      )}

      {hint && <p className="dash-help">{hint}</p>}
    </div>
  )
}

interface SelectFieldProps {
  label:    string
  name:     string
  value?:   string
  required?: boolean
  options:  { value: string; label: string }[]
}

export function SelectField({ label, name, value, required, options }: SelectFieldProps) {
  return (
    <div className="dash-field">
      <label htmlFor={name} className="dash-label">
        {label}{required && <span className="dash-required">*</span>}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={value}
        required={required}
        className="dash-select"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

interface CheckboxFieldProps {
  label:   string
  name:    string
  checked?: boolean
  hint?:   string
}

export function CheckboxField({ label, name, checked, hint }: CheckboxFieldProps) {
  return (
    <div className="dash-field">
      <label className="dash-checkbox">
        <input
          type="checkbox"
          name={name}
          defaultChecked={checked}
          value="true"
        />
        <span className="dash-label">{label}</span>
      </label>
      {hint && <p className="dash-help">{hint}</p>}
    </div>
  )
}
