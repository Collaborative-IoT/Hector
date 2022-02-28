import { CommunicationRoom,BaseUser,Client,AuthCredentials,ClientSubscriber, User, AllUsersInRoomResponse, GetFollowListResponse } from "@collaborative/arthur";
import React, { useState } from "react";
import { wsApiBaseUrl } from "../lib/constants";
import { useRouter } from "next/router";

type Nullable<T> = T | null;
type StateChange = Nullable<(update: ((prevState: null) => null) | null) => void>;

export const MainContext = React.createContext<{
    dash_live_rooms:Nullable<CommunicationRoom[]>;
    client: Nullable<Client>;
    user:Nullable<BaseUser>;
    all_users_in_room:Nullable<User[]>;
    my_followers:Nullable<Array<number>>;
    create_client:() => void;
    set_my_followers:StateChange;
    set_dash_live_rooms:StateChange
  }>({
      dash_live_rooms:[],
      set_dash_live_rooms:null,
      client: null,
      user:null,
      all_users_in_room:null,
      create_client: ()=>{},
      my_followers:null,
      set_my_followers:null
  });  

  const initClient = (
      set_client:StateChange, 
      set_user:StateChange,
      set_all_users_in_room:StateChange,
      set_my_followers:StateChange)=>{
    
    if (typeof window !== 'undefined'){
        // connect to the server and authenticate
        try{
        const type_of_auth = localStorage.getItem("t-ciot") as string;
        const auth_access = localStorage.getItem("a-ciot") as string;
        const auth_refresh = localStorage.getItem("r-ciot") as string;
        let auth_credentials:AuthCredentials = {
            access:auth_access,
            refresh:auth_refresh,
            oauth_type:type_of_auth
        };
        var my_user_id:Nullable<number> = null;

        // setup the subscriber
        let subscriber =  new ClientSubscriber();
        console.log("the url" ,wsApiBaseUrl);
        let client = new Client(wsApiBaseUrl,subscriber,auth_credentials);
        subscriber.good_auth = (_prev:any)=>{
            client.send("my_data",{});
            client.send("get_top_rooms",{});
        }
        subscriber.your_data = (user_data:BaseUser)=>{
            
            set_user?((_prev:any)=>{
                return user_data;
            }):null;
            client.send("get_followers", {user_id:user_data.user_id});
            my_user_id = user_data.user_id;
        }
        subscriber.all_users_in_room = (room_data:AllUsersInRoomResponse) =>{
            set_all_users_in_room?((_prev:any)=>{
                return room_data;
            }):null;
        }
        subscriber.bad_auth =()=>{
            localStorage.setItem("ciot_auth_status","bad");
        }
        subscriber.followers = (data:GetFollowListResponse)=>{
            if (my_user_id != null && data.for_user == my_user_id){
                set_my_followers?((_prev:any)=>{
                    return data.user_ids;
                }):null;
            }
        }
        // begin routing incoming data + auth
        client.begin();

        set_client?((_prev:any)=>{
            return client;
        }):null;
    }
    catch(e){
        console.log("error");
        console.log(e);
    }
        
    }
}

export const MainContextProvider: React.FC<{}> = ({
    children,
  }) => {
    let [dash_live_rooms, set_dash_live_rooms] = useState(null);
    const [client, set_client] = useState(null);
    const [user, set_user] = useState(null);
    const [all_users_in_room, set_all_users_in_room] = useState(null);
    const [my_followers, set_my_followers] = useState(null);
    return(    
      <MainContext.Provider value={
          {
            dash_live_rooms:dash_live_rooms,
            client,
            user,
            all_users_in_room,
            my_followers,
            set_my_followers,
            set_dash_live_rooms:set_dash_live_rooms,
            create_client:()=>{initClient(set_client,set_user,set_all_users_in_room,set_my_followers);}
          }
      }>
          {children}

      </MainContext.Provider>
    )
  }