import http from 'http';
import { type ExtendedRequestInterface } from '../models/extended-request.interface.js';

export default class ExtendedRequest
	extends http.IncomingMessage
	implements ExtendedRequestInterface
{
	public params: Record<string, string> = {};
	public body = '';
}
