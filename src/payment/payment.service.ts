import { ForbiddenException, Injectable } from '@nestjs/common';
import { MakePaymentDto } from './dto/make-payment.dto';
import axios from 'axios';
import { CheckPaymentDto } from './dto/check-payment.dto';

@Injectable()
export class PaymentService {
	async makePayment(makePaymentDto: MakePaymentDto) {
		try {
			const { data } = await axios({
				method: 'POST',
				url: 'https://api.yookassa.ru/v3/payments',
				headers: {
					'Content-Type': 'application/json',
					'Idempotence-Key': Date.now(),
				},
				auth: {
					username: '311151',
					password: 'test_373FYdpZmpYst2RY1KWmzzVz7uk5ON3P1i8qzXlV5vQ',
				},
				data: {
					amount: {
						value: makePaymentDto.amount,
						currency: 'RUB',
					},
					capture: true,
					confirmation: {
						type: 'redirect',
						return_url: 'http://localhost:3001/order',
					},
					description: makePaymentDto.description
						? makePaymentDto.description
						: '',
				},
			});

			return data;
		} catch (error) {
			throw new ForbiddenException(error);
		}
	}

	async checkPayment(checkPaymentDto: CheckPaymentDto) {
		try {
			const { data } = await axios({
				method: 'GET',
				url: `https://api.yookassa.ru/v3/payments/${checkPaymentDto.paymentId}`,
				auth: {
					username: '311151',
					password: 'test_373FYdpZmpYst2RY1KWmzzVz7uk5ON3P1i8qzXlV5vQ',
				},
			});

			return data;
		} catch (error) {
			throw new ForbiddenException(error);
		}
	}
}
