import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  alcoholic: number;
  availabilityType: string;
  sku: string;
  available: boolean;
  modifiers?: {
    id: number;
    name: string;
    minChoices: number;
    maxChoices: number;
    items: {
      id: number;
      name: string;
      price: number;
      maxChoices: number;
      available: boolean;
    }[];
  }[];
}

export interface MenuSection {
  id: number;
  name: string;
  description: string | null;
  position: number;
  visible: number;
  images: { id: number; image: string }[];
  items: MenuItem[];
}

interface MenuState {
  sections: MenuSection[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MenuState = {
  sections: [],
  status: "idle",
  error: null,
};

export const fetchMenuItems = createAsyncThunk(
  "menu/fetchMenuItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("api/menu");
      if (!response.ok) {
        throw new Error(`Error fetching menu: ${response.status}`);
      }

      const data = await response.json();

      const sections: MenuSection[] = data.sections.map((section: any) => ({
        id: section.id,
        name: section.name,
        description: section.description || null,
        position: section.position,
        visible: section.visible,
        images: section.images.map((image: any) => ({
          id: image.id,
          image: image.image,
        })),
        items: section.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.images?.[0]?.image || null,
          alcoholic: item.alcoholic,
          availabilityType: item.availabilityType,
          sku: item.sku,
          available: item.available,
          modifiers: item.modifiers?.map((modifier: any) => ({
            id: modifier.id,
            name: modifier.name,
            minChoices: modifier.minChoices,
            maxChoices: modifier.maxChoices,
            items: modifier.items.map((modifierItem: any) => ({
              id: modifierItem.id,
              name: modifierItem.name,
              price: modifierItem.price,
              maxChoices: modifierItem.maxChoices,
              available: modifierItem.available,
            })),
          })),
        })),
      }));

      return sections;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sections = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default menuSlice.reducer;
