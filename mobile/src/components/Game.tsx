import { getName } from "country-list";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";
import { Button, HStack, Text, useTheme, VStack } from "native-base";
import { Check, X } from "phosphor-react-native";
import { useState } from "react";

import { Team } from "./Team";

interface GuessDTO {
  id: string;
  gameId: string;
  createdAt: string;
  participantId: string;
  firstTeamPoints: number;
  secondTeamPoints: number;
}

export interface GameDTO {
  id: string;
  datetime: string;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  guess: null | GuessDTO;
}

interface GameProps {
  data: GameDTO;
  onConfirmGuess: () => void | Promise<void>;
  setFirstTeamPoints: (value: string) => void;
  setSecondTeamPoints: (value: string) => void;
}

export const Game: React.FC<GameProps> = ({
  data,
  setFirstTeamPoints,
  setSecondTeamPoints,
  onConfirmGuess,
}) => {
  const { colors, sizes } = useTheme();
  const [isConfirmingGuess, setIsConfirmingGuess] = useState(false);

  async function handleConfirmGuess() {
    setIsConfirmingGuess(true);
    await onConfirmGuess();
    setIsConfirmingGuess(false);
  }

  return (
    <VStack
      w="full"
      bgColor="gray.800"
      rounded="sm"
      alignItems="center"
      borderBottomWidth={3}
      borderBottomColor="yellow.500"
      mb={3}
      p={4}
    >
      <Text color="gray.100" fontFamily="heading" fontSize="sm">
        {getName(data.firstTeamCountryCode)} vs.{" "}
        {getName(data.secondTeamCountryCode)}
      </Text>

      <Text color="gray.200" fontSize="xs">
        {dayjs(data.datetime)
          .locale(ptBR)
          .format("DD [de] MMMM [de] YYYY [às] HH:00[h]")}
      </Text>

      <HStack
        mt={4}
        w="full"
        justifyContent="space-between"
        alignItems="center"
      >
        <Team
          code={data.firstTeamCountryCode}
          position="right"
          onChangeText={setFirstTeamPoints}
        />

        <X color={colors.gray[300]} size={sizes[6]} />

        <Team
          code={data.secondTeamCountryCode}
          position="left"
          onChangeText={setSecondTeamPoints}
        />
      </HStack>

      {!data.guess && (
        <Button
          size="xs"
          w="full"
          bgColor="green.500"
          mt={4}
          onPress={handleConfirmGuess}
          isDisabled={isConfirmingGuess}
          isLoading={isConfirmingGuess}
        >
          <HStack alignItems="center">
            <Text color="white" fontSize="xs" fontFamily="heading" mr={3}>
              CONFIRMAR PALPITE
            </Text>

            <Check color={colors.white} size={sizes[4]} />
          </HStack>
        </Button>
      )}
    </VStack>
  );
};
