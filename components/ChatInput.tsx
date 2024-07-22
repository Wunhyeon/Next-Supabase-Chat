"use client";

import React from "react";
import { Input } from "./ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export const ChatInput = () => {
  const supabase = createClient();

  // 메세지 전송 펑션
  const handleSendMessage = async (text: string) => {
    const { data, error, status } = await supabase
      .from("messages")
      .insert({ text });

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
