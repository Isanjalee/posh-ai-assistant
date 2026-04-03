export function useApprovalWorkflow() {
  return {
    requestApproval: async () => {
      // TODO: Replace with a sales/design approval workflow API when the dashboard is introduced.
      return { ok: true as const };
    },
  };
}
