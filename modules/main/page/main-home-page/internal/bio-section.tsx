export default function BioSection() {
  return (
    <section className="flex flex-col gap-4 text-center px-4">
      <p>
        欢迎来到
        <span className="font-bold text-purple-400"> ZHM </span>
        的博客空间
      </p>
      <p>
        我是一个...
      </p>
      <small className="text-xs md:text-sm">
        话说敲两下头像可以切换主题来着
        {' '}
        <span className="text-fuchsia-500">( ´◔ ‸◔`)</span>
      </small>
    </section>
  )
}
