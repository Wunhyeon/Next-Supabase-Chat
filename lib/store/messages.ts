import { create } from "zustand";

export type IMessage = {
  created_at: string;
  id: string;
  is_deleted: string | null;
  is_edit: boolean;
  text: string;
  user_id: string;
  users: {
    avatar_url: string;
    created_at: string;
    deleted_at: string | null;
    display_name: string;
    id: string;
    updated_at: string | null;
  } | null;
};

interface MessageState {
  messages: IMessage[];
  addMessage: (message: IMessage) => void;
  actionMessage: IMessage | undefined;
  setActionMessage: (message: IMessage | undefined) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: IMessage) => void;
}

export const useMessage = create<MessageState>()((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })), // 기존 state에 담겨있던 message들 + 이번에 작성한 메세지
  actionMessage: undefined,
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  optimisticDeleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => message.id != messageId),
      };
    }),
  optimisticUpdateMessage: (updateMessage) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => {
          if (message.id == updateMessage.id) {
            message.text = updateMessage.text;
            message.is_edit = updateMessage.is_edit;
          }
          return message;
        }),
      };
    }),
}));
