import { useDeafStore } from "../global-stores/useDeafStore";
import { useMuteStore } from "../global-stores/useMuteStore";
import { useWrappedConn } from "./useConn";

export const setDeaf = (conn: any, value: boolean) => {
    const { muted, setInternalMute } = useMuteStore.getState();
    if (muted) {
        setInternalMute(false, false);
    }
    useDeafStore.getState().setInternalDeaf(value);
};

export const useSetDeaf = () => {
    const conn = useWrappedConn();
    return (value: boolean) => {
        setDeaf(conn, value);
    };
};
