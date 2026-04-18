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

const TYPES = [
  { value: "creature", label: "Criatura" },
  { value: "instant", label: "Instantâneo" },
  { value: "sorcery", label: "Feitiço" },
  { value: "enchantment", label: "Encantamento" },
  { value: "artifact", label: "Artefato" },
]

type Filters = {
  cmc?: string;
  colors?: string;
  type?: string;
};

type Props = {
  onApply: (filters: Filters) => void;
};

export default function FilterBar({ onApply }: Props) {
  const [cmc, setCmc] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const handleApply = () => {
    onApply({
      cmc: cmc || undefined,
      colors: colors.length ? colors.join(",") : undefined,
      type: types.length ? types.join(",") : undefined,
    });
  };

  const handleClear = () => {
    setCmc("");
    setColors([]);
    onApply({});
    setTypes([]);
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
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        <TextField
          label="Custo"
          value={cmc}
          onChange={(e) => setCmc(e.target.value)}
          type="number"
          size="small"
          sx={{ width: 100 }}
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
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Tipos</InputLabel>
          <Select
            multiple
            value={types}
            onChange={(e) => setTypes(e.target.value as string[])}
            input={<OutlinedInput label="Tipos" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={TYPES.find((type) => type.value == value)?.label} />
                ))}
              </Box>
            )}
          >
            {TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      </Box>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        {/* Buttons */}
        <Button variant="contained" onClick={handleApply}>
          Aplicar
        </Button>

        <Button variant="outlined" onClick={handleClear}>
          Limpar
        </Button>
      </Box>
    </Paper>
  );
}
