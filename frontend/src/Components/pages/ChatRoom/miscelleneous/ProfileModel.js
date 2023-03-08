import React from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Text} from "@chakra-ui/layout";
import { IconButton,Button } from '@chakra-ui/button';
import { ModalContent, Modal,
    ModalOverlay,

    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, } from '@chakra-ui/modal';
    import { Image} from "@chakra-ui/image";
const ProfileModel = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
    {children ? (
      <span onClick={onOpen}>{children}</span>
    ) : (
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
    )}
    <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent h="410px">
        <ModalHeader
          fontSize="40px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
        >
          {user.name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          d="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Image
            borderRadius="full"
            boxSize="150px"
            src={user.pic}
            alt={user.name}
          />
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily="Work sans"
          >
            Email: {user.email}
          </Text>
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
 

