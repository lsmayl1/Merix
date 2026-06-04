import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../baseQuery.tsx";

export const DatabaseApi = createApi({
  reducerPath: "DatabaseApi",
  baseQuery,
  endpoints: (builder) => ({
    getTables: builder.query({
      query: () => "/database/tables",
    }),
    getTableRows: builder.query({
      query: ({ name, limit = 50, offset = 0 }: { name: string; limit?: number; offset?: number }) =>
        `/database/tables/${name}?limit=${limit}&offset=${offset}`,
    }),
    runQuery: builder.mutation({
      query: (sql: string) => ({ url: "/database/query", method: "POST", body: { sql } }),
    }),
  }),
});

export const { useGetTablesQuery, useGetTableRowsQuery, useRunQueryMutation } = DatabaseApi;
