import { IImageProps, Image } from "native-base";

interface FlagProps extends IImageProps {}

export const Flag: React.FC<FlagProps> = props => (
  <Image {...props} alt="Bandeira" w={8} h={6} mx={3} />
);
