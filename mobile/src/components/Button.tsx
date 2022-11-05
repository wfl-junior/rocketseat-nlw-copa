import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

interface ButtonProps extends IButtonProps {
  title: string;
  type?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({ title, type, ...props }) => (
  <ButtonNativeBase
    w="full"
    h={14}
    rounded="sm"
    fontSize="md"
    bg={type === "secondary" ? "red.500" : "yellow.500"}
    _pressed={{
      bg: type === "secondary" ? "red.400" : "yellow.600",
    }}
    {...props}
  >
    <Text
      fontSize="sm"
      fontFamily="heading"
      textTransform="uppercase"
      color={type === "secondary" ? "white" : "black"}
    >
      {title}
    </Text>
  </ButtonNativeBase>
);
