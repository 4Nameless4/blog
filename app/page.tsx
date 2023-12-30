import UseSVG from "../components/usesvg";

export default function Home() {
  return (
    <section className=" flex items-center justify-center w-full h-full">
      <iframe
        src="./background/index.html"
        className="w-screen h-screen absolute box-border"
      ></iframe>
    </section>
  );
}
