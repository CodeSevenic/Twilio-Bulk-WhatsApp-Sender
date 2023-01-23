import React, { useState } from "react";
import { Client } from "@twilio/conversations";
import { addConversation } from "../../api";
import { Button } from "@twilio-paste/button";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../store";

interface NewConvoProps {
  client?: Client;
  collapsed: boolean;
}

const SendConversationToAll: React.FC<NewConvoProps> = (
  props: NewConvoProps
) => {
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
