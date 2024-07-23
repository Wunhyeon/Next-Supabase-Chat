"use client";

import { IMessage, useMessage } from "@/lib/store/messages";
import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { DeleteAlert, EditAlert } from "./MessageActions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const ListMessages = () => {
  // const { messages, addMessage, optimisticIds } = useMessage((state) => state); // zustand에 전역으로 저장된 state를 불러옴. // addMessage는 예전에 만든 메세지를 추가하는 메서드
  const {
    messages,
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage((state) => state); // zustand에 전역으로 저장된 state를 불러옴. // addMessage는 예전에 만든 메세지를 추가하는 메서드
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const supabase = createClient();

  useEffect(() => {
    console.log("messages : ", messages);
    const channel = supabase
      .channel("chat-room") // room id를 넣어준다. 여기서는 채팅방이 하나만 있으므로 chat-room으로 전부 통일시킨거다.
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          console.log("Change received!", payload);

          if (optimisticIds.includes(payload.new.id)) {
            return;
          }

          // 받아온 페이로드로 user 정보를 가져오기
          const { error, data } = await supabase
            .from("users")
            .select("*")
            .eq("id", payload.new.user_id)
            .single();

          if (error) {
            toast.error(error.message);
          } else {
            const newMessage = {
              ...payload.new,
              users: data,
            };
            addMessage(newMessage as IMessage);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          console.log("Change received!", payload);
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          console.log("Change received!", payload);
          optimisticUpdateMessage(payload.new as IMessage);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex-1  flex flex-col p-5 h-full overflow-y-auto"
      ref={scrollRef}
    >
      <div className="flex-1"></div>
      <div className="space-y-7">
        {messages.map((value, idx) => {
          return <Message key={idx} message={value} />;
        })}
      </div>
      <DeleteAlert />
      <EditAlert />
    </div>
  );
};

export default ListMessages;
