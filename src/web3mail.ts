import { Provider, EventType, Listener } from './eip1193';
import { RpcResponse } from './rpc';
import { Address, MailMessage } from './mail';
import { providers } from 'ethers';

export enum KeyEncoder {
	mnemonic,
	raw,
}

/**
 * The web3 mail provider wrapper class
 */
export class Web3Mail {
	/// The eip1193 compatible provider
	private eip1193Provider: Provider;

	private web3Provider?: providers.Web3Provider;

	constructor(eip1193Provider: Provider) {
		this.eip1193Provider = eip1193Provider;
	}

	/**
	 * Get the web3 mail object connected provider
	 */
	get provider(): Provider {
		return this.eip1193Provider;
	}

	/**
	 * Get cached providers.Web3Provider
	 */
	get ethers(): providers.Web3Provider {
		if (this.web3Provider == null) {
			this.web3Provider = new providers.Web3Provider(
				this.eip1193Provider,
			);
		}

		return this.web3Provider!;
	}

	/**
	 * Register event listener
	 * @param eventName event name
	 * @param listener listener function
	 * @returns this object
	 */
	on(eventName: EventType, listener: Listener): this {
		this.eip1193Provider.on(eventName, listener);
		return this;
	}

	/**
	 * Remove event listener
	 * @param eventName event name
	 * @param listener listener function
	 * @returns this object
	 */
	removeListener(eventName: EventType, listener: Listener): this {
		this.eip1193Provider.removeListener(eventName, listener);
		return this;
	}

	/**
	 * Get web3mail node bound email address
	 * @returns
	 */
	async address(): Promise<string> {
		const response = (await this.eip1193Provider.request({
			method: 'web3mail_addresses',
		})) as RpcResponse<string>;

		return response.result!;
	}

	async send(message: MailMessage) {
		await this.eip1193Provider.request({
			method: 'web3mail_send_message',
			params: message,
		});
	}

	/**
	 * get message count from provide address
	 * @param from message from
	 * @returns message count
	 */
	async count(from: string): Promise<number> {
		const response = (await this.eip1193Provider.request({
			method: 'web3mail_count',
			params: [from],
		})) as RpcResponse<number>;

		return response.result!;
	}

	/**
	 * Fetch mail message content
	 * @param from message from address
	 * @param index message index
	 * @returns MailMessage object
	 */
	async fetch(from: string, index: number): Promise<MailMessage> {
		const response = (await this.eip1193Provider.request({
			method: 'web3mail_fetch',
			params: [from, index],
		})) as RpcResponse<MailMessage>;

		return response.result!;
	}
}
