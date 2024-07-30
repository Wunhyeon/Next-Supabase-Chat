// components/ChatInput.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid"; // uuid import
import { useUser } from "@/lib/store/user"; // user 정보를 불러온다.
import { IMessage, useMessage } from "@/lib/store/messages";
import { RealtimeChannel } from "@supabase/supabase-js";

export const ChatInput = () => {
  const supabase = createClient();
  const channel = supabase.channel("chat-room"); // channel ***********

  const user = useUser((state) => state.user); // user 정보를 불러온다.
  const { addMessage, optimisticIds } = useMessage((state) => state); // addMessage function을 불러온다.
  const setOptimisticIDs = useMessage((state) => state.setOptimisticIds);

  // 메세지 전송 펑션
  const handleSendMessage = async (text: string) => {
    // 빈 메세지가 오지 못하도록 처리
    if (!text.trim().length) {
      toast.error("Message cant not be empty");
      return;
    }

    const newMessage = {
      id: uuidv4(),
      text,
      is_edit: false,
    };

    // optimistic update에 사용될 newMessage객체
    const newMessageForOpt = {
      ...newMessage,
      users: {
        id: user?.id,
        avatar_url: user?.user_metadata.avatar_url,
        created_at: new Date().toISOString(),
        display_name: user?.user_metadata.user_name,
      },
      created_at: new Date().toISOString(),
    };

    addMessage(newMessageForOpt as IMessage); // 불러온 addMessage 펑션 사용하기 optimistic Update로 자기가 메세지 보낸 걸 바로 표시해주기 위해
    setOptimisticIDs(newMessageForOpt.id); // 이 메세지를 작성한 쪽에서 같은 메세지가 또 올라오지 않게 하기 위해서.

    // send ***************
    const res = channel.send({
      type: "broadcast",
      event: "test",
      payload: { message: newMessageForOpt },
    });

    const { data, error, status } = await supabase
      .from("messages")
      .insert(newMessage);

    if (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("useEffect");

    return () => {
      console.log("remove Channel");
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-5">
      <Input
        placeholder="send message"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
            // enter 키를 누르면 메세지가 전송되도록.
            // e.nativeEvent.isComposing === false - 한글 두번 입력현상 방지
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = ""; // 메세지를 전송하고 나서 칸을 비워준다.
          }
        }}
      />
    </div>
  );
};
