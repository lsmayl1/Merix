import { useCallback } from "react";
import { toast } from "react-toastify";
export type ApiError = {
	data?: {
		message?: string;
		statusCode?: number;
		success?: boolean;
	};
			status?: number;

};

const useApiError = () => {
  const handleError = useCallback((error:ApiError) => {
    // Check if error is from Axios or fetch
    const errorMessage =
      error.data?.message ||'An unexpected error occurred';

    const status = error.data?.statusCode || 500;

    // Customize toast based on status
    switch (status) {
      case 400:
        toast.error(`Bad Request: ${errorMessage}`);
        break;
      case 401:
        toast.error(`Unauthorized: ${errorMessage}`);
        break;
      case 404:
        toast.error(`Not Found: ${errorMessage}`);
        break;
      default:
        toast.error(`Error: ${errorMessage}`);
        break;
    }
  }, []);

  return { handleError };
};

export default useApiError;