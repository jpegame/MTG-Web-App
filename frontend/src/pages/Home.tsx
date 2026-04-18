import {
  Container,
  Grid,
  Paper,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import FilterBar from "../components/FilterBar";
import FloatingPopup from "../components/EffectPopup";

type Filters = {
  name?: string;
  colors?: string;
  type?: string;
};

type ForeignName = {
  language?: string;
  imageUrl?: string;
};

type CardItem = {
  id: string;
  imageUrl?: string;
  foreignNames?: ForeignName[];
};

type CardResponse = {
  cards?: CardItem[];
};

export default function Home() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [filters, setFilters] = useState<Filters>({});

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("pageSize", String(pageSize));

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });

    return params.toString();
  }, [filters, page, pageSize]);


  const handleApplyFilters = (newFilters: Filters) => {
    setPage(1);
    setCards([]);
    setHasMore(true);
    setFilters(newFilters);
  };

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const query = buildQuery();

      const response = await fetch(
        `https://api.magicthegathering.io/v1/cards?${query}`
      );

      if (!response.ok) return;

      const data: CardResponse = await response.json();

      if (!data?.cards || data.cards.length === 0) {
        setHasMore(false); // 🛑 stop here
        return;
      }

      setCards((prev) => [...prev, ...(data.cards ?? [])]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [buildQuery, hasMore, loading]);

  useEffect(() => {
    void Promise.resolve().then(() => {
      void fetchData();
    });
  }, [fetchData]);

  return (
    <Container sx={{ maxWidth: "100% !important" }}>
      <FilterBar onApply={handleApplyFilters} />
      <Grid container spacing={2}>
        {cards.map((value) => {
          if (!value?.imageUrl) return null;

          const foreignNames = value.foreignNames || [];
          const pt = foreignNames.find(
            (lang) => lang.language === "Portuguese (Brazil)"
          );

          return (
            <Grid size={2} key={value.id}>
              <Paper>
                <img
                  src={pt?.imageUrl || value.imageUrl}
                  width="100%"
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <Box sx={{
        display: "flex", justifyContent: "center", mt: 4
      }}>
        {hasMore ? (
          <Button
            variant="contained"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Load more"}
          </Button>
        ) : (
          <Box sx={{ opacity: 0.6 }}>No more cards</Box>
        )}
      </Box>

      <FloatingPopup
        open={isPopupOpen}
        onOpen={() => setIsPopupOpen(true)}
        onClose={() => setIsPopupOpen(false)}
      />
    </Container>
  );
}
