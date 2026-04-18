import {
  Container,
  Grid,
  Paper,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useEffect, useEffectEvent, useState } from "react";
import type { MouseEvent } from "react";
import FilterBar from "../components/FilterBar";
import FloatingPopup from "../components/AbillitiesPopup";

type Filters = {
  name?: string;
  colors?: string;
  type?: string;
};

type CardForeignName = {
  language: string;
  imageUrl?: string;
};

type Card = {
  id: string;
  imageUrl?: string;
  text?: string;
  foreignNames?: CardForeignName[];
};

type CardsResponse = {
  cards?: Card[];
};

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [filters, setFilters] = useState<Filters>({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupAnchorEl, setPopupAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedCardText, setSelectedCardText] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const buildQuery = () => {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("pageSize", String(pageSize));

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });

    return params.toString();
  };


  const handleApplyFilters = (newFilters: Filters) => {
    setPage(1);
    setCards([]);
    setHasMore(true);
    setFilters(newFilters);
  };

  const fetchData = useEffectEvent(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const query = buildQuery();

      const response = await fetch(
        `https://api.magicthegathering.io/v1/cards?${query}`
      );

      if (!response.ok) return;

      const data: CardsResponse = await response.json();
      const nextCards = data.cards ?? [];

      if (nextCards.length === 0) {
        setHasMore(false); // 🛑 stop here
        return;
      }

      setCards((prev) => [...prev, ...nextCards]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  });

  const handleCardClick = (event: MouseEvent<HTMLElement>, card: Card) => {
    setPopupAnchorEl(event.currentTarget);
    setSelectedCardText(card.text ?? null);
    setIsPopupOpen(true);
  };

  const handlePopupOpen = () => {
    setSelectedCardText(null);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setPopupAnchorEl(null);
  };

  useEffect(() => {
    void Promise.resolve().then(() => {
      void fetchData();
    });
  }, [page, filters]);

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
              <Paper
                onClick={(event) => handleCardClick(event, value)}
                sx={{ cursor: "pointer", overflow: "hidden" }}
              >
                <img
                  src={pt?.imageUrl || value.imageUrl}
                  width="100%"
                  alt={value.id}
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
        onOpen={handlePopupOpen}
        onClose={handlePopupClose}
        anchorEl={popupAnchorEl}
        selectedCardText={selectedCardText}
      />

    </Container>
  );
}