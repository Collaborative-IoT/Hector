import React from "react";
import { useCurrentRoomFromCache } from "../../shared-hooks/useCurrentRoomFromCache";
import { RoomChat } from "./chat/RoomChat";

interface RoomChatControllerProps {}

export const RoomChatController: React.FC<RoomChatControllerProps> = ({}) => {
    const data = useCurrentRoomFromCache();

    return <RoomChat users={[]} />;
};
