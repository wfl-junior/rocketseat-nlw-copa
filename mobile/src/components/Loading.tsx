import { Center, Spinner } from "native-base";

interface LoadingProps {}

export const Loading: React.FC<LoadingProps> = () => (
  <Center flex={1} bgColor="gray.900">
    <Spinner color="yellow.500" />
  </Center>
);
