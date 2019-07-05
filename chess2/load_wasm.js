function loadwasm(filename) {
  return fetch(filename)
    .then(response => response.arrayBuffer())
    .then(bits => WebAssembly.compile(bits))
    .then(module => {
      return new WebAssembly.Instance(module)
    })
}

let wasm_or64;
let wasm_xor64;

loadWasm('bit_ops.wasm')
  .then(instance => {
    wasm_or64 = instance.exports._Z5or_64yy
    wasm_xor64 = instance.exports._Z5xor_64yy
  })