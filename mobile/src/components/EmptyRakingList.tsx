import { Text } from "native-base";

interface EmptyRakingListProps {}

export const EmptyRakingList: React.FC<EmptyRakingListProps> = () => (
  <Text color="white" fontSize="sm" textAlign="center">
    O ranking desse bolão ainda não foi {"\n"}
    formado, aguarde os resultados.
  </Text>
);
