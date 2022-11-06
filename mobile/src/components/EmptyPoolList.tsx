import { useNavigation } from "@react-navigation/native";
import { Pressable, Row, Text } from "native-base";

interface EmptyPoolListProps {}

export const EmptyPoolList: React.FC<EmptyPoolListProps> = () => {
  const { navigate } = useNavigation();

  function handleNavigateToFindPool() {
    navigate("find-pool");
  }

  function handleNavigateToCreateNewPool() {
    navigate("new-pool");
  }

  return (
    <Row flexWrap="wrap" justifyContent="center">
      <Text color="white" fontSize="sm" textAlign="center">
        Você ainda não está participando de {"\n"} nenhum bolão, que tal
      </Text>

      <Pressable onPress={handleNavigateToFindPool}>
        <Text
          textDecorationLine="underline"
          color="yellow.500"
          textDecoration="underline"
        >
          buscar um por código
        </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center" mx={1}>
        ou
      </Text>

      <Pressable onPress={handleNavigateToCreateNewPool}>
        <Text textDecorationLine="underline" color="yellow.500">
          criar um novo
        </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center">
        ?
      </Text>
    </Row>
  );
};
