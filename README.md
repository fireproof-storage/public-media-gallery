# Public Media Gallery

This is a demo of Fireproof, a new web database that's built from the ground up for distributed applications. This app showcases Fireproof's integration with web3.storage and IPFS. While Fireproof can run on any cloud, the developer-friendly defaults showcased here are designed to make it possible to write full featured apps without needing a backend.

In this example you login by validating your email address, and then upload images to your library. From there you can compose albums, and publish them to the web.

User accounts are self-sovereign, powered by DID and UCAN, which means they are tied to private keys that live in your device and which no software can extract. This means that your account is truly yours, but it also means your devices need to be online at the same each time you setup a new device, because device setup involves the old device cryptographically certifying the new device.

Part of the Fireproof hypothesis is that distributed identity and applications can be be made friendly enough for everyone, from developers to mainstream users. So while this demo relies on cutting edge technology, it's also designed to show how apps built like this can be compelling, fun, and usable.

![upload](https://github.com/fireproof-storage/public-media-gallery/assets/253/025d59e3-a1bb-4ca6-b6c2-cc7ac3ee7bfa)

Customize the style and layout of your gallery, then [publish it to a plain HTML link.](https://bafybeidekgfphvxv2ttcupfko3istu4qxjglnhgl7qq3mfciqkmusrrcs4.ipfs.w3s.link/album.html)

![gallery](https://github.com/fireproof-storage/public-media-gallery/assets/253/e09bcdc0-c2e4-4be3-9ee9-d0e5ff67f9c4)


## Developing

Run the app locally by cloning the repo and then running:

```bash
npm install
npm start
```

Please run `npx tsc` on pull requests to minimize cleanup.
