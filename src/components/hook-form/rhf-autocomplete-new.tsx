import { useFormContext, Controller } from 'react-hook-form';
// @mui
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

interface Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  changeState: any;
}

export default function RHFAutocompleteNew<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  name,
  label,
  placeholder,
  helperText,
  changeState,
  ...other
}: Omit<Props<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'>) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          {...other}
          // value={field.value}
          onChange={(event, newValue : any) => {
            setValue(name, newValue, { shouldValidate: true });
            // console.log("onChange", newValue);
            changeState(newValue._id);
          }}
          onInputChange={(event, newInputValue : any, reason) => {
            if (other.freeSolo && reason === 'input') {
              setValue(name, newInputValue, { shouldValidate: true });
              // console.log("onInputChange", newInputValue);
            changeState(newInputValue._id);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error.message : helperText}
            />
          )}
        />
      )}
    />
  );
}
