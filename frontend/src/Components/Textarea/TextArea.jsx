import React from 'react';

 export default function TextArea ({
  value,
  onChange,
  placeholder = '',
  rows = 5,
  cols = 50,
  maxLength,
  disabled = false,
  readOnly = false,
  style = {},
  className = '',
  label,
  reference,
  error,
}) {
  return (
    <div className={`textarea-wrapper ${className}`} style={style}>
      {label && <label htmlFor={reference}>{label}</label>}
      <textarea
        id={reference}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        className={""}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && <span className="">{error}</span>}
    </div>
  );
};


