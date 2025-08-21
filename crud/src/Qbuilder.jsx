import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const fields = [
  { value: "name", label: "Name", type: "string" },
  { value: "category", label: "Category", type: "string" },
  { value: "mfd", label: "Date", type: "date" },
  { value: "mrp", label: "MRP", type: "number" },
];

const operators = {
  string: [
    "contains",
    "does not contain",
    "starts with",
    "ends with",
    "equals",
    "not equals",
  ],
  number: ["=", "!=", ">", ">=", "<", "<="],
  date: ["before", "after", "on", "between"],
};

export default function QueryBuilder({ onApply }) {
  const [conditions, setConditions] = useState([]);
  const [logic, setLogic] = useState("AND");

  const addCondition = () => {
    setConditions([...conditions, { field: "", operator: "", value: "" }]);
  };

  const updateCondition = (index, key, value) => {
    const updated = [...conditions];
    updated[index][key] = value;

    if (key === "field") {
      updated[index].operator = "";
      updated[index].value = "";
    }
    setConditions(updated);
  };

  const removeCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    onApply({ conditions, logic });
  };
  return (
    <Box p={2} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Query Builder
      </Typography>

      {conditions.map((cond, index) => {
        const fieldType =
          fields.find((f) => f.value === cond.field)?.type || "";

        return (
          <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Field</InputLabel>
              <Select
                value={cond.field}
                label="Field"
                onChange={(e) =>
                  updateCondition(index, "field", e.target.value)
                }
              >
                {fields.map((f) => (
                  <MenuItem key={f.value} value={f.value}>
                    {f.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Operator</InputLabel>
              <Select
                value={cond.operator}
                label="Operator"
                onChange={(e) =>
                  updateCondition(index, "operator", e.target.value)
                }
              >
                {fieldType &&
                  operators[fieldType].map((op) => (
                    <MenuItem key={op} value={op}>
                      {op}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {cond.operator === "between" ? (
              <Box display="flex" gap={1}>
                <TextField
                  type={fieldType === "date" ? "date" : "text"}
                  value={cond.value?.[0] || ""}
                  onChange={(e) =>
                    updateCondition(index, "value", [
                      e.target.value,
                      cond.value?.[1],
                    ])
                  }
                />
                <TextField
                  type={fieldType === "date" ? "date" : "text"}
                  value={cond.value?.[1] || ""}
                  onChange={(e) =>
                    updateCondition(index, "value", [
                      cond.value?.[0],
                      e.target.value,
                    ])
                  }
                />
              </Box>
            ) : (
              <TextField
                type={
                  fieldType === "number"
                    ? "number"
                    : fieldType === "date"
                    ? "date"
                    : "text"
                }
                value={cond.value}
                onChange={(e) =>
                  updateCondition(index, "value", e.target.value)
                }
              />
            )}

            <IconButton onClick={() => removeCondition(index)} color="error">
              <Delete />
            </IconButton>
          </Box>
        );
      })}

      <Button variant="outlined" onClick={addCondition} sx={{ mb: 2 }}>
        + Add Condition
      </Button>

      <Box mb={2}>
        <ToggleButtonGroup
          value={logic}
          exclusive
          onChange={(e, val) => val && setLogic(val)}
        >
          <ToggleButton value="AND">AND</ToggleButton>
          <ToggleButton value="OR">OR</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Button variant="contained" onClick={handleApply}>
        Apply Query
      </Button>
    </Box>
  );
}
