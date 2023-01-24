import React, { useMemo, useState } from "react";
import { Client } from "@twilio/conversations";
import { addConversation } from "../../api";
import { Button } from "@twilio-paste/button";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, AppState } from "../../store";
import { ReduxConversation } from "../../store/reducers/convoReducer";
import { getSdkConversationObject } from "../../conversations-objects";

interface NewConvoProps {
  client?: Client;
  collapsed: boolean;
}

const SendConversationToAll: React.FC<NewConvoProps> = (
  props: NewConvoProps
) => {
  const conversations = useSelector((state: AppState) => state.convos);
  const dispatch = useDispatch();
  const { updateCurrentConversation, addNotifications, updateParticipants } =
    bindActionCreators(actionCreators, dispatch);

  const sendToAll = async (title: string) => {
    const convo = await addConversation(
      title,
      updateParticipants,
      props.client,
      addNotifications
    );
    updateCurrentConversation(convo.sid);
  };

  // const sdkConvo = useMemo(
  //   () => getSdkConversationObject(props.convo),
  //   [props.convo.sid]
  // );

  return (
    <>
      <Button
        fullWidth
        variant="secondary"
        onClick={() => sendToAll("Sibusiso")}
      >
        Send Template Communication to All Investors
      </Button>
    </>
  );
};

export default SendConversationToAll;
