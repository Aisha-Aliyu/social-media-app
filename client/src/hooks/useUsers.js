import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "../api/axios";

export const useUserProfile = (username) =>
  useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const { data } = await api.get(`/users/${username}`);
      return data;
    },
    enabled: !!username,
  });

export const useToggleFollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => api.put(`/users/${userId}/follow`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
    onError: () => toast.error("Failed to update follow"),
  });
};

export const useSuggestions = () =>
  useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const { data } = await api.get("/users/suggestions");
      return data.users;
    },
    staleTime: 1000 * 60 * 5,
  });

export const useSearchUsers = (query) =>
  useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const { data } = await api.get(`/users/search?q=${query}`);
      return data.users;
    },
    enabled: query.length >= 1,
    staleTime: 1000 * 30,
  });

export const useNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data.notifications;
    },
    refetchInterval: 1000 * 30, // poll every 30s
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const { data } = await api.get("/notifications/unread-count");
      return data.count;
    },
    refetchInterval: 1000 * 30,
  });

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.put("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
};
