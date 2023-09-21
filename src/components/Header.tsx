export function Header() {
  return (
    <header className="p-3 flex items-center justify-between bg-slate-400 dark:bg-slate-900 dark:text-slate-300 text-slate-800">
      <a href="/">
        <img
          src="https://fireproof.storage/static/img/logo-animated.svg"
          alt="Fireproof Logo"
          className="logo"
          width={'100px'}
        />
      </a>
      <nav>
        <ul className="flex">
          <li className="mr-6">
            <a href="https://use-fireproof.com">Docs</a>
          </li>
          <li className="mr-6">
            <a href="https://fireproof.storage/blog/">Blog</a>
          </li>
          <li className="mr-6">
            <a href="https://github.com/fireproof-storage/fireproof/discussions">Community</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
