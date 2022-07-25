<div align="center">
  <h1>Soya Sauce</h1>
  <p>Encryption so simple you can't <i>!@#%</i> it up.</p>
  <p>Welcome to the Soya Sauce repository. This is a very rudimentary library for data encryption & decryption. It simply wraps the <code>libsodium</code> library, granting a very easy-to-use implementation to its secure API.</p>
  	<span>
		<a href="#installation">Installation</a>
		<span>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
		<a href="#usage">Usage</a>
		<span>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
		<a href="#disclaimer">Disclaimer</a>
	</span>
</div>
<hr>

## Installation

```bash
npm install soya-sauce
```

## Usage

Let's say Badri 💁‍♂️ and Akinyi 💁‍♀️ want to be able to communicate under the following conditions...

- The message cannot be read while stored.
- The message cannot be intercepted and read in transit.

In order to do this, we can generate a private-public key-pair for both Badri and Akinyi, in which the public key can be freely shared amongst themselves and publicly, and in which the private key will be securely held.

While the public key allows you to encrypt a message intended for a recipient, the private key is the only key which allows you to decrypt the message. Granted the private key does not get into the hands of others, messages intended for a recipient cannot be read.

```ts
import { SecretBox, generateKeyPair } from "soya-sauce";

const box = new SecretBox().withoutMasterKey();

const badri = generateKeyPair();
const akinyi = generateKeyPair();

(async function encryptThenDecrypt() {
  const messageForBadriFromAkinyi = await box.encrypt("Hey, how are you? 🙃", {
    public: badri.public,
    private: akinyi.private,
  });

  console.log(messageForBadriFromAkinyi); // <Buffer 95 ce 66 87 d6 d5 31 ...

  const decryptedMessageFromAkinyi = await box.decrypt(
    messageForBadriFromAkinyi,
    {
      public: akinyi.public,
      private: badri.private,
    }
  );

  console.log(decryptedMessageFromAkinyi.toString()); // Hey, how are you? 🙃
})();
```

<br>

If you want to add a master key to this flow, simply initialize the `SecretBox` class using the `withMasterKey` method. This will encrypt each message using a hash generated from the provided text, increasing the resulting time complexity.

```ts
import { SecretBox, generateKeyPair } from "soya-sauce";

const box = new SecretBox().withMasterKey("<MASTER_KEY>");

const badri = generateKeyPair();
const akinyi = generateKeyPair();

(async function encryptThenDecrypt() {
  const messageForBadriFromAkinyi = await box.encrypt("Hey, how are you? 🙃", {
    public: badri.public,
    private: akinyi.private,
  });

  console.log(messageForBadriFromAkinyi); // <Buffer f5 cc ad 67 7f 10 d1 ...

  const decryptedMessageFromAkinyi = await box.decrypt(
    messageForBadriFromAkinyi,
    {
      public: akinyi.public,
      private: badri.private,
    }
  );

  console.log(decryptedMessageFromAkinyi.toString()); // Hey, how are you? 🙃
})();
```

## Disclaimer

You should know how to properly store, share, transmit, generate, and use secrets before using this library. Usage of this library will not _actually automagically_ make you not !@#% something up.
Proceed with caution, and store user data safely.
