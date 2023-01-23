import { useEffect, useState } from "react";
import { ProductConversationsIcon } from "@twilio-paste/icons/esm/ProductConversationsIcon";
import { UserIcon } from "@twilio-paste/icons/esm/UserIcon";
import { Avatar } from "@twilio-paste/avatar";
import { Text } from "@twilio-paste/core";
import { Menu, MenuButton, useMenuState, MenuItem } from "@twilio-paste/menu";
import { ChevronDownIcon } from "@twilio-paste/icons/esm/ChevronDownIcon";
import React, { useMemo } from "react";
import styles from "../styles";
import { ConnectionState } from "@twilio/conversations";
import { db } from "../config";
import { ref, onValue } from "firebase/database";

type AppHeaderProps = {
  user: string;
  onSignOut: () => void;
  connectionState: ConnectionState;
};
const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  onSignOut,
  connectionState,
}) => {
  const menu = useMenuState();

  const [arcData, setArcData] = useState<any[]>([]);

  useEffect(() => {
    const starCountRef = ref(
      db,
      "1BkCdhX282Oi2IxrPzwOktENF0okwxSpKEM8ab8qNCm4/Sheet1/"
    );
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      const newPosts = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      console.log("NEW POSTS: ", newPosts);
      setArcData(newPosts);
    });
  }, []);

  const label: "online" | "connecting" | "offline" = useMemo(() => {
    switch (connectionState) {
      case "connected":
        return "online";
      case "connecting":
        return "connecting";
      default:
        return "offline";
    }
  }, [connectionState]);

  return (
    <div style={styles.appHeader}>
      <div style={styles.flex}>
        <ProductConversationsIcon
          color="colorTextInverse"
          size="sizeIcon70"
          decorative={false}
          title="app logo"
        />
        <div style={styles.appLogoTitle}>African Rainbow Capital</div>
      </div>
      <div style={styles.userTile}>
        <Avatar size="sizeIcon70" name="avatar example" icon={UserIcon} />
        <div
          style={{
            padding: "0 10px",
          }}
        >
          {user}
          <Text
            as="span"
            color={
              label === "online"
                ? "colorTextIconAvailable"
                : label === "connecting"
                ? "colorTextIconBusy"
                : "colorTextIconError"
            }
            style={{
              fontSize: "10px",
              display: "block",
              paddingTop: 5,
              lineHeight: 0,
            }}
          >
            {label === "online"
              ? "Online"
              : label === "connecting"
              ? "Connecting…"
              : "Offline"}
          </Text>
        </div>
        <MenuButton {...menu} variant="link" size="reset">
          <ChevronDownIcon
            color="colorTextInverse"
            decorative={false}
            title="Settings"
          />
        </MenuButton>
        <Menu {...menu} aria-label="Preferences">
          <MenuItem {...menu} onClick={onSignOut}>
            Sign Out
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default AppHeader;
