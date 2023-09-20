export function Home() {
  return (
    <div className="prose prose-slate dark:prose-invert ">
      <h1>Public Media Gallery</h1>
      <p>
        This is a demo of Fireproof, a new web database that's built from the ground up for
        distributed applications. You can{' '}
        <a href="https://github.com/fireproof-storage/public-media-gallery">
          read the source code of this application on GitHub
        </a>
        , or follow along a tutorial about how to{' '}
        <a href="https://use-fireproof.com/docs/react-tutorial">
          use Fireproof to build something similar in React
        </a>
        . This app showcases Fireproof's integration with{' '}
        <a href="https://web3.storage">web3.storage</a> and <a href="https://ipfs.tech">IPFS</a>.
        While Fireproof can run on any cloud, the developer-friendly defaults showcased here are
        designed to make it possible to write full featured apps without needing a backend.
      </p>
      <p>
        In this example you login by validating your email address, and then upload images to your
        library. From there you can compose albums, and publish them to the web.
      </p>
      <p>
        <a href="https://en.wikipedia.org/wiki/Self-sovereign_identity">
          User accounts are self-sovereign
        </a>
        , powered by <a href="https://www.w3.org/TR/did-core/">DID</a> and{' '}
        <a href="https://ucan.xyz/">UCAN</a>, which means they are tied to private keys that live in
        your device and which no software can extract. This means that your account is truly yours,
        but it also means your devices need to be online at the same each time you setup a new
        device, because device setup involves the old device cryptographically certifying the new
        device.
      </p>
      <p>
        Part of the Fireproof hypothesis is that distributed identity and applications can be be
        made friendly enough for everyone, from developers to mainstream users. So while this demo
        relies on cutting edge technology, it's also designed to show how apps built like this can
        be compelling, fun, and usable. If you want to see an LLM-based app in this style, check out{' '}
        <a href="https://epiphany.fireproof.storage/">Epiphany, a customer development simulator</a>
        . Or try this technique to{' '}
        <a href="https://use-fireproof.com/docs/chatgpt-quick-start">use ChatGPT to build apps</a>{' '}
        using Fireproof.
      </p>
      <h2>The Future</h2>
      <p>
        This is just a demo app, and it's focussed on Fireproof's ability to publish to IPFS.
        Fireproof also has encrpyted file storage, so it'd be possible to build a similar app for
        private photo sharing.
      </p>
      <p>
        Currently the application doesn't resize your images or otherwise web-optimize them. We are
        planning to add these sorts of background jobs using distribute compute tools like{' '}
        <a href="https://docs.lilypadnetwork.org/">Lilypad</a> and{' '}
        <a href="https://www.bacalhau.org/">Bacalhau</a>. The long-term vision is of a complete
        platform made up of unstoppable protocols for{' '}
        <a href="https://www.oreilly.com/radar/the-paradigm-shift-to-cloudless-computing/">
          cloudless
        </a>{' '}
        apps.
      </p>
      <p>
        If this excites you, join our <a href="https://discord.gg/JkDbYXUG7W">Discord</a> or our{' '}
        <a href="https://github.com/fireproof-storage/fireproof/discussions">GitHub discussions</a>.
        The most helpful thing you can do is write apps and give us feedback on the database.
        Thanks!
      </p>
    </div>
  )
}
