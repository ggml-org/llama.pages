const MIB_BYTES = 1_048_576;
const MB_PER_GB = 1024;
// Compatibility budget (mirrors the app's Model+Compatibility.swift):
//   budget      = RAM × RAM_BUDGET_RATIO − RAM_OVERHEAD_MB
//   weightBytes = fileBytes × QUANT_WEIGHT
// fits when weightBytes ≤ budget.
const RAM_BUDGET_RATIO = 0.75;
const RAM_OVERHEAD_MB = 2048;
const QUANT_WEIGHT = 1.05;
const INSTALL_SCHEME = 'llama';
const INSTALL_PATH = 'install';
const CLI_PARAMS_FLAG = 'serve -hf';

export {
	MIB_BYTES,
	MB_PER_GB,
	RAM_BUDGET_RATIO,
	RAM_OVERHEAD_MB,
	QUANT_WEIGHT,
	INSTALL_SCHEME,
	INSTALL_PATH,
	CLI_PARAMS_FLAG
};
