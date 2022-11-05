import { Center, IPressableProps, Pressable, Text } from "native-base";

interface OptionProps extends IPressableProps {
  title: string;
  isSelected: boolean;
}

export const Option: React.FC<OptionProps> = ({
  title,
  isSelected = false,
  ...props
}: OptionProps) => (
  <Pressable flex={1} h={7} maxH={7} {...props}>
    <Center
      h="full"
      w="full"
      bgColor={isSelected ? "gray.600" : "transparent"}
      rounded="sm"
    >
      <Text color="gray.100" fontFamily="heading" fontSize="xs">
        {title}
      </Text>
    </Center>
  </Pressable>
);
