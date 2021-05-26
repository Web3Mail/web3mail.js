import EventEmitter from 'events';

/**
 * The request arguments interface
 */
export interface RequestArguments {
	readonly method: string;
	readonly params?: readonly any[] | object;
}

export type EventType = string | symbol;

export type Listener = (...args: Array<any>) => void;

/**
 * EIP1193 compatible provider interface
 */
export interface Provider {
	request(args: RequestArguments): Promise<any>;
	on(eventName: EventType, listener: Listener): this;
	removeListener(eventName: EventType, listener: Listener): this;
}

/**
 * The provider message event object
 */
export interface ProviderMessage {
	readonly type: string;
	readonly data: any;
}
/**
 * If the Provider supports Ethereum RPC subscriptions, e.g. eth_subscribe,
 * the Provider MUST emit the message event when it receives a subscription
 * notification.
 * If the Provider receives a subscription message from e.g. an eth_subscribe
 * subscription, the Provider MUST emit a message event with a ProviderMessage
 * object of the following form:
 */
export interface EthSubscription extends ProviderMessage {
	readonly type: 'eth_subscription';
	readonly data: {
		readonly subscription: string;
		readonly result: any;
	};
}

/**
 * If the Provider becomes connected, the Provider MUST emit the event named connect.
 * This includes when:
 * The Provider first connects to a chain after initialization.
 * The Provider connects to a chain after the disconnect event was emitted.
 * This event MUST be emitted with an object of the following form:
 */
interface ProviderConnectInfo {
	readonly chainId: string;
}

/**
 * @abstract The Provider request rpc error interface
 */
export interface ProviderRpcError extends Error {
	code: number;
	data?: any;
}

export interface StatusCode {
	code: number;
	name: string;
	description: string;
}

/// Provider defined errors ...

export const statusUserRejectedRequest: StatusCode = {
	code: 4001,
	name: 'User Rejected Request',
	description: 'The user rejected the request.',
};

export const statusUnauthorized: StatusCode = {
	code: 4100,
	name: 'Unauthorized',
	description:
		'The requested method and/or account has not been authorized by the user.',
};

export const statusUnsupportedMethod: StatusCode = {
	code: 4200,
	name: 'Unsupported Method',
	description: 'The Provider does not support the requested method.',
};

export const statusDisconnected: StatusCode = {
	code: 4900,
	name: 'Disconnected',
	description: 'The Provider is disconnected from all chains.',
};

export const statusChainDisconnected: StatusCode = {
	code: 4901,
	name: 'Chain Disconnected',
	description: 'The Provider is not connected to the requested chain.',
};
