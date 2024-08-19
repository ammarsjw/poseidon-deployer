export { buildPoseidon, buildPoseidonWasm } from "./src/poseidon_wasm.js";
import * as _poseidonContract from "./src/poseidon_gencontract.js";
export const poseidonContract = _poseidonContract;

export { default as buildPoseidonReference } from "./src/poseidon_reference.js";
export { default as buildPoseidonOpt } from "./src/poseidon_opt.js";
