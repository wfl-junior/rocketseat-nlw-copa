import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import appPreviewImage from "~/assets/app-preview.png";
import avatarsExample from "~/assets/avatars-example.png";
import { Check } from "~/components/Check";
import { Logo } from "~/components/Logo";
import { fetchWrapper } from "~/utils/fetchWrapper";

interface HomeProps {
  userCount: number;
  poolCount: number;
  guessCount: number;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  return {
    props: await fetchWrapper<HomeProps>("/counts"),
  };
};

const Home: NextPage<HomeProps> = ({
  userCount,
  poolCount: _poolCount,
  guessCount,
}) => {
  const [poolCount, setPoolCount] = useState(_poolCount);
  const poolTitleInputRef = useRef<HTMLInputElement>(null);

  async function handleCreatePool(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const poolTitle = poolTitleInputRef.current?.value;

    if (!poolTitle) {
      return;
    }

    try {
      const { code } = await fetchWrapper<{ code: string }>("/pools", {
        method: "POST",
        body: JSON.stringify({ title: poolTitle }),
      });

      await navigator.clipboard.writeText(code);

      toast(
        `Bolão criado com sucesso! O código (${code}) foi copiado para a área de transferência.`,
        {
          type: "success",
          autoClose: 10000,
        },
      );

      setPoolCount(count => count + 1);
      poolTitleInputRef.current!.value = "";
    } catch (error) {
      toast("Falha ao criar o bolão, tente novamente!", {
        type: "error",
        autoClose: 3000,
      });
    }
  }

  return (
    <div className="mx-auto grid h-screen max-w-[1124px] grid-cols-1 items-center gap-28 px-4 lg:grid-cols-2">
      <main className="flex flex-col">
        <Logo />

        <h1 className="mt-14 text-5xl font-bold leading-tight text-white">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={avatarsExample} alt="" />

          <strong className="text-xl text-gray-100">
            <span className="text-ignite-500">
              +{userCount.toLocaleString()}
            </span>{" "}
            pessoas já estão usando
          </strong>
        </div>

        <form className="mt-10 flex gap-2" onSubmit={handleCreatePool}>
          <input
            ref={poolTitleInputRef}
            type="text"
            placeholder="Qual nome do seu bolão?"
            required
            className="flex-1 rounded border border-gray-600 bg-gray-800 py-4 px-6 text-sm text-gray-100"
          />

          <button
            type="submit"
            className="rounded bg-yellow-500 px-6 py-4 text-sm font-bold uppercase text-gray-900 transition-colors hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm leading-relaxed text-gray-300">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 flex items-center justify-between border-t border-gray-600 pt-10 text-gray-100">
          <div className="flex items-center gap-6">
            <Check />

            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                +{poolCount.toLocaleString()}
              </span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="h-14 w-px bg-gray-600" />

          <div className="flex items-center gap-6">
            <Check />

            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                +{guessCount.toLocaleString()}
              </span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
        className="mx-auto"
      />
    </div>
  );
};

export default Home;
