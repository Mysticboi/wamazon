import React from 'react';
import type { InputHTMLAttributes } from 'react';
import { Field } from 'react-final-form';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const ImagesField = ({ name, ...props }: Props) => (
  <Field<FileList> name={name}>
    {({ input: { value, onChange, ...input } }) => (
      <input
        {...input}
        type="file"
        multiple
        accept=".jpg, .jpeg, .png"
        onChange={({ target }) => onChange(target.files)} // instead of the default target.value
        {...props}
      />
    )}
  </Field>
);

export default ImagesField;
