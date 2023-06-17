import React from "react";
import { ViewIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Button } from "@chakra-ui/button";
import {
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";

import { Avatar } from "@chakra-ui/avatar";

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
           fontFamily="monospace"
            fontStyle="oblique"
            display="flex"
            justifyContent="center"
          >
            {user.firstName + " " + user.lastName}
         
           
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
            {/* <div>
              <img
                src={
                  user.profilePicture !== null
                    ? user.profilePicture
                    : "https://sampathnalaka.s3.eu-north-1.amazonaws.com/uploads/pngwing.com.png"
                }
                alt="svs"
                width="30"
                height="30"
                style={{
                  border: "1px solid",
                  borderRadius: "50%", // border radius of 50% makes the image circular
                }}
              />
            </div> */}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;
