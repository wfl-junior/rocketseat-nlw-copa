import { useNavigation } from "@react-navigation/native";
import { AxiosError } from "axios";
import { Heading, Text, useToast, VStack } from "native-base";
import { Fragment, useState } from "react";
import { Button } from "~/components/Button";
import { Header } from "~/components/Header";
import { Input } from "~/components/Input";
import type { PoolDTO } from "~/components/PoolCard";
import { ToastAlert } from "~/components/ToastAlert";
import { api } from "~/services/api";

interface FindPoolProps {}

export const FindPool: React.FC<FindPoolProps> = () => {
  const [poolCode, setPoolCode] = useState("");
  const [isJoiningPool, setIsJoiningPool] = useState(false);
  const { navigate } = useNavigation();
  const toast = useToast();

  async function handleJoinPool() {
    const code = poolCode.trim();
    if (!code) {
      const toastId = "find-pool-no-code-toast";
      if (toast.isActive(toastId)) return;

      return toast.show({
        duration: 5000,
        placement: "top",
        id: toastId,
        render: ({ id }) => (
          <ToastAlert
            title="Erro!"
            description="Informe o código do bolão."
            isClosable
            variant="top-accent"
            status="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    }

    setIsJoiningPool(true);

    try {
      const { data } = await api.post<{ pool: PoolDTO }>(
        `/pools/${poolCode}/join`,
      );
      setPoolCode("");

      toast.show({
        duration: 5000,
        placement: "top",
        id: "find-pool-success-toast",
        render: ({ id }) => (
          <ToastAlert
            title="Sucesso!"
            description={
              <Fragment>
                Você entrou no bolão{" "}
                <Text fontFamily="heading">{data.pool.title}</Text>
              </Fragment>
            }
            isClosable
            variant="top-accent"
            status="success"
            onClose={() => toast.close(id)}
          />
        ),
      });

      navigate("pools");
    } catch (error) {
      console.log(error);
      let errorMessage = "Não foi possível encontrar o bolão.";

      if (error instanceof AxiosError && error.response?.data.message) {
        switch (error.response.data.message) {
          case "Pool not found.": {
            errorMessage = "O bolão não existe.";
          }
          case "You already joined this pool.": {
            errorMessage = "Você já entrou nesse bolão.";
          }
        }
      }

      toast.show({
        duration: 5000,
        placement: "top",
        id: "find-pool-error-toast",
        render: ({ id }) => (
          <ToastAlert
            title="Erro!"
            description={errorMessage}
            isClosable
            variant="top-accent"
            status="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsJoiningPool(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de {"\n"} seu código único
        </Heading>

        <Input
          placeholder="Qual o código do bolão?"
          value={poolCode}
          onChangeText={setPoolCode}
          onSubmitEditing={handleJoinPool}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Button
          title="Buscar bolão"
          mt={2}
          isDisabled={isJoiningPool}
          isLoading={isJoiningPool}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
};
