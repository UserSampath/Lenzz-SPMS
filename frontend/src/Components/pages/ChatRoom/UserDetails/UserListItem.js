import React from "react";
import { Box, Text } from "@chakra-ui/layout";
import AvatarPro from "./AvatarPro";

const UserListItem = ({ user, handleFunction, props }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#075d88",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <AvatarPro member={user} />
      <Box style={{ marginLeft: "15px" }}>
        <Text>
          {user.firstName} {user.lastName}
        </Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
