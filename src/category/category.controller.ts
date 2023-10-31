import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dto/create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { isUUID } from 'class-validator';
import { UpdateCategoryDTO } from './dto/update.dto';

@Controller()
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) { }

    // * Get All Categories
    @Get('categories')
    async all() {
        return this.categoryService.find({}, ['product'])
    }

    // * Get All Admin Categories
    @UseGuards(AuthGuard)
    @Get('admin/categories')
    async adminAll() {
        return this.categoryService.find({})
    }

    // * Create Category.
    @UseGuards(AuthGuard)
    @Post('admin/category')
    async create(
        @Body() body: CreateCategoryDTO
    ) {
        return this.categoryService.create(body)
    }

    // * Update Category
    @UseGuards(AuthGuard)
    @Put('admin/category/:id')
    async update(
        @Param('id') id: string,
        @Body() body: UpdateCategoryDTO
    ) {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }
        const category = await this.categoryService.findOne({ id })
        if (!category) {
            throw new BadRequestException("Category not found")
        }
        return this.categoryService.update(id, body)
    }

    // * Delete Category
    @UseGuards(AuthGuard)
    @Delete('admin/category/:id')
    async delete(
        @Param('id') id: string
    ) {
        return this.categoryService.delete(id)
    }
}
