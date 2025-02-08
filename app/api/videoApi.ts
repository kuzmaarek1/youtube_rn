import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const videoApi = createApi({
  reducerPath: "videoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.0.101:8000/" }),
  endpoints: (builder) => ({
    downloadVideo: builder.mutation<any, { url: string; userId: string }>({
      query: (data) => ({
        url: `download/${data.userId}`,
        method: "POST",
        body: data,
      }),
    }),
    segmentVideo: builder.mutation<
      any,
      { segment_duration: string; input_file: string }
    >({
      query: (data) => ({
        url: "split",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useDownloadVideoMutation, useSegmentVideoMutation } = videoApi;
