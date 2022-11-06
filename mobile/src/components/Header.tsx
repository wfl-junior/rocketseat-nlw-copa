import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Text } from "native-base";
import { CaretLeft, Export } from "phosphor-react-native";
import { ButtonIcon } from "./ButtonIcon";

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
} & (
  | {
      showShareButton?: false;
      onShare?: never;
    }
  | {
      showShareButton?: true;
      onShare: () => void;
    }
);

const EmptyBoxSpace = () => <Box w={6} h={6} />;

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showShareButton = false,
  onShare,
}) => {
  const { navigate } = useNavigation();

  function handleGoBack() {
    navigate("pools");
  }

  return (
    <HStack
      w="full"
      h={24}
      bgColor="gray.800"
      alignItems="flex-end"
      pb={5}
      px={5}
    >
      <HStack w="full" alignItems="center" justifyContent="space-between">
        {showBackButton ? (
          <ButtonIcon icon={CaretLeft} onPress={handleGoBack} />
        ) : (
          <EmptyBoxSpace />
        )}

        <Text
          color="white"
          fontFamily="medium"
          fontSize="md"
          textAlign="center"
        >
          {title}
        </Text>

        {showShareButton ? (
          <ButtonIcon icon={Export} onPress={onShare} />
        ) : (
          <EmptyBoxSpace />
        )}
      </HStack>
    </HStack>
  );
};
