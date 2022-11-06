import { Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, Icon, Spinner, useToast, VStack } from "native-base";
import { useCallback, useState } from "react";
import { Button } from "~/components/Button";
import { EmptyPoolList } from "~/components/EmptyPoolList";
import { Header } from "~/components/Header";
import { PoolCard, PoolDTO } from "~/components/PoolCard";
import { ToastAlert } from "~/components/ToastAlert";
import { api } from "~/services/api";

interface PoolsProps {}

export const Pools: React.FC<PoolsProps> = () => {
  const { navigate } = useNavigation();
  const [pools, setPools] = useState<PoolDTO[]>([]);
  const [isFetchingPools, setIsFetchingPools] = useState(true);
  const toast = useToast();

  useFocusEffect(
    useCallback(() => {
      setIsFetchingPools(true);

      api
        .get<{ pools: PoolDTO[] }>("/pools")
        .then(({ data }) => setPools(data.pools))
        .catch(error => {
          console.log(error);

          toast.show({
            duration: 5000,
            placement: "top",
            id: "get-pools-error-toast",
            render: ({ id }) => (
              <ToastAlert
                title="Erro!"
                description="Ocorreu um erro ao buscar os dados dos bolões."
                isClosable
                variant="top-accent"
                status="error"
                onClose={() => toast.close(id)}
              />
            ),
          });
        })
        .finally(() => setIsFetchingPools(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  function handleNavigateToFindPool() {
    navigate("find-pool");
  }

  function handleOpenPoolDetails(id: PoolDTO["id"]) {
    return () => {
      navigate("pool-details", { id });
    };
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
          onPress={handleNavigateToFindPool}
          leftIcon={
            <Icon as={Octicons} color="black" name="search" size="md" mr={2} />
          }
        />
      </VStack>

      {isFetchingPools ? (
        <Spinner color="yellow.500" size={48} />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={pool => pool.id}
          renderItem={({ item }) => (
            <PoolCard data={item} onPress={handleOpenPoolDetails(item.id)} />
          )}
          px={5}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={EmptyPoolList}
        />
      )}
    </VStack>
  );
};
