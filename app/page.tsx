import Image from "next/image";

export default function Home() {
  return (
    <section className="card flex flex-col items-center justify-evenly leading-8 p-8 rounded shadow-lg backdrop-blur relative left-2/4 top-2/4 -translate-x-1/2 -translate-y-1/2 w-auto w-fit h-fit">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center p-5">
          <Image
            src="/infinity.svg"
            alt="My icon"
            className="rounded-full"
            width={100}
            height={100}
            priority
          />
          <span className="italic text-xl m-5">毛稚文</span>
        </div>
        <p>具有前端开发、研发, 设计交互, 用户体验优化的经验。</p>
        <p>后端 C# 开发经验</p>
        <p>数学基础扎实, 良好的逻辑思维与学习能力</p>
        <h2 className="overline font-bold">开发工程师</h2>
      </div>
      <div className="flex items-center flex-col">
        <p className="italic">交互设计 | 技术设计 | 用户体验 | 项目管理</p>
        <p className="font-bold">
          Javascript | Typescript | C# | Vue | React | NodeJS | D3.js |
          ElementUI
        </p>
      </div>
    </section>
  );
}
