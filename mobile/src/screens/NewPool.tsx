import { Heading, Text, VStack } from "native-base";
import Logo from "~/assets/logo.svg";
import { Button } from "~/components/Button";
import { Header } from "~/components/Header";
import { Input } from "~/components/Input";

interface NewPoolProps {}

export const NewPool: React.FC<NewPoolProps> = () => (
  <VStack flex={1}>
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

      <Input placeholder="Qual o nome do seu bolão?" />
      <Button title="Criar meu bolão" mt={2} />

      <Text fontSize="sm" color="gray.200" textAlign="center" px={8} mt={4}>
        Após criar seu bolão, você receberá um código único que poderá usar para
        convidar outras pessoas.
      </Text>
    </VStack>
  </VStack>
);
