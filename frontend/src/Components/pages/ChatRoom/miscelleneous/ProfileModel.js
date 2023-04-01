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
import { Avatar } from '@chakra-ui/avatar';

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
      onClick={onOpen} />
    )}
    <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered >
      <ModalOverlay />
      <ModalContent >
        <ModalHeader
          fontSize="40px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
        >
          {user.firstName}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="space-between"
        >
        <Avatar
          size="xl"
          name={user.firstName}
          src={user.pic}/>
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
 

