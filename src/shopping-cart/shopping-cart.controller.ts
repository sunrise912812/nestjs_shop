import {
	Controller,
	Get,
	Param,
	UseGuards,
	Post,
	Body,
	Patch,
	Delete,
	Request,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { AddToCartDto } from './dto/add-to-cart-dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
	GetAllResponse,
	AddToCartResponse,
	UpdateCountRequest,
	UpdateCountResponse,
	UpdateTotalPriceResponse,
	UpdateTotalPriceRequest,
} from './types';

@Controller('shopping-cart')
export class ShoppingCartController {
	constructor(private readonly shoppingCartService: ShoppingCartService) { }

	@ApiOkResponse({ type: [GetAllResponse] })
	@UseGuards(AuthenticatedGuard)
	@Get(':userId')
	getAll(@Param('userId') userId: number | string, @Request() req) {
		if (req.user.userId == userId) {
			return this.shoppingCartService.findAll(userId);
		}
	}

	@ApiOkResponse({ type: AddToCartResponse })
	@UseGuards(AuthenticatedGuard)
	@Post('/add')
	addToCard(@Body() addToCartDto: AddToCartDto) {
		return this.shoppingCartService.add(addToCartDto);
	}

	@ApiOkResponse({ type: UpdateCountResponse })
	@ApiBody({ type: UpdateCountRequest })
	@UseGuards(AuthenticatedGuard)
	@Patch('/count/:partId')
	updateCount(
		@Body() { count }: { count: number },
		@Param('partId') partId: string | number,
		@Request() req,
	) {
		return this.shoppingCartService.updateCount(count, partId, req.user.userId);
	}

	@ApiOkResponse({ type: UpdateTotalPriceResponse })
	@ApiBody({ type: UpdateTotalPriceRequest })
	@UseGuards(AuthenticatedGuard)
	@Patch('/total-price/:partId')
	updateTotalPrice(
		@Body() { total_price }: { total_price: number },
		@Param('partId') partId: string | number,
		@Request() req,
	) {
		return this.shoppingCartService.updateTotalPrice(
			total_price,
			partId,
			req.user.userId,
		);
	}

	@UseGuards(AuthenticatedGuard)
	@Delete('/one/:partId')
	removeOne(@Param('partId') partId: string | number, @Request() req) {
		return this.shoppingCartService.remove(partId, req.user.userId);
	}

	@UseGuards(AuthenticatedGuard)
	@Delete('/all/:userId')
	removeAll(@Param('userId') userId: string | number, @Request() req) {
		if (req.user.userId == userId) {
			return this.shoppingCartService.removeAll(userId);
		}
	}
}
