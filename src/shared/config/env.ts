export const env = {
  liffId: import.meta.env.VITE_LIFF_ID as string,
  sheetsId: import.meta.env.VITE_GOOGLE_SHEETS_ID as string,
  googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY as string,
} as const;
