const env = {
	VITE_ENV: import.meta.env.VITE_ENV || 'development'
};

for (let key in env) {
	if (env[key] == undefined) {
		throw new Error(`env.${key} not set`);
	}
}

export default env;
