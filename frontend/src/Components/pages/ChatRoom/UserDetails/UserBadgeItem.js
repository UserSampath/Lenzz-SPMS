import React from "react";
import { Box } from "@chakra-ui/layout";
import { CloseIcon } from "@chakra-ui/icons";
const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2} //horizontal
      py={1} //vertical
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="#A020F0"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.firstName + " " + user.lastName}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
