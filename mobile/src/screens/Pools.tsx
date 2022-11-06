import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Icon, VStack } from "native-base";
import { Button } from "~/components/Button";
import { Header } from "~/components/Header";

interface PoolsProps {}

export const Pools: React.FC<PoolsProps> = () => {
  const { navigate } = useNavigation();

  function handleFindPoolByCode() {
    navigate("find-pool");
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="Buscar bolão por código"
          onPress={handleFindPoolByCode}
          leftIcon={
            <Icon as={Octicons} color="black" name="search" size="md" mr={2} />
          }
        />
      </VStack>
    </VStack>
  );
};
