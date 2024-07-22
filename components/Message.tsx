import { IMessage } from "@/lib/store/messages";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useUser } from "@/lib/store/user";

const MessageMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Message = ({ message }: { message: IMessage }) => {
  const user = useUser((state) => state.user); // 유저 정보 가져오기

  return (
    <div className="flex gap-2">
      <div>
        <Image
          src={message.users?.avatar_url!}
          alt={message.users?.display_name!}
          width={40}
          height={40}
          className="rounded-full right-2"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center  justify-between">
          <div className="flex items-center gap-1">
            <h1 className="font-bold">{message.users?.display_name}</h1>
            <h1 className="text-sm text-gray-400">
              {new Date(message.created_at).toDateString()}
            </h1>
          </div>
          {/* 현재 로그인되어있는 유저와 메세지 작성자 유저의 아이디가 같을때만 수정메뉴가 보일 수 있도록. */}
          {message.users?.id === user?.id && <MessageMenu />}
        </div>
        <p className="text-gray-300">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
