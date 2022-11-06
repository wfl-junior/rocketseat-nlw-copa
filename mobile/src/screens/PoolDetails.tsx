import { useFocusEffect, useRoute } from "@react-navigation/native";
import { Center, HStack, Text, useToast, VStack } from "native-base";
import { useCallback, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "~/components/EmptyMyPoolList";
import { Guesses } from "~/components/Guesses";
import { Header } from "~/components/Header";
import { Loading } from "~/components/Loading";
import { Option } from "~/components/Option";
import type { PoolDTO } from "~/components/PoolCard";
import { PoolHeader } from "~/components/PoolHeader";
import { ToastAlert } from "~/components/ToastAlert";
import { api } from "~/services/api";

export interface PoolDetailsRouteParams {
  id: string;
}

interface PoolDetailsProps {}

export const PoolDetails: React.FC<PoolDetailsProps> = () => {
  const [pool, setPool] = useState<PoolDTO | null>(null);
  const [isFetchingPool, setIsFetchingPool] = useState(true);
  const [selectedOption, setSelectedOption] = useState<"guesses" | "ranking">(
    "guesses",
  );
  const toast = useToast();
  const { params } = useRoute();
  const { id } = params as PoolDetailsRouteParams;

  useFocusEffect(
    useCallback(() => {
      setIsFetchingPool(true);

      api
        .get<{ pool: PoolDTO }>(`/pools/${id}`)
        .then(({ data }) => setPool(data.pool))
        .catch(error => {
          console.log(error);

          toast.show({
            duration: 5000,
            placement: "top",
            id: "get-pools-error-toast",
            render: ({ id }) => (
              <ToastAlert
                title="Erro!"
                description="Ocorreu um erro ao buscar os dados do bolão."
                isClosable
                variant="top-accent"
                status="error"
                onClose={() => toast.close(id)}
              />
            ),
          });
        })
        .finally(() => setIsFetchingPool(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]),
  );

  if (isFetchingPool) {
    return <Loading />;
  }

  if (!pool) {
    return (
      <Center flex={1} bgColor="gray.900" px={5}>
        <Text
          fontFamily="heading"
          color="red.500"
          fontSize="lg"
          textAlign="center"
        >
          Não foi possível buscar os dados do bolão 😭{"\n"}
        </Text>
      </Center>
    );
  }

  async function handleShareCode() {
    await Share.share({
      message: pool!.code,
    });
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pool.title}
        showBackButton
        showShareButton
        onShare={handleShareCode}
      />

      {pool._count.participants ? (
        <VStack flex={1} px={5}>
          <PoolHeader data={pool} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={selectedOption === "guesses"}
              onPress={() => setSelectedOption("guesses")}
            />

            <Option
              title="Ranking do grupo"
              isSelected={selectedOption === "ranking"}
              onPress={() => setSelectedOption("ranking")}
            />
          </HStack>

          <Guesses poolId={pool.id} poolCode={pool.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pool.code} />
      )}
    </VStack>
  );
};
