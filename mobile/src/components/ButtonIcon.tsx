import { useTheme } from "native-base";
import { IconProps } from "phosphor-react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonIconProps extends TouchableOpacityProps {
  icon: React.FC<IconProps>;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon: Icon,
  ...props
}) => {
  const { colors, sizes } = useTheme();

  return (
    <TouchableOpacity {...props}>
      <Icon color={colors.gray[300]} size={sizes[6]} />
    </TouchableOpacity>
  );
};
