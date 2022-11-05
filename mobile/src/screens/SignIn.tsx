import { Fontisto } from "@expo/vector-icons";
import { Center, Icon, Text } from "native-base";
import Logo from "~/assets/logo.svg";
import { Button } from "~/components/Button";
import { useAuthContext } from "~/contexts/AuthContext";

interface SignInProps {}

export const SignIn: React.FC<SignInProps> = () => {
  const { signIn, isSigningIn } = useAuthContext();

  return (
    <Center flex={1} p={7}>
      <Logo width={212} height={40} />

      <Button
        type="secondary"
        title="Entrar com Google"
        mt={12}
        onPress={signIn}
        isLoading={isSigningIn}
        leftIcon={
          <Icon as={Fontisto} name="google" color="white" size="md" mr={2} />
        }
      />

      <Text color="white" textAlign="center" mt={4} fontSize="sm">
        Não utilizamos nenhuma informação além {"\n"} do seu e-mail para criação
        de sua conta.
      </Text>
    </Center>
  );
};
