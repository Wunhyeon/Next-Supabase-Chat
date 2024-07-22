"use client";

import React from "react";
import { Input } from "./ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid"; // uuid import
import { useUser } from "@/lib/store/user"; // user 정보를 불러온다.
import { IMessage, useMessage } from "@/lib/store/messages";

export const ChatInput = () => {
  const supabase = createClient();

  const user = useUser((state) => state.user); // user 정보를 불러온다.
  const addMessage = useMessage((state) => state.addMessage); // addMessage function을 불러온다.

  // 메세지 전송 펑션
  const handleSendMessage = async (text: string) => {
    // 빈 메세지가 오지 못하도록 처리
    if (!text.trim().length) {
      toast.error("Message cant not be empty");
      return;
    }

    // optimistic update를 해줄 message
    const newMessage = {
      id: uuidv4(),
      text,
      user_id: user?.id,
      is_edit: false,
      created_at: new Date().toISOString(),
      users: {
        id: user?.id,
        avatar_url: user?.user_metadata.avatar_url,
        created_at: new Date().toISOString(),
        display_name: user?.user_metadata.user_name,
      },
    };

    const { data, error, status } = await supabase
      .from("messages")
      .insert({ text });

    addMessage(newMessage as IMessage); // 불러온 addMessage 펑션 사용하기

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-5">
      <Input
        placeholder="send message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // enter 키를 누르면 메세지가 전송되도록
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = ""; // 메세지를 전송하고 나서 칸을 비워준다.
          }
        }}
      />
    </div>
  );
};
