import {
  Paper,
  TextField,
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";

const COLORS = [
  { value: "w", label: "Branco" },
  { value: "u", label: "Azul" },
  { value: "g", label: "Verde" },
  { value: "r", label: "Vermelho" },
  { value: "b", label: "Preto" },
];

type Filters = {
  cmc?: string;
  colors?: string;
};

type Props = {
  onApply: (filters: Filters) => void;
};

export default function FilterBar({ onApply }: Props) {
  const [cmc, setCmc] = useState("");
  const [colors, setColors] = useState<string[]>([]);

  const handleApply = () => {
    onApply({
      cmc: cmc || undefined,
      colors: colors.length ? colors.join(",") : undefined,
    });
  };

  const handleClear = () => {
    setCmc("");
    setColors([]);
    onApply({});
  };

  return (
    <Paper
      sx={{
        position: "sticky",
        top: 16,
        zIndex: 10,
        mb: 3,
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <TextField
        label="Custo"
        value={cmc}
        onChange={(e) => setCmc(e.target.value)}
        type="number"
        sx={{ maxWidth: 120 }}
      />

      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Cores</InputLabel>
        <Select
          multiple
          value={colors}
          onChange={(e) => setColors(e.target.value as string[])}
          input={<OutlinedInput label="Cores" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={COLORS.find((color) => color.value == value)?.label} />
              ))}
            </Box>
          )}
        >
          {COLORS.map((color) => (
            <MenuItem key={color.value} value={color.value}>
              {color.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Buttons */}
      <Button variant="contained" onClick={handleApply}>
        Apply
      </Button>

      <Button variant="outlined" onClick={handleClear}>
        Clear
      </Button>
    </Paper>
  );
}
