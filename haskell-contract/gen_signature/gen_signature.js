function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

async function main() {
  let key = await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256"
    },
    true,
    ["sign"]
  )
  let message = "My message"
  let data = new TextEncoder("utf-8").encode(message)
  let signatureRaw = await window.crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: "SHA-256"
    },
    key.privateKey,
    data
  )

  let r = buf2hex(signatureRaw.slice(0, 32))
  let s = buf2hex(signatureRaw.slice(32, 64))
  let publicKey = await window.crypto.subtle.exportKey("jwk", key.publicKey)

  console.log(r)
  console.log(s)
  console.log(publicKey)
}

main()