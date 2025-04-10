import React from "react";
import { TextField } from "@mui/material";

const CustomTextField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  ...props
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      required={required}
      variant="outlined"
      fullWidth
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: 1,
          backgroundColor: "#fff",
          height: "45px"
        },
        "& label.Mui-focused": {
          color: "#1976d2",
        },
        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
          borderColor: "#1976d2",
        },
      }}
      {...props}
    />
  );
};

export default CustomTextField;
