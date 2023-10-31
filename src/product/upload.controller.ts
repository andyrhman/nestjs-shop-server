import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer'
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class UploadController {

    @Post('admin/upload')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename(_, file, callback) {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return callback(null, `${randomName}${extname(file.originalname)}`);
            },
        })
    }))
    uploadFile(@UploadedFile() file) {
        return {
            url : `http://localhost:8000/api/admin/${file.path}`
        }
    }

    @Get('admin/uploads/:path')
    async getImage(
        @Param('path') path,
        @Res() response: Response
    ){
        response.sendFile(path, {root: 'uploads'});
    }
}