import { useCallback, useState } from "react";

export function useSnackbar() {
  const [open, setOpen] = useState<boolean>(false);

  const openSnackbar = useCallback(() => {
    setOpen(true);
  }, []);

  const closeSnackbar = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    openSnackbar,
    closeSnackbar,
    open,
  };
}
