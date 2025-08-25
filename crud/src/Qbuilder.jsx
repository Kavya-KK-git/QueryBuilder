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
import dayjs from "dayjs";

const fields = [
  { value: "name", label: "Name" },
  { value: "category", label: "Category" },
  { value: "mfd", label: "Date" },
  { value: "mrp", label: "MRP" },
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
  number: [
    "equals",
    "not equals",
    "greater than",
    "greater than or equal",
    "lesser than",
    "lesser than or equal",
    "range",
  ],
  date: ["before", "after", "on", "between"],
};

function detectType(value, field) {
  if (field === "mrp") return "number";
  if (field === "mfd") return "date";

  if (Array.isArray(value)) {
    if (dayjs(value[0], "YYYY-MM-DD", true).isValid()) return "date";
    if (!isNaN(Number(value[0]))) return "number";
  }

  if (dayjs(value, "YYYY-MM-DD", true).isValid()) return "date";
  if (!isNaN(Number(value)) && value !== "") return "number";

  return "string";
}

export default function QueryBuilder({ onApply }) {
  const [conditions, setConditions] = useState([]);
  const [logic, setLogic] = useState("AND");

  const addCondition = () => {
    setConditions([...conditions, { field: "", operator: "", value: "" }]);
  };

  const updateCondition = (index, key, value) => {
    const updated = [...conditions];

    if (key === "value" && updated[index].field === "mrp") {
      if (Number(value) < 0) return;
    }

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
    <Box p={5} mr={6} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Query Builder
      </Typography>

      {conditions.map((cond, index) => {
        const fieldType = detectType(cond.value, cond.field);

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
                {operators[fieldType].map((op) => (
                  <MenuItem key={op} value={op}>
                    {op}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {cond.operator === "between" ||
            cond.operator.toLowerCase() === "range" ? (
              <Box display="flex" gap={1}>
                <TextField
                  type={fieldType === "date" ? "date" : "number"}
                  inputProps={fieldType === "number" ? { min: 0 } : {}}
                  value={Array.isArray(cond.value) ? cond.value[0] : ""}
                  onChange={(e) =>
                    updateCondition(index, "value", [
                      e.target.value,
                      cond.value?.[1],
                    ])
                  }
                />
                <TextField
                  type={fieldType === "date" ? "date" : "number"}
                  inputProps={fieldType === "number" ? { min: 0 } : {}}
                  value={Array.isArray(cond.value) ? cond.value[1] : ""}
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
                  fieldType === "date"
                    ? "date"
                    : fieldType === "number"
                    ? "number"
                    : "text"
                }
                inputProps={fieldType === "number" ? { min: 0 } : {}}
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
