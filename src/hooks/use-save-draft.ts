export function useSaveDraft() {
  return {
    saveDraft: async () => {
      // TODO: Connect this hook to a real API endpoint for authenticated draft saving.
      return { ok: true as const };
    },
  };
}
