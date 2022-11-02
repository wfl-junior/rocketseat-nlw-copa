import type { GetServerSideProps, NextPage } from "next";

interface HomeProps {
  count: number;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await fetch("http://localhost:3333/pools/count");
  const data = (await response.json()) as HomeProps;

  return {
    props: data,
  };
};

const Home: NextPage<HomeProps> = ({ count }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900">
    <h1 className="text-center text-4xl font-semibold text-zinc-100">
      Pools Count: {count}
    </h1>
  </div>
);

export default Home;
