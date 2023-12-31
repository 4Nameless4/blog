export default async function Home() {
  return (
    <section className=" flex items-center justify-center w-full h-full">
      <iframe
        title="Home"
        src={process.env.StaticSERVER + "/starts/index.html"}
        className="w-screen h-screen absolute box-border border-0"
      ></iframe>
    </section>
  );
}
