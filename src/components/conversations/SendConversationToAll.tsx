import React, { useEffect, useState } from "react";
import { Client } from "@twilio/conversations";
import { addConversation, addParticipant } from "../../api";
import { Button } from "@twilio-paste/button";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, AppState } from "../../store";
import {
  ERROR_MODAL_MESSAGES,
  UNEXPECTED_ERROR_MESSAGE,
  WHATSAPP_PREFIX,
} from "../../constants";
import { getSdkConversationObject } from "../../conversations-objects";
import { unexpectedErrorNotification } from "../../helpers";
import { db } from "../../config";
import { onValue, ref } from "firebase/database";
import { PlusIcon } from "@twilio-paste/icons/esm/PlusIcon";

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

  const [arcData, setArcData] = useState<any[]>([]);

  const date = new Date();
  let hours = date.getHours();
  let minutes: any = date.getMinutes();
  let seconds: any = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  const time = hours + ":" + minutes + ":" + seconds + " " + ampm;
  console.log(time);

  useEffect(() => {
    const starCountRef = ref(
      db,
      "1BkCdhX282Oi2IxrPzwOktENF0okwxSpKEM8ab8qNCm4/Sheet1/"
    );
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const newPosts = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setArcData(newPosts);
    });
  }, []);

  const onMessageSend = async (message: string, convo: any) => {
    if (message.length == 0) {
      return;
    }

    const currentDate: Date = new Date();
    const sdkConvo = getSdkConversationObject(convo);

    const newMessageBuilder = sdkConvo.prepareMessage().setBody(message);

    console.log(newMessageBuilder);

    const messageIndex = await newMessageBuilder.build().send();

    try {
      await sdkConvo.advanceLastReadMessageIndex(messageIndex ?? 0);
    } catch (e) {
      unexpectedErrorNotification(addNotifications);
      return Promise.reject(UNEXPECTED_ERROR_MESSAGE);
    }
  };

  console.log(arcData);

  const sendToAll = async (
    title: string,
    senderNumber: string,
    participantNumber: string,
    message: string
  ) => {
    const convo = await addConversation(
      title,
      updateParticipants,
      props.client,
      addNotifications
    );
    updateCurrentConversation(convo.sid);
    try {
      await addParticipant(
        WHATSAPP_PREFIX + participantNumber,
        WHATSAPP_PREFIX + senderNumber,
        false,
        convo,
        addNotifications
      ).then((res) => console.log(res));

      await onMessageSend(message, convo);
    } catch (e) {
      console.log(ERROR_MODAL_MESSAGES.ADD_PARTICIPANT);
    }
  };

  const bulkSend = () => {
    arcData.map((contact) => {
      const message = `Good day ${contact.Name}, \n\nThank you for your continued support of Ubuntu-Botho Investments. \n\nPlease find our latest newsletter on the link below. \n\nWe look forward to hearing from you if you have any questions. \n\nKind Regards, \nUbuntu-Botho Investments`;
      // const message = `Good day ${contact.Name}, \n\nThank you for your continued support of Ubuntu-Botho Investments. \n\nPlease find our latest newsletter: https://dev2.marketsonline.co.za/african-rainbow-capital/ \n\nWe look forward to hearing from you if you have any questions. \nJust reply “Hi” to this message. \n\nKind Regards, \nUbuntu-Botho Investments`;
      sendToAll(contact.Name, "27600598118", contact.Number, message);
    });
  };

  return (
    <>
      <div>
        <small
          style={{
            textAlign: "center",
            display: "block",
            margin: "0 0 10px auto",
            color: "#119baa",
            fontWeight: "bold",
          }}
        >
          Updated at {time}
        </small>
      </div>
      {props.collapsed ? (
        <Button fullWidth variant="secondary" onClick={() => bulkSend()}>
          All
        </Button>
      ) : (
        <Button fullWidth variant="secondary" onClick={() => bulkSend()}>
          Send Template Communication to All Investors
        </Button>
      )}
    </>
  );
};

export default SendConversationToAll;
