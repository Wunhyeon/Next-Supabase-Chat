import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMessage } from "@/lib/store/messages";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export function DeleteAlert() {
  const actionMessage = useMessage((state) => state.actionMessage); // 앞에서 action Message 설정해준 걸 불러온다.
  const optimisticDeleteMessage = useMessage(
    (state) => state.optimisticDeleteMessage
  );

  const handleDeleteMessage = async () => {
    const supabase = createClient();
    optimisticDeleteMessage(actionMessage?.id!);

    const { data, error } = await supabase
      .from("messages")
      .delete()
      .eq("id", actionMessage?.id!); // eq는 쿼리에서 WHERE 과 같은 뜻이다. 아마도 equal을 표현한게 아닐까 추측해본다.

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully Delete a Message");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
            {/* 테스트를 위해 */}
            {actionMessage?.text}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const MessageActions = () => {
  return;
};

export default MessageActions;
