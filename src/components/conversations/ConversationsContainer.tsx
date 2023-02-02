import React, { useState } from "react";
import { Client } from "@twilio/conversations";
import { ChevronDoubleLeftIcon } from "@twilio-paste/icons/esm/ChevronDoubleLeftIcon";
import { Box } from "@twilio-paste/core";
import { ChevronDoubleRightIcon } from "@twilio-paste/icons/esm/ChevronDoubleRightIcon";

import CreateConversationButton from "./CreateConversationButton";
import ConversationsList from "./ConversationsList";
import styles from "../../styles";
import SendConversationToAll from "./SendConversationToAll";
import { ReduxConversation } from "../../store/reducers/convoReducer";

interface ConvosContainerProps {
  client?: Client;
}

const ConversationsContainer: React.FC<ConvosContainerProps> = (
  props: ConvosContainerProps
) => {
  const [listHidden, hideList] = useState(false);

  return (
    <Box
      className="left-container"
      style={
        listHidden
          ? { ...styles.convosWrapper, ...styles.collapsedList }
          : styles.convosWrapper
      }
    >
      <Box style={styles.newConvoButton}>
        <SendConversationToAll client={props.client} collapsed={listHidden} />
      </Box>
      {/* <Box style={styles.newConvoButton}>
        <CreateConversationButton
          client={props.client}
          collapsed={listHidden}
        />
      </Box> */}
      <Box className="convo-Container" style={styles.convoList}>
        {!listHidden ? <ConversationsList /> : null}
      </Box>
      <Box style={styles.collapseButtonBox}>
        <Box
          paddingTop="space30"
          style={{
            paddingLeft: 10,
            paddingRight: 10,
          }}
          onClick={() => hideList(!listHidden)}
        >
          {listHidden ? (
            <ChevronDoubleRightIcon decorative={false} title="Collapse" />
          ) : (
            <ChevronDoubleLeftIcon decorative={false} title="Collapse" />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ConversationsContainer;
