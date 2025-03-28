import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useState } from "react";

const API = "http://localhost:3000";
export const queryClient = new QueryClient();

export const ApiContext = createContext(null);

const FetchData = async () => {
  const res = await axios.get(`${API}/products`);
  return res.data;
};

const FetchById = async (id) => {
  const res = await axios.get(`${API}/products/${id}`);
  return res.data;
};

const generateBarcode = async (unit) => {
  const res = await axios.post(`${API}/products/generate-barcode`, {
    unit: unit,
  });
  return res.data.barcode;
};

const UpdateData = async (product) => {
  const res = await axios.put(`${API}/products/${product.product_id}`, product);
  return res.data;
};

const PostProduct = async (product) => {
  const res = axios.post(`${API}/products`, product);
  return res.data;
};

const DeleteProduct = async (id) => {
  const res = await axios.delete(`${API}/products/${id}`);
  return res;
};

export const ApiProvider = ({ children }) => {
  const [form, setForm] = useState({
    name: "",
    category: "mehsul",
    barcode: "",
    buyPrice: 0.0,
    sellPrice: 0.0,
    unit: "piece",
  });

  // Post Product
  const postMutation = useMutation({
    mutationFn: PostProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Mutation hatası:", error);
    },
  });
  // getProducts
  const { data, isLoading, error, isSuccess, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: FetchData,
    staleTime: 60 * 1000,
  });
  // getProductById
  const {
    data: productById,
    isLoading: productLoading,
    isSuccess: productSuccess,
    error: productFetchError,
  } = useQuery({
    queryKey: ["productById", form.product_id, form.barcode],
    queryFn: () => FetchById(form.product_id || form.barcode), // ID'yi doğrudan geç
    enabled: false,
  });
  // updateProducts
  const mutation = useMutation({
    mutationFn: UpdateData,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Mutation hatası:", error);
    },
  });

  // generate barcode
  const { data: generatedBarcode } = useQuery({
    queryFn: generateBarcode,
    enabled: false,
  });
  // delete Product
  const { isLoading: deleteLoading } = useQuery({
    queryFn: () => {
      DeleteProduct(form.product_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    enabled: false,
  });

  const values = {
    form,
    setForm,
    data,
    isLoading,
    error,
    isSuccess,
    refetch,
    updateProduct: mutation.mutate, // Mutation fonksiyonu
    PutLoading: mutation.isLoading, // Mutation durumu
    PutSuccess: mutation.isSuccess,
    PutError: mutation.error,
    NewProduct: postMutation.mutate, // Mutation fonksiyonu
    PostLoading: postMutation.isLoading, // Mutation durumu
    PostSuccess: postMutation.isSuccess,
    PostError: postMutation.error,
    FetchById,
    productSuccess,
    productById,
    generatedBarcode,
    generateBarcode,
    DeleteProduct,
    queryClient,
  };
  return <ApiContext.Provider value={values}>{children}</ApiContext.Provider>;
};
