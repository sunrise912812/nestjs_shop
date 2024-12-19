import {
	Controller,
	Get,
	Query,
	UseGuards,
	Param,
	Post,
	Body,
} from '@nestjs/common';
import {
	PaginateAndFilterResponse,
	GetBestsellersResponse,
	GetNewResponse,
	FindOneResponse,
	GetByNameResponse,
	SearchResponse,
	SearchRequest,
	GetByNameRequest,
} from './types';
import { BoilerPartsService } from './boiler-parts.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { ApiOkResponse, ApiBody } from '@nestjs/swagger';

@Controller('boiler-parts')
export class BoilerPartsController {
	constructor(private readonly boilerPartsService: BoilerPartsService) { }

	@ApiOkResponse({ type: PaginateAndFilterResponse }) //Описание для документации добавляем в контролеры
	@UseGuards(AuthenticatedGuard)
	@Get()
	paginateAndFilter(@Query() query) {
		return this.boilerPartsService.paginateAndFilter(query);
	}

	@ApiOkResponse({ type: FindOneResponse })
	@UseGuards(AuthenticatedGuard)
	@Get('find/:id')
	getOne(@Param('id') id: string) {
		return this.boilerPartsService.findOne(id);
	}

	@ApiOkResponse({ type: GetBestsellersResponse })
	@UseGuards(AuthenticatedGuard)
	@Get('bestsellers')
	getBestsellers() {
		return this.boilerPartsService.bestsellers();
	}

	@ApiOkResponse({ type: GetNewResponse })
	@UseGuards(AuthenticatedGuard)
	@Get('new')
	getNew() {
		return this.boilerPartsService.new();
	}

	@ApiOkResponse({ type: SearchResponse })
	@ApiBody({ type: SearchRequest })
	@UseGuards(AuthenticatedGuard)
	@Post('search')
	search(@Body() { search }: { search: string }) {
		//Из боди вытащим поле seacrh
		return this.boilerPartsService.searchByString(search);
	}

	@ApiOkResponse({ type: GetByNameResponse })
	@ApiBody({ type: GetByNameRequest })
	@UseGuards(AuthenticatedGuard)
	@Post('name')
	getByName(@Body() { name }: { name: string }) {
		//Из боди вытащим поле seacrh
		return this.boilerPartsService.findOneByName(name);
	}
}
