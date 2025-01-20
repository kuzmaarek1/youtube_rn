import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const videoApi = createApi({
  reducerPath: "videoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.0.113:8000/" }),
  endpoints: (builder) => ({
    downloadVideo: builder.mutation<any, { url: string }>({
      query: (data) => ({
        url: "download",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useDownloadVideoMutation } = videoApi;
