import { Center, Text } from "native-base";

interface SignInProps {}

export const SignIn: React.FC<SignInProps> = () => (
  <Center flex={1} bgColor="gray.900">
    <Text fontFamily="heading" fontSize="4xl" color="white">
      Hello World
    </Text>
  </Center>
);
