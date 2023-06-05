import React from "react";
import { Box, Text } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
const UserListItem = ({user, handleFunction }) => {
 
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
      <Avatar
      mr={2}
      size="sm"
      cursor="pointer"
      name={user.firstName}
      />
      <Box>
        <Text>{user.firstName}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
