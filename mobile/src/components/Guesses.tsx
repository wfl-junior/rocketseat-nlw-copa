import { useFocusEffect } from "@react-navigation/native";
import { AxiosError } from "axios";
import { FlatList, Spinner, useToast } from "native-base";
import { Fragment, useCallback, useState } from "react";
import { api } from "~/services/api";
import { EmptyMyPoolList } from "./EmptyMyPoolList";
import { Game, GameDTO } from "./Game";
import { ToastAlert } from "./ToastAlert";

interface GuessesProps {
  poolId: string;
  poolCode: string;
}

export const Guesses: React.FC<GuessesProps> = ({ poolId, poolCode }) => {
  const [games, setGames] = useState<GameDTO[]>([]);
  const [isFetchingGames, setIsFetcthingGames] = useState(true);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");
  const toast = useToast();

  useFocusEffect(
    useCallback(() => {
      setIsFetcthingGames(true);

      api
        .get<{ games: GameDTO[] }>(`/pools/${poolId}/games`)
        .then(({ data }) => setGames(data.games))
        .catch(error => {
          console.log(error);

          toast.show({
            duration: 5000,
            placement: "top",
            id: "get-guesses-error-toast",
            render: ({ id }) => (
              <ToastAlert
                title="Erro!"
                description="Ocorreu um erro ao buscar os dados dos jogos."
                isClosable
                variant="top-accent"
                status="error"
                onClose={() => toast.close(id)}
              />
            ),
          });
        })
        .finally(() => setIsFetcthingGames(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poolId]),
  );

  function handleConfirmGuess(gameId: GameDTO["id"]) {
    return async () => {
      const firstPoints = firstTeamPoints.trim();
      const secondPoints = secondTeamPoints.trim();

      if (!firstPoints || !secondPoints) {
        return toast.show({
          duration: 5000,
          placement: "top",
          id: "confirm-guess-no-points-error-toast",
          render: ({ id }) => (
            <ToastAlert
              title="Erro!"
              description="Informe o placar do palpite."
              isClosable
              variant="top-accent"
              status="error"
              onClose={() => toast.close(id)}
            />
          ),
        });
      }

      try {
        await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
          firstTeamPoints: Number(firstPoints),
          secondTeamPoints: Number(secondPoints),
        });

        toast.show({
          duration: 5000,
          placement: "top",
          id: "confirm-guess-error-toast",
          render: ({ id }) => (
            <ToastAlert
              title="Sucesso!"
              description="Palpite realizado com sucesso!"
              isClosable
              variant="top-accent"
              status="success"
              onClose={() => toast.close(id)}
            />
          ),
        });
      } catch (error) {
        console.log(error);
        let errorMessage = "Ocorreu um erro ao confirmar palpite.";

        if (error instanceof AxiosError && error.response?.data.message) {
          switch (error.response.data.message) {
            case "You must join this pool first before making a guess for this game on it.": {
              errorMessage =
                "Você deve entrar no bolão antes de criar um palpite nele.";
            }
            case "You already have a guess for this game on this pool.": {
              errorMessage =
                "Você já tem um palpite criado para este jogo neste bolão.";
            }
            case "Game not found.": {
              errorMessage = "Jogo não encontrado.";
            }
            case "You cannot send guesses after the game's date.": {
              errorMessage =
                "Você não pode criar um palpite para um jogo que já aconteceu.";
            }
          }
        }

        toast.show({
          duration: 5000,
          placement: "top",
          id: "confirm-guess-error-toast",
          render: ({ id }) => (
            <ToastAlert
              title="Erro!"
              description={errorMessage}
              isClosable
              variant="top-accent"
              status="error"
              onClose={() => toast.close(id)}
            />
          ),
        });
      }
    };
  }

  return (
    <Fragment>
      {isFetchingGames ? (
        <Spinner color="yellow.500" size={48} />
      ) : (
        <FlatList
          data={games}
          keyExtractor={game => game.id}
          ListEmptyComponent={() => <EmptyMyPoolList code={poolCode} />}
          renderItem={({ item }) => (
            <Game
              data={item}
              onConfirmGuess={handleConfirmGuess(item.id)}
              setFirstTeamPoints={setFirstTeamPoints}
              setSecondTeamPoints={setSecondTeamPoints}
            />
          )}
        />
      )}
    </Fragment>
  );
};
