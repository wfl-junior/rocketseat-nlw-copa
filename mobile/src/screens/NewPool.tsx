import { useNavigation } from "@react-navigation/native";
import { Heading, Text, useToast, VStack } from "native-base";
import { Fragment, useState } from "react";
import Logo from "~/assets/logo.svg";
import { Button } from "~/components/Button";
import { Header } from "~/components/Header";
import { Input } from "~/components/Input";
import { ToastAlert } from "~/components/ToastAlert";
import { api } from "~/services/api";

interface NewPoolProps {}

export const NewPool: React.FC<NewPoolProps> = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPoolTitle, setNewPoolTitle] = useState("");
  const { navigate } = useNavigation();
  const toast = useToast();

  async function handleCreateNewPool() {
    const title = newPoolTitle.trim();
    if (!title) {
      const toastId = "create-new-pool-no-title-toast";
      if (toast.isActive(toastId)) return;

      return toast.show({
        duration: 5000,
        placement: "top",
        id: toastId,
        render: ({ id }) => (
          <ToastAlert
            title="Erro!"
            description="Informe o nome do bolão."
            isClosable
            variant="top-accent"
            status="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    }

    setIsSubmitting(true);

    try {
      const { data } = await api.post<{ code: string }>("/pools", { title });

      setNewPoolTitle("");
      toast.show({
        duration: 5000,
        placement: "top",
        id: "create-new-pool-success-toast",
        render: ({ id }) => (
          <ToastAlert
            title="Sucesso!"
            description={
              <Fragment>
                Bolão <Text fontFamily="heading">{title}</Text> criado com
                sucesso. {"\n"}
                Código: <Text fontFamily="heading">{data.code}</Text>
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
      toast.show({
        duration: 5000,
        placement: "top",
        id: "create-new-pool-error-toast",
        render: ({ id }) => (
          <ToastAlert
            title="Erro!"
            description="Ocorreu um erro ao tentar criar o bolão."
            isClosable
            variant="top-accent"
            status="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa {"\n"} e compartilhe entre amigos!
        </Heading>

        <Input
          placeholder="Qual o nome do seu bolão?"
          onSubmitEditing={handleCreateNewPool}
          value={newPoolTitle}
          onChangeText={setNewPoolTitle}
          isDisabled={isSubmitting}
        />

        <Button
          title="Criar meu bolão"
          mt={2}
          onPress={handleCreateNewPool}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        />

        <Text fontSize="sm" color="gray.200" textAlign="center" px={8} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
};
