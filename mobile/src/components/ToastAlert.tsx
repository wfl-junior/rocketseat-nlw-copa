import {
  Alert,
  CloseIcon,
  HStack,
  IAlertProps,
  IconButton,
  Text,
  VStack,
} from "native-base";

type ToastAlertProps = IAlertProps & {
  title: string;
  description: string | React.ReactElement;
} & (
    | {
        isClosable?: false;
        onClose?: never;
      }
    | {
        isClosable?: true;
        onClose: () => void;
      }
  );

export const ToastAlert: React.FC<ToastAlertProps> = ({
  status,
  variant,
  title,
  description,
  isClosable,
  onClose,
  ...props
}) => (
  <Alert
    maxWidth="full"
    alignSelf="center"
    flexDirection="row"
    status={status ? status : "info"}
    variant={variant}
    mx={4}
    {...props}
  >
    <VStack space={1} flexShrink={1} w="full">
      <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
        <HStack space={2} flexShrink={1} alignItems="center">
          <Alert.Icon />

          <Text
            fontSize="lg"
            fontFamily="heading"
            flexShrink={1}
            color={
              variant === "solid"
                ? "lightText"
                : variant !== "outline"
                ? "darkText"
                : null
            }
          >
            {title}
          </Text>
        </HStack>

        {isClosable ? (
          <IconButton
            variant="unstyled"
            icon={<CloseIcon size={4} />}
            onPress={onClose}
            _icon={{
              color: variant === "solid" ? "lightText" : "darkText",
            }}
          />
        ) : null}
      </HStack>

      <Text
        px="6"
        fontSize="md"
        color={
          variant === "solid"
            ? "lightText"
            : variant !== "outline"
            ? "darkText"
            : null
        }
      >
        {description}
      </Text>
    </VStack>
  </Alert>
);
