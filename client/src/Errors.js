class LocationNotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = "LocationNotFoundError";
		this.code = 1;
		this.message = message;
	}
}

class OurGatewayError extends Error {
	constructor(message) {
		super(message);
		this.name = "OurGatewayError";
		this.code = 2;
		this.message = message;
	}
}

class ForecaTimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = "ForecaTimeoutError";
		this.code = 3;
		this.message = message;
	}
}

class TooManyRequestsError extends Error {
	constructor(message) {
		super(message);
		this.name = "TooManyRequestsError";
		this.code = 4;
		this.message = message;
	}
}

class SomethingExplodedError extends Error {
	constructor(message) {
		super(message);
		this.name = "SomethingExplodedError";
		this.code = 5;
		this.message = message;
	}
}

export {LocationNotFoundError,OurGatewayError,ForecaTimeoutError,TooManyRequestsError,SomethingExplodedError}